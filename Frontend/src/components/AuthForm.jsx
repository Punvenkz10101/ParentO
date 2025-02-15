import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { userType } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === 'login' ? 'login' : 'signup';
    const url = `http://localhost:5000/api/${userType}/${endpoint}`;

    try {
      const res = await axios.post(url, formData);
      if (type === 'login') {
        localStorage.setItem('token', res.data.token);
        alert('Login successful!');
        if (userType === 'parent') {
          navigate('/parentDashboard');
        } else if (userType === 'teacher') {
          navigate('/teacherDashboard');
        } else {
          navigate('/');  // Default fallback
        }
      } else {
        alert('Signup successful! Please log in.');
        navigate(`/login/${userType}`);
      }
    } catch (err) {
      console.error('Error:', err);  // Log full error for debugging
      console.error('Response:', err.response);  // Log response object
      alert(err.response?.data?.error || err.message || 'An error occurred');
    }
    
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          {type === 'login' ? 'Login' : 'Signup'} as {userType}
        </h2>

        {type === 'signup' && (
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
          {type === 'login' ? 'Login' : 'Signup'}
        </button>

        <p className="mt-4 text-center">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to={`/signup/${userType}`} className="text-blue-500 underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
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
