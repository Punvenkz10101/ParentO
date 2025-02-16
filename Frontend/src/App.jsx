import { Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import ParentDashboard from './components/ParentPage';
import TeacherDashboard from './components/TeacherPage';

function App() {
  const handleParentLogin = () => {
    window.location.href = '/login/parent';
  };

  const handleTeacherLogin = () => {
    window.location.href = '/login/teacher';
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Hero 
            onParentLogin={handleParentLogin}
            onTeacherLogin={handleTeacherLogin}
          />
        } 
      />
      <Route path="/login/:userType" element={<AuthForm type="login" />} />
      <Route path="/signup/:userType" element={<AuthForm type="signup" />} />
      <Route path='/parentDashboard' element={<ParentDashboard/>}/>
      <Route path='/teacherDashboard' element={<TeacherDashboard/>}/>
    </Routes>
    
  );
}

export default App;










