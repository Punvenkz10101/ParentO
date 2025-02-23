'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Bell, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Star,
  Settings,
  Menu,
  ChevronRight, 
  Copy, 
  X,
  Plus,
  Trash2,
  LogOut, 
  User,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { socket } from '../lib/socket';
import { useSocket } from '../context/SocketContext';
import api from '../lib/axios';
import axios from 'axios';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  
  // Move all state declarations to the top
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState(null);  // Move this up
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasClassroom, setHasClassroom] = useState(false);
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [studentParentDetails, setStudentParentDetails] = useState({});
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityDate, setNewActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTasks, setSelectedTasks] = useState({
    completion: false,
    photo: false,
    video: false
  });
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementDescription, setNewAnnouncementDescription] = useState("");
  const [parentsProgress] = useState([
    { 
      name: 'Parent A', 
      studentName: 'Student A', 
      points: 85,
      activitiesCompleted: 8,
      totalActivities: 10,
      lastActive: '2 hours ago' 
    },
    { 
      name: 'Parent B', 
      studentName: 'Student B', 
      points: 65,
      activitiesCompleted: 6,
      totalActivities: 10,
      lastActive: '1 hour ago' 
    },
    { 
      name: 'Parent C', 
      studentName: 'Student C', 
      points: 90,
      activitiesCompleted: 9,
      totalActivities: 10,
      lastActive: '30 mins ago' 
    },
    { 
      name: 'Parent D', 
      studentName: 'Student D', 
      points: 45,
      activitiesCompleted: 4,
      totalActivities: 10,
      lastActive: '4 hours ago' 
    },
    { 
      name: 'Parent E', 
      studentName: 'Student E', 
      points: 70,
      activitiesCompleted: 7,
      totalActivities: 10,
      lastActive: '1 hour ago' 
    }
  ]);
  const [showLeaderboardOverlay, setShowLeaderboardOverlay] = useState(false);
  const [activities, setActivities] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [completedActivities, setCompletedActivities] = useState({});
  const [parentProgress, setParentProgress] = useState([]);

  const leaderboardData = [
    { name: "Parent A", points: 100, studentName: "Student A" },
    { name: "Parent B", points: 90, studentName: "Student B" },
    { name: "Parent C", points: 85, studentName: "Student C" },
    { name: "Parent D", points: 80, studentName: "Student D" },
    { name: "Parent E", points: 75, studentName: "Student E" },
    { name: "Parent F", points: 70, studentName: "Student F" },
    { name: "Parent G", points: 65, studentName: "Student G" },
    { name: "Parent H", points: 60, studentName: "Student H" },
    { name: "Parent I", points: 55, studentName: "Student I" },
    { name: "Parent J", points: 50, studentName: "Student J" },
  ];

  const medalIcons = ["🥇", "🥈", "🥉"];

  const formatNumberToEmoji = (num) => {
    if (num <= 3) return medalIcons[num - 1];
    
    // Convert number to string and map each digit to emoji
    return num.toString().split('').map(digit => {
      const emojiMap = {
        '0': '0️⃣',
        '1': '1️⃣',
        '2': '2️⃣',
        '3': '3️⃣',
        '4': '4️⃣',
        '5': '5️⃣',
        '6': '6️⃣',
        '7': '7️⃣',
        '8': '8️⃣',
        '9': '9️⃣'
      };
      return emojiMap[digit];
    }).join('');
  };

  const { isConnected } = useSocket();
  const [activityError, setActivityError] = useState(null);

  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  // First useEffect - Handle authentication and userType
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    // Set userType only if it's not already set to 'teacher'
    const userType = localStorage.getItem('userType');
    if (userType !== 'teacher') {
      localStorage.setItem('userType', 'teacher');
    }

    const userName = localStorage.getItem("userName");
    if (userName) {
      setName(userName);
    }
  }, []); // Remove navigate from dependencies to prevent loops

  // Second useEffect - Handle socket connections
  useEffect(() => {
    if (!socket || !classroom?.classCode) return;

    const handleSocketError = (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Retrying...');
    };

    const handleNewActivity = (activity) => {
      if (activity.classCode === classroom.classCode) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        
        if (activityDate.getTime() === today.getTime()) {
          setTodaysActivities(prev => {
            const exists = prev.some(a => a._id === activity._id);
            if (!exists) {
              return [...prev, activity];
            }
            return prev.map(a => a._id === activity._id ? activity : a);
          });
        }
        
        setActivities(prev => {
          const exists = prev.some(a => a._id === activity._id);
          if (!exists) {
            return [...prev, activity];
          }
          return prev.map(a => a._id === activity._id ? activity : a);
        });
      }
    };

    const handleActivityDeleted = (activityId) => {
      setTodaysActivities(prev => prev.filter(activity => activity._id !== activityId));
      setActivities(prev => prev.filter(activity => activity._id !== activityId));
    };

    const handleClassroomDeleted = (classCode) => {
      if (classCode === classroom.classCode) {
        setClassroom(null);
        setHasClassroom(false);
        setTodaysActivities([]);
        setActivities([]);
        setAnnouncements([]);
        toast.info('Classroom has been deleted');
      }
    };

    socket.on('connect_error', handleSocketError);
    socket.on('new_activity', handleNewActivity);
    socket.on('activity_deleted', handleActivityDeleted);
    socket.on('classroom_deleted', handleClassroomDeleted);
    socket.on('activity_error', setActivityError);

    return () => {
      socket.off('connect_error', handleSocketError);
      socket.off('new_activity', handleNewActivity);
      socket.off('activity_deleted', handleActivityDeleted);
      socket.off('classroom_deleted', handleClassroomDeleted);
      socket.off('activity_error', setActivityError);
    };
  }, [socket, classroom]);

  // Third useEffect - Fetch classroom details
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/classroom/teacher/classrooms');
        
        if (isMounted) {
          if (response.data && response.data.length > 0) {
            setClassroom(response.data[0]);
            setClassrooms(response.data);
            setHasClassroom(true);
          }
          setError('');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching classroom:', error);
          setError('Failed to load classrooms');
          toast.error('Failed to load classrooms');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Fourth useEffect - Handle announcements
  useEffect(() => {
    if (classroom?.classCode) {
      fetchAnnouncements();
    }
  }, [classroom]);

  const handleLogout = () => {
    const userType = localStorage.getItem('userType'); // Store userType before clearing
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('userType', userType); // Restore userType
    navigate('/', { replace: true });
  };

  const [showPreviousAnnouncements, setShowPreviousAnnouncements] = useState(false);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [oldAnnouncements, setOldAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    if (!classroom?.classCode) return;

    try {
      const response = await api.get(`/api/announcement/classroom/${classroom.classCode}`);
      
      // Split announcements into recent (≤ 7 days) and previous (> 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recent = [];
      const old = [];
      
      response.data.forEach(announcement => {
        const announcementDate = new Date(announcement.createdAt);
        if (announcementDate >= sevenDaysAgo) {
          recent.push(announcement);
        } else {
          old.push(announcement);
        }
      });
      
      // Sort announcements by date (newest first)
      recent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      old.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setRecentAnnouncements(recent);
      setOldAnnouncements(old);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    }
  };

  const handleAddAnnouncement = async () => {
    if (!classroom?.classCode) {
      toast.error('Please create a classroom first');
      return;
    }

    if (newAnnouncementTitle.trim() && newAnnouncementDescription.trim()) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/api/announcement/create', 
          {
            title: newAnnouncementTitle.trim(),
            description: newAnnouncementDescription.trim(),
            classCode: classroom.classCode,
            createdAt: new Date().toISOString()
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Fetch updated announcements
        await fetchAnnouncements();
        
        setNewAnnouncementTitle("");
        setNewAnnouncementDescription("");
        setShowAnnouncementForm(false);
        toast.success('Announcement added successfully');
      } catch (error) {
        console.error('Error adding announcement:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/');
        } else {
          toast.error('Failed to add announcement. Please try again.');
        }
      }
    } else {
      toast.error('Please fill in both title and description');
    }
  };

  // Add this new state for students list
  const [studentsList] = useState([
    { id: 1, name: "Student A", parentName: "Parent A", attendance: "85%", rollNo: "001" },
    { id: 2, name: "Student B", parentName: "Parent B", attendance: "90%", rollNo: "002" },
    { id: 3, name: "Student C", parentName: "Parent C", attendance: "75%", rollNo: "003" },
    { id: 4, name: "Student D", parentName: "Parent D", attendance: "95%", rollNo: "004" },
    { id: 5, name: "Student E", parentName: "Parent E", attendance: "88%", rollNo: "005" },
    // Add more students as needed
  ]);

  // Add this new state for progress form
  const [showProgressForm, setShowProgressForm] = useState(false);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await api.post('/api/classroom/teacher/classroom', 
        { name: newClassroomName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setClassrooms([...classrooms, response.data]);
      setHasClassroom(true);
      setNewClassroomName('');
      setShowCreateClassroom(false);
      toast.success('Classroom created successfully');
    } catch (err) {
      console.error('Error creating classroom:', err);
      setError('Failed to create classroom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchParentDetails = async (parentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/parent/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching parent details:', error);
      return null;
    }
  };

  const viewClassroomDetails = async (classroom) => {
    if (!classroom) return;
    
    setSelectedClassroom(classroom);
    setShowDetailsModal(true);
    
    // Fetch parent details for each student
    const parentDetailsMap = {};
    for (const student of classroom.students || []) {
      if (student?.parent && student.parent._id) {  
        const parentDetails = await fetchParentDetails(student.parent._id);
        if (parentDetails) {
          parentDetailsMap[student.parent._id] = parentDetails;
        }
      }
    }
    setStudentParentDetails(parentDetailsMap);
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (!classroomId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      await axios.delete(`http://localhost:5000/api/classroom/teacher/classroom/${classroomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove classroom from state
      setClassrooms(prev => prev.filter(c => c._id !== classroomId));
      setHasClassroom(false);
      setClassroom(null);
      toast.success('Classroom deleted successfully');
    } catch (error) {
      console.error('Error deleting classroom:', error);
      toast.error(error.response?.data?.message || 'Failed to delete classroom');
    }
  };

  const handleAddActivity = async () => {
    try {
      if (!newActivityTitle.trim()) {
        toast.error('Please enter activity name');
        return;
      }

      if (!classroom?.classCode) {
        toast.error('No classroom selected');
        return;
      }

      const response = await api.post('/api/activities/create', {
        title: newActivityTitle.trim(),
        description: newActivityDescription.trim(),
        date: newActivityDate,
        classCode: classroom.classCode
      });

      // Update activities state
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activityDate = new Date(response.data.date);
      activityDate.setHours(0, 0, 0, 0);
      
      if (activityDate.getTime() === today.getTime()) {
        setTodaysActivities(prev => [...prev, response.data]);
      }
      
      setActivities(prev => [...prev, response.data]);
      
      // Clear form and close it
      setNewActivityTitle('');
      setNewActivityDescription('');
      setNewActivityDate(new Date().toISOString().split('T')[0]);
      setShowActivityForm(false);  // Close the form
      
      toast.success('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error(error.response?.data?.message || 'Failed to add activity');
    }
  };

  // Modify the fetchActivities function to include completion data
  const fetchActivities = async (classCode) => {
    if (!classCode) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        `/api/activities/classroom/${classCode}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayActs = response.data.filter(activity => {
          const activityDate = new Date(activity.date);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() === today.getTime();
        });

        // Process completion data
        const completions = {};
        response.data.forEach(activity => {
          if (activity.completions && activity.completions.length > 0) {
            completions[activity._id] = activity.completions;
          }
        });
        
        setCompletedActivities(completions);
        setTodaysActivities(todayActs);
        setActivities(response.data);
        setActivityError(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivityError('Failed to fetch activities');
      toast.error('Failed to fetch activities');
    }
  };

  // Add socket listener for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('activity_completed', (data) => {
      setCompletedActivities(prev => ({
        ...prev,
        [data.activityId]: [...(prev[data.activityId] || []), {
          parentName: data.parentName,
          points: data.points,
          completedAt: new Date()
        }]
      }));
    });

    return () => {
      socket.off('activity_completed');
    };
  }, [socket]);

  // Add this useEffect to fetch activities when classroom changes
  useEffect(() => {
    if (classroom?.classCode) {
      fetchActivities(classroom.classCode);
      fetchParentProgress(classroom.classCode);
    }
  }, [classroom]);

  // Add this function to handle activity deletion
  const handleDeleteActivity = async (activityId) => {
    try {
      if (window.confirm('Are you sure you want to delete this activity?')) {
        await api.delete(`/api/activities/${activityId}`);
        
        // Update local state
        setTodaysActivities(prev => prev.filter(activity => activity._id !== activityId));
        setActivities(prev => prev.filter(activity => activity._id !== activityId));
        
        toast.success('Activity deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  // Add this function to fetch parent progress
  const fetchParentProgress = async (classCode) => {
    try {
      const response = await api.get(`/api/activities/classroom/${classCode}`);
      if (response.data) {
        // Create a map to store parent progress
        const progressMap = new Map();

        // Process all activities and their completions
        response.data.forEach(activity => {
          activity.completions.forEach(completion => {
            if (!progressMap.has(completion.parentId)) {
              progressMap.set(completion.parentId, {
                name: completion.parentName,
                points: 0,
                activitiesCompleted: 0,
                totalActivities: response.data.length
              });
            }

            const parentData = progressMap.get(completion.parentId);
            parentData.points += completion.points || 0;
            parentData.activitiesCompleted += 1;
          });
        });

        // Convert map to array and sort by points
        const progressArray = Array.from(progressMap.values())
          .sort((a, b) => b.points - a.points);

        setParentProgress(progressArray);
      }
    } catch (error) {
      console.error('Error fetching parent progress:', error);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="border-b relative  bg-white/75 backdrop-blur-lg fixed top-0 w-full z-50 h-20 min-h-[5rem]">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto h-full relative">
          {/* Logo on the left */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#00308F]">ParentO</h1>
          </div>

          {/* Add this new div for the centered title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          </div>

          {/* Avatar Dropdown on the right */}
          <div className="flex items-center flex-shrink-0 w-[48px]">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none ">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/avatars/teacher.png" alt="Teacher" />
                  <AvatarFallback className="text-lg"> {firstLetter}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-lg">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-base cursor-pointer"
                  onClick={() => navigate('/teacher/profile')}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-base text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome</h2>
              <p className="opacity-90">Welcome, {name}!</p>
            </div>
            <Avatar className="h-16 w-16 border-4 border-white/50">
              <AvatarImage src="/avatars/teacher.png" alt="Teacher" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* First Row: Today's Activities and Parent Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Activities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-[#00308F] mr-2" />
                  Today's Activities
                </CardTitle>
                <Button onClick={() => setShowActivityForm(true)} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysActivities.map((activity, index) => (
                    <div key={index} className="space-y-2">
                      <div 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                      >
                        <div className="flex items-center space-x-2 text-gray-700">
                          <ChevronRight
                            className={`h-4 w-4 text-[#00308F] transition-transform ${
                              expandedActivity === index ? "transform rotate-90" : ""
                            }`}
                          />
                          <span>{activity.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent expansion when clicking delete
                            handleDeleteActivity(activity._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {expandedActivity === index && (
                        <div className="ml-6 p-3 bg-white border border-gray-100 rounded-lg text-sm text-gray-600">
                          <p className="mb-2">
                            <span className="font-medium">Description: </span> 
                            {activity.description}
                          </p>
                          <p className="mb-2">
                            <span className="font-medium">Date: </span> 
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                          {activity.tasks && activity.tasks.length > 0 && (
                            <div className="mb-4">
                              <p className="font-medium mb-2">Tasks:</p>
                              <div className="flex flex-wrap gap-4">
                                {activity.tasks.map((task, taskIndex) => (
                                  <div
                                    key={taskIndex}
                                    className="flex items-center bg-gray-50 px-3 py-2 rounded-lg"
                                  >
                                    <div className="h-2 w-2 bg-[#00308F] rounded-full mr-2"></div>
                                    <span>{task}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add completion status section */}
                          {completedActivities[activity._id] && completedActivities[activity._id].length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <p className="font-medium mb-2">Completed by:</p>
                              <div className="space-y-2">
                                {completedActivities[activity._id].map((completion, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center justify-between bg-green-50 p-2 rounded-lg"
                                  >
                                    <div>
                                      <p className="text-green-700 font-medium">{completion.parentName}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(completion.completedAt).toLocaleString()}
                                      </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">
                                      {completion.points} points
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Parent Progress */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  Parent Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {parentProgress.length > 0 ? (
                      parentProgress.map((parent, index) => (
                        <div 
                          key={index} 
                          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00308F]/20 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-gray-800">{parent.name}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-[#00308F]/10 text-[#00308F] mb-1">
                                {parent.points} Points
                              </Badge>
                            </div>
                          </div>

                          {/* Activities Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Activities Completed</span>
                              <span className="font-medium text-[#00308F]">
                                {parent.activitiesCompleted}/{parent.totalActivities}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div 
                                className="bg-[#00308F] h-full rounded-full"
                                style={{ 
                                  width: `${(parent.activitiesCompleted / parent.totalActivities) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No parent progress data available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Leaderboard and Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  Parent Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.slice(0, 5).map((parent, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setShowLeaderboardOverlay(true)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl min-w-[2rem]">
                          {formatNumberToEmoji(index + 1)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{parent.name}</p>
                          <p className="text-sm text-gray-600">{parent.studentName}</p>
                        </div>
                      </div>
                      <Badge className="bg-white text-[#00308F]">
                        {parent.points} pts
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setShowLeaderboardOverlay(true)}
                  >
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Bell className="h-5 w-5 text-[#00308F] mr-2" />
                  Announcements
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreviousAnnouncements(true)}
                    className="flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Previous Announcements
                    {oldAnnouncements.length > 0 && (
                      <Badge className="ml-2 bg-gray-500">{oldAnnouncements.length}</Badge>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAnnouncementForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {recentAnnouncements.map((announcement) => (
                      <div 
                        key={announcement._id} 
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="h-2 w-2 bg-[#00308F] rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-gray-700">
                            <span className="font-medium">{announcement.title}</span>
                            <span className="mx-2">•</span>
                            <span>{announcement.description}</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentAnnouncements.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No recent announcements
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Third Row: Activity History and Class Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Students */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Users className="h-5 w-5 text-[#00308F] mr-2" />
                  Class Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {studentsList.map((student) => (
                      <div
                        key={student.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.parentName}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-white text-[#00308F]">
                              {student.attendance}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Classrooms Section */}
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Classrooms</h2>
              {!hasClassroom && (
                <Button onClick={() => setShowCreateClassroom(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Classroom
                </Button>
              )}
            </div>

            {loading && <p className="text-gray-500">Loading classrooms...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom) => (
                <Card key={classroom._id} className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{classroom.name}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600">Class Code: {classroom.classCode}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(classroom.classCode);
                          toast.success('Class code copied!');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Total Students: {classroom.students?.length || 0}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => viewClassroomDetails(classroom)} 
                          className="w-full"
                        >
                          View Details
                        </Button>
                        <Button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
                              handleDeleteClassroom(classroom._id);
                            }
                          }}
                          variant="destructive"
                          className="w-full"
                        >
                          Delete Classroom
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
  
              {/* Only show the Create New Classroom card if teacher has no classroom */}
              {!hasClassroom && (
                <Card 
                  className="p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
                  onClick={() => setShowCreateClassroom(true)}
                >
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-600">
                    <Plus className="h-8 w-8 mb-2" />
                    <p>Create New Classroom</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Create Classroom Modal */}
          {showCreateClassroom && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Create New Classroom</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowCreateClassroom(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateClassroom} className="space-y-4">
                    <div>
                      <label htmlFor="className" className="block text-sm font-medium mb-1">
                        Classroom Name
                      </label>
                      <Input
                        id="className"
                        value={newClassroomName}
                        onChange={(e) => setNewClassroomName(e.target.value)}
                        placeholder="Enter classroom name"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateClassroom(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Classroom'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Activity Form Modal */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="Enter activity title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={newActivityDescription}
                    onChange={(e) => setNewActivityDescription(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="Enter activity description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={newActivityDate}
                    onChange={(e) => setNewActivityDate(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Task Completion Options</label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.completion}
                        onChange={(e) => setSelectedTasks({...selectedTasks, completion: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-[#00308F] focus:ring-[#00308F]"
                      />
                      <span className="ml-2 text-sm text-gray-600">Submit task completion (5 points)</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.photo}
                        onChange={(e) => setSelectedTasks({...selectedTasks, photo: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-[#00308F] focus:ring-[#00308F]"
                      />
                      <span className="ml-2 text-sm text-gray-600">Upload photo of work (5 points)</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.video}
                        onChange={(e) => setSelectedTasks({...selectedTasks, video: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-[#00308F] focus:ring-[#00308F]"
                      />
                      <span className="ml-2 text-sm text-gray-600">Submit video of activity (5 points)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowActivityForm(false);
                      setSelectedTasks({
                        completion: false,
                        photo: false,
                        video: false
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>
                    Add Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={newAnnouncementDescription}
                    onChange={(e) => setNewAnnouncementDescription(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="Enter announcement description"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAnnouncementForm(false);
                      setNewAnnouncementTitle("");
                      setNewAnnouncementDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddAnnouncement}>
                    Add Announcement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard Overlay */}
      {showLeaderboardOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowLeaderboardOverlay(false)}
              >
                <IoClose className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl font-bold flex items-center">
                <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                Full Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {leaderboardData.map((parent, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl min-w-[2rem]">
                          {formatNumberToEmoji(index + 1)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{parent.name}</p>
                          <p className="text-sm text-gray-600">{parent.studentName}</p>
                        </div>
                      </div>
                      <Badge className="bg-white text-[#00308F]">
                        {parent.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Form Modal */}
      {showProgressForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center">
                <BookOpen className="h-5 w-5 text-[#00308F] mr-2" />
                Update Student Progress
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowProgressForm(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student Name</label>
                      <input
                        type="text"
                        value="Student A"
                        disabled
                        className="w-full p-2 border rounded-md mt-1 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Roll Number</label>
                      <input
                        type="text"
                        value="001"
                        disabled
                        className="w-full p-2 border rounded-md mt-1 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Attendance */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Attendance (%)</label>
                    <input
                      type="number"
                      defaultValue="85"
                      className="w-full p-2 border rounded-md mt-1"
                      min="0"
                      max="100"
                    />
                  </div>

                  {/* Subject Marks */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Subject Marks</h3>
                    {['Mathematics', 'Science', 'English', 'History'].map((subject, index) => (
                      <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 w-24">{subject}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            placeholder="Marks"
                            className="w-20 p-2 border rounded-md"
                            min="0"
                            max="100"
                          />
                          <span className="text-gray-500">/</span>
                          <input
                            type="number"
                            defaultValue="100"
                            className="w-20 p-2 border rounded-md"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProgressForm(false)}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    handleUpdateMarks();
                    setShowProgressForm(false);
                  }}
                  className="bg-[#00308F] hover:bg-[#00308F]/90"
                >
                  Save Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Classroom Details Modal */}
      {showDetailsModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-[#00308F]">{selectedClassroom.name}</CardTitle>
                  <p className="text-gray-500 mt-1">Class Code: {selectedClassroom.classCode}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedClassroom(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Class Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-[#00308F] mb-3">Class Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Total Students:</span> {selectedClassroom.students.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Created On:</span> {new Date(selectedClassroom.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#00308F] mb-3">Student Information</h3>
                <div className="space-y-4">
                  {selectedClassroom.students.map((student, index) => {
                    const parentDetails = studentParentDetails[student.parent?._id];
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium">{student.studentName}</p>
                            {parentDetails ? (
                              <div className="mt-2 space-y-1">
                                <p className="text-sm">
                                  <span className="font-medium">Parent:</span> {parentDetails.name}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Email:</span> {parentDetails.email}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Phone:</span> {parentDetails.phoneNumber || 'Not provided'}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Parent:</span> {student.parentName}
                                {student.parent && <span className="ml-2">(Loading details...)</span>}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Joined: {new Date(student.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveStudent(student._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Previous Announcements Overlay */}
      {showPreviousAnnouncements && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <Calendar className="h-5 w-5 text-[#00308F] mr-2" />
                Previous Announcements
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowPreviousAnnouncements(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {oldAnnouncements.map((announcement) => (
                    <div 
                      key={announcement._id} 
                      className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-gray-700">
                          <span className="font-medium">{announcement.title}</span>
                          <span className="mx-2">•</span>
                          <span>{announcement.description}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {oldAnnouncements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No previous announcements
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
