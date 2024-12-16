import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate(); // Hook do obsługi nawigacji

  return (
    <button
      onClick={() => navigate(-1)} // Przejdź o jedną stronę wstecz
      className="bg-zinc-800 text-white font-bold py-2 px-4 rounded hover:bg-zinc-300 transition duration-300"
    >
      Back
    </button>
  );
}

export default BackButton;
