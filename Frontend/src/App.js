
import './App.css';
import './output.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes i Route

// Import komponentów odpowiadających poszczególnym stronom
import Home from './pages/Home';
import BookRecommendations from './pages/BookRecommendations';
import SelectedBook from './pages/SelectedBook';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/BooksRecommendations" element={<BookRecommendations />} />
        <Route path="/SelectedBook" element={<SelectedBook/>} />
      </Routes>
    </div>
  );
}

export default App;

