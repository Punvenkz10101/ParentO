'use client';
import React from 'react';
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  Trophy, 
  BookOpen, 
  User, 
  LogOut, 
  ChevronRight, 
  Star,
  Settings,
  Menu,
  Plus,
  Trash2,
  X
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

export default function TeacherDashboard() {
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem("token");
sessionStorage.clear();
    navigate('/')
  }
  const [name,setName]=useState("");
  useEffect(()=>{
const userName=localStorage.getItem("userName");
if(userName){
  setName(userName);
}
  },[])

  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [todaysActivities, setTodaysActivities] = useState([
    {
      title: "Math Quiz",
      description: "Weekly mathematics assessment covering algebra",
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: "Science Experiment",
      description: "Chemical reactions demonstration",
      date: new Date().toISOString().split('T')[0]
    }
  ]);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityDate, setNewActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTasks, setSelectedTasks] = useState({
    completion: false,
    photo: false,
    video: false
  });
  const [announcements, setAnnouncements] = useState([
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
  const [activityHistory] = useState([
    {
      date: '2024-02-20',
      activities: [
        { title: 'Math Quiz', completed: 15, total: 20 },
        { title: 'Science Experiment', completed: 18, total: 20 }
      ]
    },
    {
      date: '2024-02-19',
      activities: [
        { title: 'English Essay', completed: 16, total: 20 },
        { title: 'History Test', completed: 19, total: 20 }
      ]
    },
    {
      date: '2024-02-18',
      activities: [
        { title: 'Geography Project', completed: 17, total: 20 },
        { title: 'Art Assignment', completed: 20, total: 20 }
      ]
    },
    // Add more historical data...
  ]);

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

  const handleAddActivity = () => {
    if (newActivityTitle.trim()) {
      const tasks = [];
      if (selectedTasks.completion) tasks.push("Submit task (5 points)");
      if (selectedTasks.photo) tasks.push("Upload photo (5 points)");
      if (selectedTasks.video) tasks.push("Submit video (5 points)");

      setTodaysActivities([...todaysActivities, {
        title: newActivityTitle,
        description: newActivityDescription,
        date: newActivityDate,
        tasks: tasks
      }]);
      
      setNewActivityTitle("");
      setNewActivityDescription("");
      setNewActivityDate(new Date().toISOString().split('T')[0]);
      setSelectedTasks({
        completion: false,
        photo: false,
        video: false
      });
      setShowActivityForm(false);
    }
  };

  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementDescription, setNewAnnouncementDescription] = useState("");

  const handleAddAnnouncement = () => {
    if (newAnnouncementTitle.trim() && newAnnouncementDescription.trim()) {
      setAnnouncements([...announcements, {
        title: newAnnouncementTitle,
        description: newAnnouncementDescription
      }]);
      setNewAnnouncementTitle("");
      setNewAnnouncementDescription("");
      setShowAnnouncementForm(false);
    }
  };

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('february');

  const getFilteredActivities = () => {
    return activityHistory.filter(day => {
      const date = new Date(day.date);
      const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
      return date.getFullYear().toString() === selectedYear && 
             monthName === selectedMonth.toLowerCase();
    });
  };

  const [expandedActivity, setExpandedActivity] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="border-b relative bg-white/75 backdrop-blur-lg fixed top-0 w-full z-50 h-20 min-h-[5rem]">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto h-full relative">
          {/* Logo on the left */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#00308F]">ParentO</h1>
          </div>

          {/* Centered Dashboard Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-[#00308F] whitespace-nowrap">Teacher Dashboard</h1>
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
                <DropdownMenuItem className="text-base">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-base text-red-600">
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
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="opacity-90">Class: Grade 8-A</p>
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
                            className={cn(
                              "h-4 w-4 text-[#00308F] transition-transform",
                              expandedActivity === index ? "transform rotate-90" : ""
                            )} 
                          />
                          <span>{activity.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTodaysActivities(todaysActivities.filter((_, i) => i !== index));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                              <p className="font-medium mb-2">Completion Tasks:</p>
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
                    {parentsProgress.map((parent, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00308F]/20 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">{parent.name}</p>
                            <p className="text-sm text-gray-600">{parent.studentName}</p>
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
                    ))}
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAnnouncementForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
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
                        <p className="text-gray-700 flex-1">
                          <span className="font-medium">{announcement.title}</span>
                          {"   "}
                          <span>{announcement.description}</span>
                        </p>
                        <Badge>New</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Third Row: Activity History and Class Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                    <option value="may">May</option>
                    <option value="june">June</option>
                    <option value="july">July</option>
                    <option value="august">August</option>
                    <option value="september">September</option>
                    <option value="october">October</option>
                    <option value="november">November</option>
                    <option value="december">December</option>
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
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {activity.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Completion Rate: {Math.round((activity.completed / activity.total) * 100)}%
                                    </p>
                                  </div>
                                  <Badge 
                                    className={cn(
                                      "bg-white",
                                      activity.completed === activity.total 
                                        ? "text-green-600" 
                                        : activity.completed >= activity.total * 0.7 
                                          ? "text-yellow-600" 
                                          : "text-red-600"
                                    )}
                                  >
                                    {activity.completed}/{activity.total}
                                  </Badge>
                                </div>
                                <div className="w-full bg-white rounded-full h-2">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      activity.completed === activity.total 
                                        ? "bg-green-500" 
                                        : activity.completed >= activity.total * 0.7 
                                          ? "bg-yellow-500" 
                                          : "bg-red-500"
                                    )}
                                    style={{ 
                                      width: `${(activity.completed / activity.total) * 100}%` 
                                    }}
                                  />
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

            {/* Class Students */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <BookOpen className="h-5 w-4 text-[#00308F] mr-2" />
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
                          <div className="flex items-center gap-3">
                            <Badge className="bg-white text-[#00308F]">
                              {student.attendance}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowProgressForm(true)}
                              className="bg-white hover:bg-gray-100"
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
}
