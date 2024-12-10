import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import book1 from '../assets/book1.jpg';
import book2 from '../assets/book2.jpg';
import book3 from '../assets/book3.jpg';
import book4 from '../assets/book4.jpg';
import book5 from '../assets/book5.jpg';
function BookRecommendations() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Hook do nawigacji

  useEffect(() => {
    const fetchData = async () => {
      const fakeData = {
        recommendations: [
          {
            title: "The Great Gatsby",
            originalTitle: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            publisher: "Scribner",
            category: "Fiction",
            pages: 180,
            tags: ["Classic", "Novel"],
            image: book5,
            description: "A classic novel set in the 1920s about wealth and excess."
          },
          {
            title: "To Kill a Mockingbird",
            originalTitle: "To Kill a Mockingbird",
            author: "Harper Lee",
            publisher: "J.B. Lippincott & Co.",
            category: "Fiction",
            pages: 281,
            tags: ["Classic", "Justice", "Race"],
            image: book4,
            description: "A moving story about justice and racial inequality in the Deep South."
          },
          {
            title: "1984",
            originalTitle: "Nineteen Eighty-Four",
            author: "George Orwell",
            publisher: "Secker & Warburg",
            category: "Dystopian",
            pages: 328,
            tags: ["Dystopia", "Politics"],
            image: book3,
            description: "A dystopian novel about a totalitarian regime and the dangers of surveillance."
          },
          {
            title: "The Catcher in the Rye",
            originalTitle: "The Catcher in the Rye",
            author: "J.D. Salinger",
            publisher: "Little, Brown and Company",
            category: "Fiction",
            pages: 277,
            tags: ["Classic", "Adolescence"],
            image: book2,
            description: "A story about teenage alienation and rebellion."
          },
          {
            title: "Pride and Prejudice",
            originalTitle: "Pride and Prejudice",
            author: "Jane Austen",
            publisher: "T. Egerton",
            category: "Romance",
            pages: 279,
            tags: ["Classic", "Romance", "Satire"],
            image: book1,
            description: "A classic romantic novel exploring manners, marriage, and social status."
          }
        ]
      };
      setBooks(fakeData.recommendations);
    };

    fetchData();
  }, []);

  const handleSelectBook = (book) => {
    localStorage.setItem('selectedBook', JSON.stringify(book)); // Zapisz książkę do localStorage
    navigate('/SelectedBook'); // Przejdź do strony szczegółów książki
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-wrap justify-center gap-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800 w-full">
        Recommended Books
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div
            key={index}
            onClick={() => handleSelectBook(book)} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 w-[300px] h-[500px] flex flex-col"
          >
            {/* Kontener obrazu */}
            <div className="h-[400px] w-full">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Informacje o książce */}
            <div className="p-2 flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookRecommendations;
