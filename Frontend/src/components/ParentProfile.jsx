'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ParentProfile() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  // Function to save childName and phoneNumber to MongoDB
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/saveChildDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, childName, phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message || "Error saving details.");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Back Button */}
      <button 
        className="absolute top-6 left-6 text-gray-700 hover:text-[#00308F] transition"
        onClick={() => navigate("/parentDashboard")}
      >
        <ArrowLeft size={28} />
      </button>

      <Card className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
        <CardHeader className="flex flex-col items-center mb-4">
          <CardTitle className="text-2xl font-bold text-[#00308F] mb-2">
            Parent Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Display Name & Email */}
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold">Name: {userName || "User Name"}</p>
            <p className="text-gray-600">Email: {userEmail || "User Email"}</p>
          </div>

          {/* Child Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Child's Name</label>
            <Input 
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter child's name"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00308F]"
            />
          </div>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input 
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00308F]"
            />
          </div>

          {/* Save Button */}
          <Button 
            className="w-full bg-[#00308F] text-white rounded-lg hover:bg-[#002366] flex items-center justify-center"
            onClick={handleSave}
          >
            <Save className="mr-2" size={18} /> Save Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
