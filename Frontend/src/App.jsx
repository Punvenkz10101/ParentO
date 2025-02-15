import {  Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import ParentDashboard from './components/ParentPage'
import TeacherDashboard from './components/TeacherPage'
function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login/:userType" element={<AuthForm type="login" />} />
        <Route path="/signup/:userType" element={<AuthForm type="signup" />} />
      </Routes>
    /* <Hero /> */
   /* <ParentDashboard />
    <TeacherDashboard/>*/
  );
}

export default App;










