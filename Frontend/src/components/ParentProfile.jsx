// ParentProfile.jsx
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
import axios from 'axios';

export default function ParentProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) setUserName(storedName);
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchProfileImage(storedEmail);
    }
  }, []);

  const fetchProfileImage = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/upload/profile/${email}`);
      setProfileImage(response.data.profileImage);
    } catch (error) {
      console.log("No image found", error);
    }
  };
  useEffect(() => {
    if (userEmail) fetchProfileImage(userEmail);
  }, [userEmail]);
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!selectedFile) {
      alert("Please select an image before saving.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      alert("User email not found. Please log in again.");
      return;
    }
    formData.append('email', storedEmail);

    formData.append('role', 'parent');

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setProfileImage(response.data.profileImage);
      alert("Profile image saved successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
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
          <Button onClick={handleUploadClick}>Upload Profile Image</Button>
          <Button onClick={handleSaveProfile} className="mt-2 bg-green-500 hover:bg-green-700">Save Profile</Button>

          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Name: {userName || "User Name"}</p>
            <p className="text-gray-600">Email: {userEmail || "User Email"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}