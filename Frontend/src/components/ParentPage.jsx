'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Plus,
  X,
  User,
  LogOut,
  Bell,
  Calendar,
  Trophy,
  BookOpen,
  ChevronRight,
  Star,
  Settings,
  Menu,
  CheckCircle,
  TrendingUp,
  Award,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Mail, Users, Clock } from 'lucide-react';
import { socket } from '../lib/socket';
import { useSocket } from '../context/SocketContext';
import { Textarea } from "./ui/textarea";

export default function ParentDashboard() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [studentParentDetails, setStudentParentDetails] = useState({});
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [hasJoinedClassroom, setHasJoinedClassroom] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showPreviousAnnouncements, setShowPreviousAnnouncements] = useState(false);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [oldAnnouncements, setOldAnnouncements] = useState([]);
  const { isConnected } = useSocket();
  const [activities, setActivities] = useState([]);
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [activityError, setActivityError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [completionNotes, setCompletionNotes] = useState({});
  const [submittingActivity, setSubmittingActivity] = useState({});
  const [completedActivities, setCompletedActivities] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [showAllMarks, setShowAllMarks] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const [allMarks, setAllMarks] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    // Set userType only if it's not already set to 'parent'
    const userType = localStorage.getItem('userType');
    if (userType !== 'parent') {
      localStorage.setItem('userType', 'parent');
    }

    const userName = localStorage.getItem("userName");
    if (userName) {
      setName(userName);
    }

    // Fetch classrooms on component mount
    fetchClassrooms();
  }, []); // Empty dependency array

  const handleLogout = () => {
    const userType = localStorage.getItem('userType'); // Store userType before clearing
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('userType', userType); // Restore userType
    navigate('/', { replace: true });
  };

  const teacherName = 'Mrs. Sharma';

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

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/classroom/parent/classrooms');
      
      if (response.data) {
        setClassrooms(response.data);
        setHasJoinedClassroom(response.data.length > 0);
        
        // If there are classrooms, fetch announcements for the first one
        if (response.data.length > 0) {
          await fetchAnnouncements(response.data[0].classCode);
        }
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Failed to load classrooms');
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    try {
      if (!classCode.trim() || !studentName.trim() || !parentName.trim() || !mobileNumber.trim()) {
        setError('Please fill in all fields');
        return;
      }

      const response = await api.post('/api/classroom/parent/join-classroom', { 
        classCode: classCode.trim(),
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        mobileNumber: mobileNumber.trim()
      });

      if (response.data) {
        setClassrooms([response.data]);
        setHasJoinedClassroom(true);
        setClassCode('');
        setStudentName('');
        setParentName('');
        setMobileNumber('');
        setShowJoinForm(false);
        setError(null);
        toast.success(t('classroom.joinSuccess'));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error joining classroom');
      toast.error(error.response?.data?.message || 'Error joining classroom');
    }
  };

  const handleExitClassroom = async (classroomId) => {
    try {
      await api.post('/api/classroom/parent/exit-classroom');
      
      // Reset all related states
      setClassrooms([]);
      setHasJoinedClassroom(false);
      setSelectedClassroom(null);
      setShowDetailsModal(false);
      
      toast.success(t('classroom.exitSuccess'));
      
      // Refresh classrooms list
      await fetchClassrooms();
    } catch (error) {
      console.error('Error exiting classroom:', error);
      toast.error(error.response?.data?.message || 'Error exiting classroom');
    }
  };

  const viewClassroomDetails = (classroom) => {
    setSelectedClassroom(classroom);
    setShowDetailsModal(true);
  };

  const fetchAnnouncements = async (classCode) => {
    try {
      const response = await api.get(`/api/announcement/classroom/${classCode}`);
      if (response.data) {
        // Only show announcements from the last 24 hours
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

        const recentAnnouncements = response.data.filter(announcement => 
          new Date(announcement.createdAt) > twentyFourHoursAgo
        );

        setRecentAnnouncements(recentAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    }
  };

  const fetchLeaderboard = async (classCode) => {
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
                activitiesCompleted: 0
              });
            }

            const parentData = progressMap.get(completion.parentId);
            parentData.points += completion.points || 0;
            parentData.activitiesCompleted += 1;
          });
        });

        // Convert map to array and sort by points
        const leaderboardArray = Array.from(progressMap.values())
          .sort((a, b) => b.points - a.points);

        setLeaderboard(leaderboardArray);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    if (classrooms.length > 0) {
      const classCode = classrooms[0].classCode;
      fetchActivities(classCode);
      fetchTotalPoints();
      fetchAnnouncements(classCode);
      fetchLeaderboard(classCode);
    }
  }, [classrooms]);

  useEffect(() => {
    if (!socket || !classrooms[0]?.classCode) return;

    socket.emit('join_classroom', classrooms[0].classCode);

    socket.on('new_announcement', (announcement) => {
      if (announcement.classCode === classrooms[0].classCode) {
        setRecentAnnouncements(prev => [announcement, ...prev]);
      }
    });

    return () => {
      socket.off('new_announcement');
    };
  }, [socket, classrooms]);

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
        // Get today's date at midnight for consistent comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayActs = response.data.filter(activity => {
          const activityDate = new Date(activity.date);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() === today.getTime();
        });

        // Set completed activities from fetched data
        const completedActs = {};
        response.data.forEach(activity => {
          const userCompletion = activity.completions?.find(
            completion => completion.parentId === localStorage.getItem('userId')
          );
          if (userCompletion) {
            completedActs[activity._id] = {
              completedAt: userCompletion.completedAt,
              description: userCompletion.description
            };
          }
        });
        
        setCompletedActivities(completedActs);
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

  const fetchTotalPoints = async () => {
    try {
      if (!classrooms[0]?.classCode) return;
      
      const response = await api.get(`/api/activities/classroom/${classrooms[0].classCode}`);
      
      let points = 0;
      let completedCount = 0;
      
      response.data.forEach(activity => {
        const userCompletions = activity.completions.filter(
          completion => completion.parentId === localStorage.getItem('userId')
        );
        
        userCompletions.forEach(completion => {
          points += completion.points || 0;
        });
        
        if (userCompletions.length > 0) {
          completedCount++;
        }
      });
      
      setTotalPoints(points);
      setCompletedActivitiesCount(completedCount);
    } catch (error) {
      console.error('Error fetching total points:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (activity) => {
      if (activity.classCode === classrooms[0]?.classCode) {
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
      if (classCode === classrooms[0]?.classCode) {
        setClassrooms([]);
        setHasJoinedClassroom(false);
        setTodaysActivities([]);
        setActivities([]);
        setAnnouncements([]);
        toast.info('Classroom has been deleted by the teacher');
      }
    };

    socket.on('new_activity', handleNewActivity);
    socket.on('activity_deleted', handleActivityDeleted);
    socket.on('classroom_deleted', handleClassroomDeleted);
    socket.on('activity_error', (error) => {
      setActivityError(error);
      toast.error(error);
    });

    return () => {
      socket.off('new_activity');
      socket.off('activity_deleted');
      socket.off('classroom_deleted');
      socket.off('activity_error');
    };
  }, [socket, classrooms]);

  useEffect(() => {
    if (!socket) return;

    socket.on('activity_completed', (data) => {
      if (data.parentId === localStorage.getItem('userId')) {
        setTotalPoints(prev => prev + (data.points || 0));
        setCompletedActivitiesCount(prev => prev + 1);
      }
    });

    return () => {
      socket.off('activity_completed');
    };
  }, [socket]);

  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  const handleActivityComplete = async (activityId) => {
    try {
      setSubmittingActivity(prev => ({ ...prev, [activityId]: true }));
      
      const response = await api.post(`/api/activities/${activityId}/complete`, {
        description: completionNotes[activityId] || ''
      });
      
      if (response.data.success) {
        setCompletedActivities(prev => ({
          ...prev,
          [activityId]: {
            completedAt: response.data.completedAt,
            description: completionNotes[activityId]
          }
        }));
        toast.success('Activity marked as complete!');
      }
      
      // Clear the notes after successful submission
      setCompletionNotes(prev => ({ ...prev, [activityId]: '' }));
      setSubmittingActivity(prev => ({ ...prev, [activityId]: false }));
    } catch (error) {
      console.error('Error marking activity as complete:', error);
      toast.error('Failed to mark activity as complete');
      setSubmittingActivity(prev => ({ ...prev, [activityId]: false }));
    }
  };

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (classrooms.length > 0) {
        try {
          const classCode = classrooms[0].classCode;
          const [progressRes, marksRes, feedbackRes] = await Promise.all([
            api.get(`/api/classroom/parent/progress/${classCode}`),
            api.get(`/api/classroom/parent/marks/${classCode}`),
            api.get(`/api/classroom/parent/feedback/${classCode}`)
          ]);

          setStudentProgress(progressRes.data);
          setAllMarks(marksRes.data);
          setAllFeedback(feedbackRes.data);
        } catch (error) {
          console.error('Error fetching student progress:', error);
          toast.error('Failed to fetch student progress');
        }
      }
    };

    fetchStudentProgress();
  }, [classrooms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">{t('welcome')}</span>
            </div>
            
            {/* Add this new div for the centered title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-blue-600">{t('Parent  Dashboard')}</h1>
            </div>
            
            {/* Rest of your navbar content */}
            <div className="flex items-center">
              {/* Avatar Dropdown on the right */}
              <div className="flex items-center flex-shrink-0 w-[48px]">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/avatars/parent.png" alt="Parent" />
                      <AvatarFallback className="text-l">{firstLetter}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="text-lg">{t('Hi!')}, {name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-base cursor-pointer"
                      onClick={() => navigate('/parent/profile')}
                    >
                      <User className="mr-2 h-5 w-5" />
                      {t('profile.title')}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-base text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-5 w-5" />
                      {t('dashboard.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="p-4 max-w-7xl mx-auto overflow-y-auto">
        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('dashboard.welcome')}</h2>
              <p className="opacity-90">{t('Hello')}, {name}!</p>
            </div>
            <Avatar className="h-16 w-16 border-4 border-white/50">
              <AvatarImage src="/avatars/parent.png" alt="Parent" />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Classrooms Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('classroom.title')}</h2>
            {classrooms.length === 0 && !loading && (
              <Button onClick={() => setShowJoinForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('classroom.join')}
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('classroom.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchClassrooms} className="mt-4">
                {t('classroom.retry')}
              </Button>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('classroom.noClassrooms')}</h3>
              <p className="text-gray-600 mb-4">{t('classroom.joinMessage')}</p>
              <Button onClick={() => setShowJoinForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('classroom.join')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom) => (
                classroom && (
                  <Card key={classroom._id} className="p-6 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-[#00308F]">{classroom.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{t('classroom.teacher')}: </span> {classroom.teacher.name}
                        </p>
                        {classroom.students && classroom.students
                          .filter(student => student && student.parent && student.parent._id === localStorage.getItem('userId'))
                          .map((student, index) => (
                            <div key={index} className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-sm">
                                <span className="font-medium">{t('classroom.student')}: </span> {student.studentName}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">{t('classroom.parent')}: </span> {student.parentName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {t('classroom.joined')}: {new Date(student.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                      </div>
                      <Button 
                        onClick={() => viewClassroomDetails(classroom)} 
                        className="mt-4 w-full bg-[#00308F] hover:bg-[#002266]"
                      >
                        {t('classroom.viewDetails')}
                      </Button>
                      <Button 
                        onClick={() => handleExitClassroom(classroom._id)}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700"
                      >
                        {t('classroom.exit')}
                      </Button>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}

          {/* Join Classroom Modal */}
          {showJoinForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{t('classroom.join')}</CardTitle>
                    {error && (
                      <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinClassroom} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="classCode">{t('classroom.code')}</Label>
                      <Input
                        id="classCode"
                        placeholder={t('classroom.codePlaceholder')}
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">{t('profile.studentName')}</Label>
                      <Input
                        id="studentName"
                        placeholder={t('profile.studentNamePlaceholder')}
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">{t('profile.parentName')}</Label>
                      <Input
                        id="parentName"
                        placeholder={t('profile.parentNamePlaceholder')}
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">{t('profile.mobile')}</Label>
                      <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder={t('profile.mobilePlaceholder')}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJoinForm(false)}
                      >
                        {t('activity.cancel')}
                      </Button>
                      <Button type="submit">
                        {t('classroom.join')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 overflow-y-auto">
          {/* First Row: Today's Activity and Student Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Activity */}
            <Card className="h-[365px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-[#00308F] mr-2" />
                  {t('activities.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
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
                              <div>
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
                            
                            {completedActivities[activity._id] ? (
                              <div className="mt-4 border-t pt-4">
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Completed</span>
                                  </div>
                                  <p className="mt-2 text-sm">
                                    Completed on: {new Date(completedActivities[activity._id].completedAt).toLocaleDateString()}
                                  </p>
                                  {completedActivities[activity._id].description && (
                                    <p className="mt-2 text-sm">
                                      Notes: {completedActivities[activity._id].description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 border-t pt-4 space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Completion Notes
                                  </label>
                                  <Textarea
                                    placeholder="Add any notes about completing this activity..."
                                    value={completionNotes[activity._id] || ''}
                                    onChange={(e) => setCompletionNotes(prev => ({
                                      ...prev,
                                      [activity._id]: e.target.value
                                    }))}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                
                                <Button
                                  onClick={() => handleActivityComplete(activity._id)}
                                  disabled={submittingActivity[activity._id]}
                                  className="w-full"
                                >
                                  {submittingActivity[activity._id] ? 'Submitting...' : 'Mark as Complete'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="h-[365px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <BookOpen className="h-5 w-5 text-[#00308F] mr-2" />
                  {t('dashboard.studentProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-3">
                    {allMarks && allMarks.length > 0 ? (
                      allMarks.map((mark, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{mark.subject}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(mark.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#00308F]">
                                {mark.marks}/{mark.totalMarks}
                              </p>
                              <p className="text-sm text-gray-600">
                                {((mark.marks / mark.totalMarks) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No marks available yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Leaderboard and Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  {t('dashboard.leaderboard')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 3).map((parent, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl min-w-[2rem]">
                          {formatNumberToEmoji(index + 1)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{parent.name}</p>
                          <p className="text-sm text-gray-600">
                            {parent.activitiesCompleted} activities completed
                          </p>
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
                  >
                    {t('dashboard.viewAllLeaderboard')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Points Overview */}
            <Card className="h-[365px] flex flex-col justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  {t('dashboard.pointsOverview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <p className="text-9xl font-bold text-[#00308F]">{totalPoints}</p>
                  <p className="text-gray-600 mt-2 text-xl">{t('dashboard.totalPoints')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Row: Announcements and Activity History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Bell className="h-5 w-5 text-[#00308F] mr-2" />
                  {t('dashboard.announcements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {recentAnnouncements.map((announcement, index) => (
                      <div 
                        key={announcement._id} 
                        className="p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                          <Badge variant="secondary">New</Badge>
                        </div>
                        <p className="text-gray-600">{announcement.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Student Progress Section */}
        {studentProgress && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <TrendingUp className="h-5 w-5 text-[#00308F] mr-2" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-blue-900">Activities</h3>
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-2">
                      {studentProgress.progress.completedActivities}/{studentProgress.progress.totalActivities}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {studentProgress.progress.completionRate.toFixed(1)}% Completion
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-green-900">Average Score</h3>
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-2">
                      {studentProgress.progress.averageMarks}%
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      From {studentProgress.progress.totalMarks} assessments
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-purple-900">Feedback</h3>
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mt-2">
                      {studentProgress.progress.totalFeedback}
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                      Teacher observations
                    </p>
                  </div>
                </div>

                {/* Marks Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recent Marks</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllMarks(!showAllMarks)}
                    >
                      {showAllMarks ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {showAllMarks ? 'Show Less' : 'Show All'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(showAllMarks ? allMarks : allMarks.slice(0, 3)).map((mark, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{mark.subject}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(mark.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#00308F]">
                              {mark.marks}/{mark.totalMarks}
                            </p>
                            <p className="text-sm text-gray-600">
                              {((mark.marks / mark.totalMarks) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Teacher Feedback</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllFeedback(!showAllFeedback)}
                    >
                      {showAllFeedback ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {showAllFeedback ? 'Show Less' : 'Show All'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(showAllFeedback ? allFeedback : allFeedback.slice(0, 3)).map((feedback, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{feedback.type}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(feedback.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">{feedback.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Classroom Details Modal */}
      {showDetailsModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedClassroom.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowDetailsModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Teacher Details Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">{t('classroom.teacherInformation')}</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium mr-2">{t('classroom.teacherName')}: </span> 
                      {selectedClassroom.teacher?.name || 'Not Available'}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium mr-2">{t('classroom.teacherEmail')}: </span>
                      {selectedClassroom.teacher?.email || 'Not Available'}
                      {selectedClassroom.teacher?.email && (
                        <a 
                          href={`mailto:${selectedClassroom.teacher.email}`}
                          className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                          title={t('classroom.sendEmailToTeacher')}
                        >
                          <Mail className="h-4 w-4 text-blue-600" />
                        </a>
                      )}
                    </p>
                  </div>
                </div>

                {/* Student Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('classroom.yourChildrenInThisClass')}</h3>
                  <div className="space-y-4">
                    {selectedClassroom.students
                      .filter(student => student && student.parent && student.parent._id === localStorage.getItem('userId'))
                      .map((student, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="space-y-2">
                            <p className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="font-medium mr-2">{t('classroom.student')}: </span> 
                              {student.studentName}
                            </p>
                            <p className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="font-medium mr-2">{t('classroom.parent')}: </span> 
                              {student.parentName}
                            </p>
                            <p className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="font-medium mr-2">{t('classroom.joined')}: </span>
                              {new Date(student.joinedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}