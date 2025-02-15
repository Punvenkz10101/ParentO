'use client';
import React from 'react';
import { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function ParentDashboard() {
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

  const getFilteredActivities = () => {
    return activityHistory.filter(day => {
      const date = new Date(day.date);
      const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
      return date.getFullYear().toString() === selectedYear && 
             monthName === selectedMonth.toLowerCase();
    });
  };

  const leaderboardData = [
    { name: "Ankit", points: 95, studentName: "Student A" },
    { name: "Riya", points: 90, studentName: "Student B" },
    { name: "Aryan", points: 88, studentName: "Student C" },
    { name: "Priya", points: 85, studentName: "Student D" },
    { name: "Rahul", points: 82, studentName: "Student E" },
  ];

  const formatNumberToEmoji = (num) => {
    const medalIcons = ["🥇", "🥈", "🥉"];
    if (num <= 3) return medalIcons[num - 1];
    
    const emojiMap = {
      '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
      '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
    };
    return num.toString().split('').map(digit => emojiMap[digit]).join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-white/75 backdrop-blur-lg fixed top-0 w-full z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <ScrollArea className="h-full">
                  <div className="space-y-4 py-4">
                    <h2 className="text-lg font-semibold px-4">Dashboard</h2>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-[#00308F]">ParentO Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-[#00308F]" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/parent.png" alt="Parent" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 p-4 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="opacity-90">Class Teacher: {teacherName}</p>
            </div>
            <Avatar className="h-16 w-16 border-4 border-white/50">
              <AvatarImage src="/avatars/parent.png" alt="Parent" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* First Row: Today's Activity, Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-[#00308F] mr-2" />
                  Today's Activities
                </CardTitle>
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
              </CardContent>
            </Card>

            {/* Points Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-[#00308F] mr-2" />
                  Points Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-4xl font-bold text-[#00308F]">85</p>
                    <p className="text-gray-600 mt-2">Total Points</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-[#00308F]">Level 5</p>
                        <p className="text-sm text-gray-600">Current Level</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-[#00308F]">15</p>
                        <p className="text-sm text-gray-600">To Next Level</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">This Week</p>
                      <p className="text-xl font-semibold text-[#00308F]">25 pts</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-xl font-semibold text-[#00308F]">85 pts</p>
                    </div>
                  </div>
                </div>
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
                  Class Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((student, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl min-w-[2rem]">
                          {formatNumberToEmoji(index + 1)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentName}</p>
                        </div>
                      </div>
                      <Badge className="bg-white text-[#00308F]">
                        {student.points} pts
                      </Badge>
                    </div>
                  ))}
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
          </div>

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
                                    Points earned: {activity.points}
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
      </main>
    </div>
  );
}