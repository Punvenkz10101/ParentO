import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from '../lib/axios';
import { toast } from "react-hot-toast";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { userType } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === "login" ? "login" : "signup";
      const response = await api.post(`/api/${userType}/${endpoint}`, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userType', userType);
        
        // Navigate to appropriate dashboard
        const dashboardPath = userType === "parent" ? "/parentDashboard" : "/teacherDashboard";
        navigate(dashboardPath);
      } else if (type === "signup") {
        toast.success('Signup successful! Please login.');
        navigate(`/login/${userType}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || `${type} failed`);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/nikhita-s-NsPDiPFTp4c-unsplash.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          {type === "login" ? "Login" : "Signup"} as {userType}
        </h2>

        {type === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          {type === "login" ? "Login" : "Signup"}
        </button>

        <p className="mt-4 text-center">
          {type === "login" ? (
            <>
              Don't have an account?{" "}
              <Link to={`/signup/${userType}`} className="text-blue-500 underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to={`/login/${userType}`} className="text-blue-500 underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
