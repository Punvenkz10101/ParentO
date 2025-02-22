'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const languages = [
    { name: 'Hindi', src: '/videos/hindi.mp4' },
    { name: 'Tamil', src: '/videos/tamil.mp4' },
    { name: 'Telugu', src: '/videos/telugu.mp4' },
    { name: 'Kannada', src: '/videos/kannada.mp4' },
    { name: 'English', src: '/videos/english.mp4' },
  ];

  const openVideoModal = (src) => {
    setSelectedVideo(src);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleParentLogin = () => {
    navigate('/login/parent');
  };

  const handleTeacherLogin = () => {
    navigate('/login/teacher');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center bg-no-repeat px-6 md:px-12 pt-8 sm:pt-12 lg:pt-16"
      style={{ backgroundImage: "url('/assets/images/nikhita-s-NsPDiPFTp4c-unsplash.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-lg animate-fade-in text-white leading-tight mt-4 md:mt-0">
          {t('welcome')}
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl mt-4 sm:mt-6 opacity-90 animate-slide-up">
          {t('hero.subtitle')} <span className="font-semibold text-white">{t('hero.students')}</span> {t('hero.through')} <span className="font-semibold text-white">{t('hero.parents')}</span>
        </p>

        {/* Login Buttons Container */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
          <button 
            onClick={handleParentLogin} 
            className="w-full px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            {t('login.parent')}
          </button>
          <button 
            onClick={handleTeacherLogin} 
            className="w-full px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            {t('login.teacher')}
          </button>
        </div>

        {/* Video Tutorials Section */}
        <h2 className="mt-12 sm:mt-16 text-2xl sm:text-3xl md:text-4xl font-bold text-white animate-fade-in">
          {t('tutorial.title')} <span className="text-white">({t('tutorial.languages')})</span>
        </h2>

        {/* Language Buttons Container */}
        <div className="mt-4 sm:mt-6 max-w-2xl mx-auto px-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.slice(0, 3).map((lang, index) => (
              <button
                key={index}
                onClick={() => openVideoModal(lang.src)}
                className="w-full px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            {languages.slice(3).map((lang, index) => (
              <button
                key={index + 3}
                onClick={() => openVideoModal(lang.src)}
                className="w-full md:w-1/3 px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <video className="w-full" controls autoPlay>
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <button
              className="absolute top-4 right-4 p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300"
              onClick={closeVideoModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
