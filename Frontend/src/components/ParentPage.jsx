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
  Menu
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
    'PTA meeting on Monday at 10 AM',
    'Annual Sports Day on 15th Nov',
    'Fee payment deadline extended to 30th Oct',
  ]);

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
                  {/* Mobile Navigation Menu */}
                  <div className="space-y-4 py-4">
                    <h2 className="text-lg font-semibold px-4">Dashboard</h2>
                    {/* Add mobile navigation items here */}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">ParentO Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
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
        <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
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
          {/* First Row: Today's Activity, Major Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Math Quiz', 'Science Experiment'].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                      <ChevronRight className="h-4 w-4 text-indigo-400" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Major Activities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                  Major Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Science Fair', time: 'Next Week' },
                    { name: 'Debate Competition', time: 'In 2 Weeks' }
                  ].map((activity, index) => (
                    <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                      <p className="text-indigo-700 font-medium">{activity.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        {activity.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Previous Activity, Points, Leaderboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Previous Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  Previous Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">History Presentation</p>
                        <p className="text-sm text-gray-600 mt-1">Completed on Oct 15</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">Math Olympiad</p>
                        <p className="text-sm text-gray-600 mt-1">Completed on Oct 10</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points Box */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 text-indigo-600 mr-2" />
                  Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-indigo-600">85</p>
                    <p className="text-gray-600 mt-2">Current Score</p>
                    <Button variant="outline" className="mt-4">
                      View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Star className="h-5 w-5 text-indigo-600 mr-2" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Ankit', points: 95, position: 1 },
                    { name: 'Riya', points: 90, position: 2 },
                    { name: 'Aryan', points: 88, position: 3 },
                  ].map((student) => (
                    <div
                      key={student.name}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        student.position === 1
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center ${
                            student.position === 1
                              ? 'bg-indigo-200 text-indigo-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          <span className="font-bold text-sm">{student.position}</span>
                        </div>
                        <span
                          className={
                            student.position === 1 
                              ? 'text-indigo-700 font-semibold' 
                              : 'text-gray-700 font-semibold'
                          }
                        >
                          {student.name}
                        </span>
                      </div>
                      <Badge
                        className={
                          student.position === 1
                            ? 'bg-indigo-200 text-indigo-700'
                            : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {student.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <Bell className="h-5 w-5 text-indigo-600 mr-2" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                      <p className="text-gray-700 flex-1">{announcement}</p>
                      <Badge>New</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}