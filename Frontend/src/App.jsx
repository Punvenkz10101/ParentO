import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import ParentDashboard from './components/ParentPage';
import TeacherDashboard from './components/TeacherPage';
import ParentProfile from './components/ParentProfile';
import TeacherProfile from './components/TeacherProfile';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-100">
        <LanguageSwitcher />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login/:userType" element={<AuthForm type="login" />} />
          <Route path="/signup/:userType" element={<AuthForm type="signup" />} />
          <Route 
            path="/parentDashboard" 
            element={
              <ProtectedRoute userType="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/parent/profile" 
            element={
              <ProtectedRoute userType="parent">
                <ParentProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/teacherDashboard" 
            element={
              <ProtectedRoute userType="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute userType="teacher">
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </SocketProvider>
  );
}

const ProtectedRoute = ({ children, userType: requiredType }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      if (userType !== requiredType) {
        const correctPath = userType === 'parent' ? '/parentDashboard' : '/teacherDashboard';
        navigate(correctPath, { replace: true });
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [token, userType, requiredType, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;

// Rest of the code remains the same
