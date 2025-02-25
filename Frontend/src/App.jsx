import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect, useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import LanguageSwitcher from './components/LanguageSwitcher';

// Lazy load components
const TeacherDashboard = lazy(() => import('./components/TeacherPage'));
const ParentDashboard = lazy(() => import('./components/ParentPage'));
const TeacherProfile = lazy(() => import('./components/TeacherProfile'));
const ParentProfile = lazy(() => import('./components/ParentProfile'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00308F]"></div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children, allowedUserType }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    if (allowedUserType && userType !== allowedUserType) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Router>
      <SocketProvider>
        <Toaster position="top-right" />
        <LanguageSwitcher />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login/:userType" element={<AuthForm type="login" />} />
            <Route path="/signup/:userType" element={<AuthForm type="signup" />} />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedUserType="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent"
              element={
                <ProtectedRoute allowedUserType="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute allowedUserType="teacher">
                  <TeacherProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/profile"
              element={
                <ProtectedRoute allowedUserType="parent">
                  <ParentProfile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SocketProvider>
    </Router>
  );
}

export default App;
