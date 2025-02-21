import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import ParentDashboard from './components/ParentPage';
import TeacherDashboard from './components/TeacherPage';
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
          path="/teacherDashboard" 
          element={
            <ProtectedRoute>
              <TeacherDashboard />
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

  if (!token) {
    return <Navigate to="/" />;
  }

  // Check if user is trying to access the wrong dashboard
  const currentPath = window.location.pathname;
  const isParentPath = currentPath === '/parentDashboard';
  const isTeacherPath = currentPath === '/teacherDashboard';

  if (userType === 'parent' && isTeacherPath) {
    return <Navigate to="/parentDashboard" replace />;
  }

  if (userType === 'teacher' && isParentPath) {
    return <Navigate to="/teacherDashboard" replace />;
  }

  return children;
};

export default App;

// Rest of the code remains the same
