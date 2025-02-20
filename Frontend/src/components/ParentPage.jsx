'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { Mail, Users } from 'lucide-react';

export default function ParentDashboard() {
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

  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate('/')
  }
  const teacherName = 'Mrs. Sharma';
  const [announcements] = useState([
    {
      title: 'PTA Meeting',
      description: 'Meeting on Monday at 10 AM'
    },
    {
      title: 'Annual Sports Day',
      description: 'Event on 15th Nov'
    },
    {
      title: 'Fee Payment',
      description: 'Deadline extended to 30th Oct'
    }
  ]);

  const [todaysActivities] = useState([
    {
      title: "Math Quiz",
      description: "Weekly mathematics assessment covering algebra",
      date: new Date().toISOString().split('T')[0],
      tasks: [
        "Submit task (5 points)",
        "Upload photo (5 points)"
      ]
    },
    {
      title: "Science Experiment",
      description: "Chemical reactions demonstration",
      date: new Date().toISOString().split('T')[0],
      tasks: [
        "Submit task (5 points)",
        "Submit video (5 points)"
      ]
    }
  ]);

  const [activityHistory] = useState([
    {
      date: '2024-02-20',
      activities: [
        { title: 'Math Quiz', status: 'completed', points: 10 },
        { title: 'Science Experiment', status: 'completed', points: 15 }
      ]
    },
    {
      date: '2024-02-19',
      activities: [
        { title: 'English Essay', status: 'completed', points: 10 },
        { title: 'History Test', status: 'completed', points: 10 }
      ]
    }
  ]);

  const [expandedActivity, setExpandedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('february');
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  const getFilteredActivities = () => {
    return activityHistory.filter(day => {
      const date = new Date(day.date);
      const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
      return date.getFullYear().toString() === selectedYear &&
        monthName === selectedMonth.toLowerCase();
    });
  };

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

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/classroom/parent/classrooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassrooms(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Failed to load classrooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClassroom = async () => {
    try {
      if (hasJoinedClassroom) {
        setError('You can only join one classroom at a time');
        return;
      }

      if (!classCode.trim()) {
        setError('Please enter a class code');
        return;
      }

      if (!studentName.trim()) {
        setError('Please enter student name');
        return;
      }

      if (!parentName.trim()) {
        setError('Please enter parent name');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/classroom/parent/join-classroom',
        { 
          classCode,
          studentName: studentName.trim(),
          parentName: parentName.trim()
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setClassrooms([response.data]);
      setHasJoinedClassroom(true);
      setClassCode('');
      setStudentName('');
      setParentName('');
      setShowJoinForm(false);
      setError(null);
      toast.success('Successfully joined classroom');
    } catch (error) {
      console.error('Error joining classroom:', error);
      setError(error.response?.data?.message || 'Error joining classroom');
    }
  };

  const handleExitClassroom = async (classroomId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/classroom/parent/exit-classroom',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Reset all related states
      setClassrooms([]);
      setHasJoinedClassroom(false);
      setSelectedClassroom(null);
      setShowDetailsModal(false);
      
      // Show success message
      toast.success('Successfully exited classroom');
      
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userName = localStorage.getItem("userName");
    if (userName) {
      setName(userName);
    }
    
    fetchClassrooms().then(() => {
      setHasJoinedClassroom(classrooms.length > 0);
    });
  }, [navigate]);

  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-white/75 backdrop-blur-lg fixed top-0 w-full z-50 h-20 min-h-[5rem]">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto h-full relative">
          {/* Logo on the left */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#00308F]">ParentO</h1>
          </div>

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
                <DropdownMenuLabel className="text-lg">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-base">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
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
      <main className="pt-20 p-4 max-w-7xl mx-auto overflow-y-auto">
        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome</h2>
              <p className="opacity-90">Welcome, {name}!</p>
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
            <h2 className="text-2xl font-bold text-gray-800">My Classrooms</h2>
            {classrooms.length === 0 && !loading && (
              <Button onClick={() => setShowJoinForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Join Classroom
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchClassrooms} className="mt-4">
                Retry
              </Button>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Classrooms Found</h3>
              <p className="text-gray-600 mb-4">Join a classroom to get started.</p>
              <Button onClick={() => setShowJoinForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Join Classroom
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
                          <span className="font-medium">Teacher:</span> {classroom.teacher.name}
                        </p>
                        {classroom.students && classroom.students
                          .filter(student => student && student.parent && student.parent._id === localStorage.getItem('userId'))
                          .map((student, index) => (
                            <div key={index} className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-sm">
                                <span className="font-medium">Student:</span> {student.studentName}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Parent:</span> {student.parentName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Joined: {new Date(student.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                      </div>
                      <Button 
                        onClick={() => viewClassroomDetails(classroom)} 
                        className="mt-4 w-full bg-[#00308F] hover:bg-[#002266]"
                      >
                        View Details
                      </Button>
                      <Button 
                        onClick={() => handleExitClassroom(classroom._id)}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700"
                      >
                        Exit Classroom
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
                    <CardTitle>Join Classroom</CardTitle>
                    {error && (
                      <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinClassroom} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="classCode">Class Code</Label>
                      <Input
                        id="classCode"
                        placeholder="Enter class code"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent Name</Label>
                      <Input
                        id="parentName"
                        placeholder="Enter parent name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJoinForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Join Classroom
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
                  Today's Activities
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
                              className={`h-4 w-4 text-[#00308F] transition-transform ${expandedActivity === index ? "transform rotate-90" : ""
                                }`}
                            />
                            <span>{activity.title}</span>
                          </div>
                        </div>
                        {expandedActivity === index && (
                          <div className="ml-6 p-3 bg-white border border-gray-100 rounded-lg text-sm text-gray-600">
                            <p className="mb-2">
                              <span className="font-medium">Description:</span> {activity.description}
                            </p>
                            <p className="mb-2">
                              <span className="font-medium">Date:</span> {activity.date}
                            </p>
                            {activity.tasks && activity.tasks.length > 0 && (
                              <div>
                                <p className="font-medium mb-2">Required Tasks:</p>
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
                  Student Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <p className="font-medium text-gray-800">Math Exam</p>
                      <p className="text-sm text-gray-600">Score: 85/100</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <p className="font-medium text-gray-800">Science Exam</p>
                      <p className="text-sm text-gray-600">Score: 90/100</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <p className="font-medium text-gray-800">English Exam</p>
                      <p className="text-sm text-gray-600">Score: 78/100</p>
                    </div>
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
                  Class Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.slice(0, 3).map((parent, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setShowLeaderboardModal(true)}
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
                    onClick={() => setShowLeaderboardModal(true)}
                  >
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Points Overview */}
            <Card className="h-[365px] flex flex-col justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  Points Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <p className="text-9xl font-bold text-[#00308F]">85</p>
                  <p className="text-gray-600 mt-2 text-xl">Total Points</p>
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
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {announcements.map((announcement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="h-2 w-2 bg-[#00308F] rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{announcement.title}</p>
                          <p className="text-gray-600">{announcement.description}</p>
                        </div>
                        <Badge>New</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-[#00308F] mr-2" />
                  Activity History
                </CardTitle>
                <div className="flex gap-2">
                  <select
                    className="px-2 py-1 border rounded-md text-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map(month => (
                      <option key={month.toLowerCase()} value={month.toLowerCase()}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-1 border rounded-md text-sm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {getFilteredActivities().length > 0 ? (
                      getFilteredActivities().map((day, dayIndex) => (
                        <div key={dayIndex} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">
                              {new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h3>
                            <Badge variant="outline" className="text-[#00308F]">
                              {day.activities.length} Activities
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {day.activities.map((activity, actIndex) => (
                              <div
                                key={actIndex}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {activity.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Points Earned: {activity.points}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      activity.status === 'completed'
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {activity.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No activities found for {selectedMonth} {selectedYear}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Leaderboard Modal */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowLeaderboardModal(false)}
              >
                <X className="h-4 w-4" />
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
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Teacher Information</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium mr-2">Name:</span> 
                      {selectedClassroom.teacher?.name || 'Not Available'}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium mr-2">Email:</span>
                      {selectedClassroom.teacher?.email || 'Not Available'}
                      {selectedClassroom.teacher?.email && (
                        <a 
                          href={`mailto:${selectedClassroom.teacher.email}`}
                          className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                          title="Send Email to Teacher"
                        >
                          <Mail className="h-4 w-4 text-blue-600" />
                        </a>
                      )}
                    </p>
                  </div>
                </div>

                {/* Student Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Children in This Class</h3>
                  <div className="space-y-4">
                    {selectedClassroom.students
                      .filter(student => student && student.parent && student.parent._id === localStorage.getItem('userId'))
                      .map((student, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="space-y-2">
                            <p className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="font-medium mr-2">Student:</span> 
                              {student.studentName}
                            </p>
                            <p className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="font-medium mr-2">Parent:</span> 
                              {student.parentName}
                            </p>
                            <p className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="font-medium mr-2">Joined:</span>
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