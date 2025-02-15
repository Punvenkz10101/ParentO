'use client';

import { useState } from 'react';

export default function Hero() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const languages = [
    { name: 'Hindi', src: '/videos/hindi.mp4' },
    { name: 'Tamil', src: '/videos/tamil.mp4' },
    { name: 'Telugu', src: '/videos/telugu.mp4' },
    { name: 'Kannada', src: '/videos/kannada.mp4' },
    { name: 'English', src: '/videos/english.mp4' },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center bg-no-repeat px-6 md:px-12"
      style={{ backgroundImage: "url('/assets/images/nikhita-s-NsPDiPFTp4c-unsplash.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-lg animate-fade-in text-white">
          Welcome to <span className="text-white">ParentO</span>
        </h1>

        <p className="text-lg md:text-xl mt-4 opacity-90 animate-slide-up">
          Empowering <span className="font-semibold text-white">students</span> through <span className="font-semibold text-white">parents</span>
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center">
          <button className="px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Parent Login
          </button>
          <button className="px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Teacher Login
          </button>
        </div>

        {/* Video Tutorials Section */}
        <h2 className="mt-16 text-3xl md:text-4xl font-bold text-white animate-fade-in">
          How to Use - Video Tutorial <span className="text-white">(5 Languages)</span>
        </h2>

        {/* Video Language Selection */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 justify-center">
          {languages.map((lang, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideo(lang.src)}
              className={`w-full max-w-sm p-4 bg-gray-800 text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 ${
                lang.name === 'Kannada' || lang.name === 'English' ? 'md:col-span-1' : ''
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Video Player */}
        {selectedVideo && (
          <div className="mt-8 w-full max-w-2xl">
            <video className="w-full rounded-lg shadow-lg" controls autoPlay>
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
