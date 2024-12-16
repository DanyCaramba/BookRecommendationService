import React, { useState, useEffect,useContext } from 'react';
import { RecommendationsContext } from '../components/RecommendationsContext';
import { useNavigate } from 'react-router-dom'; 

function BookRecommendations() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Hook do nawigacji
const { bookRecommendations } = useContext(RecommendationsContext);
  useEffect(() => {
    // Symulacja pobierania danych z backendu
    const fetchData = async () => {
      const simulatedResponse = {
        data: `[[
          {
            "pages": "302.0",
            "description": "Fortællingen, som delvis er baseret på forfatterens slægts historie...",
            "author": "Włodzimierz Paźniewski",
            "category": "literatura piękna",
            "tags": "Kresy,PRL",
            "cover": "http://books.google.com/books/content?id=Ho1hAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            "id": 454581655249701615,
            "title": "Skoro świt",
            "publisher": "Książnica"
          },
          {
            "pages": "18.0",
            "description": "„Arcydzieło kryminału i tajemnicy! ...",
            "author": "Jesper Bugge Kold",
            "category": "literatura obyczajowa, romans",
            "tags": "II wojna światowa",
            "cover": "http://books.google.com/books/content?id=_evEDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "id": 454581655249701639,
            "title": "Czas przed śmiercią: część czwarta",
            "publisher": "Saga Egmont"
          }
        ]]`
      };

      const parsedBooks = JSON.parse(simulatedResponse.data).flat(); 
      setBooks(parsedBooks);
    };

    fetchData();
  }, []);

  const handleSelectBook = (book) => {
    localStorage.setItem('selectedBook', JSON.stringify(book)); // Zapisz książkę do localStorage
    navigate('/SelectedBook'); // Przejdź do strony szczegółów książki
  };
  
  return (
    <div className="bg-zinc-800 min-h-screen p-6 flex flex-wrap justify-center gap-4">
      <h1 className="text-center text-4xl font-bold mb-8 text-slate-200 w-full">
        Here are some recommended books tailored to your preferences
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookRecommendations.length > 0 ? (
          bookRecommendations.map((book, index) => (
            <div
              key={index}
              onClick={() => handleSelectBook(book)}
              className="bg-[#525252] rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 w-[300px] h-[550px] flex flex-col cursor-pointer"
            >
              {/* Kontener obrazu */}
              <div className="h-[450px] w-full">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Informacje o książce */}
              <div className="p-2 flex-grow">
                <h2 className="text-xl font-semibold text-[#fafafa]">
                  {book.title}
                </h2>
                <p className="text-sm text-[#a3a3a3]">{book.author}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-slate-200">
            No recommendations available. Please provide your preferences in the chat.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookRecommendations;
