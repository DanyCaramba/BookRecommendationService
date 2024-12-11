import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <p className="text-lg font-semibold mb-4">
        Microphone: <span className={`font-bold ${listening ? 'text-green-500' : 'text-red-500'}`}>{listening ? 'ON' : 'OFF'}</span>
      </p>
      <div className="flex space-x-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => SpeechRecognition.startListening({ language: 'pl-PL' })}
        >
          Start
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={SpeechRecognition.stopListening}
        >
          Stop
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={resetTranscript}
        >
          Reset
        </button>
      </div>
      <div className="bg-gray-100 rounded-md p-4 w-full text-center shadow-inner">
        <p>{transcript || "Say something..."}</p>
      </div>
    </div>
  );
};

export default Dictaphone;
