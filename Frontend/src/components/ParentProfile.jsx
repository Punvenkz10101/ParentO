'use client';
import { useState, useRef } from 'react';
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

export default function ParentProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

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
        onClick={() => navigate("/parentDashboard")}
      >
        <ArrowLeft size={28} />
      </button>

      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <CardHeader className="flex flex-col items-center justify-center mb-4">
          <CardTitle className="text-2xl font-bold text-[#00308F] mb-2">
            Parent Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-white/50 mb-4 cursor-pointer" onClick={handleUploadClick}>
            {profileImage ? (
              <AvatarImage src={profileImage} alt="Profile" />
            ) : (
              <AvatarFallback className="text-3xl">
                {userName ? userName.charAt(0).toUpperCase() : "P"}
              </AvatarFallback>
            )}
          </Avatar>
          <Input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          <Button onClick={handleUploadClick} className="bg-[#00308F] text-white hover:bg-[#1E40AF] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
            {profileImage ? "Change Profile Image" : "Upload Profile Image"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
