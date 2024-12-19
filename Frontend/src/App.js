
import './App.css';
import './output.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes i Route

// Import komponentów odpowiadających poszczególnym stronom
import Home from './pages/Home';
import BookRecommendations from './pages/BookRecommendations';
import SelectedBook from './pages/SelectedBook';
import Chat from './components/Chat';
import ChatFull from './components/ChatFull';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatFull/>} />
        <Route path="/BooksRecommendations" element={<BookRecommendations/>} />
        <Route path="/SelectedBook" element={<SelectedBook/>} />
      </Routes>
    </div>
  );
}

export default App;

