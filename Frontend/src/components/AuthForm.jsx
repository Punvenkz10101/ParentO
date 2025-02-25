import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from '../lib/axios';
import { toast } from "react-hot-toast";

export default function AuthForm({ type }) {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { userType } = useParams();
  const navigate = useNavigate();

  // Reset form when language changes
  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
  }, [i18n.language]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === "login" ? "login" : "signup";
      console.log('Submitting auth request:', {
        userType,
        endpoint,
        url: `${userType}/${endpoint}`
      });

      const response = await api.post(`${userType}/${endpoint}`, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userType', userType);
        
        const dashboardPath = userType === "parent" ? "/parentDashboard" : "/teacherDashboard";
        window.location.href = dashboardPath;
      } else if (type === "signup") {
        toast.success('Registration successful! Please login.');
        navigate(`/login/${userType}`, { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed');
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
          {t(`auth.${type}`)} {t('auth.as')} {t(`auth.${userType}`)}
        </h2>

        {type === "signup" && (
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder={t('auth.namePlaceholder')}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2"
          />
        )}

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder={t('auth.emailPlaceholder')}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder={t('auth.passwordPlaceholder')}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          {t(`auth.${type}`)}
        </button>

        <p className="mt-4 text-center">
          {type === "login" ? (
            <>
              {t('auth.noAccount')}{" "}
              <Link to={`/signup/${userType}`} className="text-blue-500 underline">
                {t('auth.signup')}
              </Link>
            </>
          ) : (
            <>
              {t('auth.haveAccount')}{" "}
              <Link to={`/login/${userType}`} className="text-blue-500 underline">
                {t('auth.login')}
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
