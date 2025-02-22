import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import ParentDashboard from './components/ParentPage';
import TeacherDashboard from './components/TeacherPage';
import ParentProfile from './components/ParentProfile';
import TeacherProfile from './components/TeacherProfile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <SocketProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login/:userType" element={<AuthForm type="login" />} />
        <Route path="/signup/:userType" element={<AuthForm type="signup" />} />
        <Route 
          path="/parentDashboard" 
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/parent/profile" 
          element={
            <ProtectedRoute>
              <ParentProfile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/teacherDashboard" 
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/teacher/profile" 
          element={
            <ProtectedRoute>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </SocketProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const currentPath = location.pathname;
    
    // Define the correct path for each user type
    const correctPath = userType === 'parent' ? '/parentDashboard' : '/teacherDashboard';
    
    // Only redirect if we're on the wrong path
    if (currentPath !== correctPath) {
      navigate(correctPath, { replace: true });
    }
    
    setIsLoading(false);
  }, [token, userType]);

  if (isLoading || !token) {
    return null;
  }

  return children;
};

export default App;

// Rest of the code remains the same
