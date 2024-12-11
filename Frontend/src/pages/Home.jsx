import React from 'react';
import Dictaphone from '../components/Dictaphone';
import TextToSpeech from '../components/TextToSpeech';
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Speech Recognition App</h1>
        <Dictaphone />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Text to Speech</h2>
        <TextToSpeech />
      </div>
    </div>
  );
};

export default Home;
