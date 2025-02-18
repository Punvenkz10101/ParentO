'use client';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";


export default function TeacherProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName,setUserName]=useState('');
  const [userEmail,setUserEmail]=useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
useEffect(()=>{
  const storedName=localStorage.getItem("userName")
  const storedEmail=localStorage.getItem("userEmail")
if(storedName){
  setUserName(storedName);
}
if(storedEmail){
  setUserEmail(storedEmail);
}
},[])
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
      {/* Back Button */}
      <button 
        className="absolute top-6 left-6 text-gray-700 hover:text-[#00308F] transition"
        onClick={() => navigate("/teacherDashboard")}
      >
        <ArrowLeft size={28} />
      </button>

      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <CardHeader className="flex flex-col items-center justify-center mb-4">
          <CardTitle className="text-2xl font-bold text-[#00308F] mb-2">
            Teacher Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-white/50 mb-4 cursor-pointer" onClick={handleUploadClick}>
            {profileImage ? (
              <AvatarImage src={profileImage} alt="Profile" />
            ) : (
              <AvatarFallback className="text-3xl">
                {userName ? userName.charAt(0).toUpperCase() : "T"}
              </AvatarFallback>
            )}
          </Avatar>
          <Input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          <Button onClick={handleUploadClick} className="bg-[#00308F] text-white hover:bg-[#1E40AF] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
            {profileImage ? "Change Profile Image" : "Upload Profile Image"}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Name : {userName || "User Name"}</p> {/* Display userName */}
          <p className="text-gray-600">Email : {userEmail || "User Email"}</p> {/* Display userEmail */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
