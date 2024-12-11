import React, { useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL'; // Język polski
      utterance.pitch = 1.2; // Wysokość głosu (1 - domyślna)
      utterance.rate = 1.2; // Szybkość mowy (1 - domyślna)
      speechSynthesis.speak(utterance);
    } else {
      alert('Twoja przeglądarka nie obsługuje Text-to-Speech.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Text to Speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Wpisz tekst tutaj..."
        style={{ marginBottom: '10px' }}
      ></textarea>
      <br />
      <button onClick={handleSpeak}>Mów</button>
    </div>
  );
};

export default TextToSpeech;
