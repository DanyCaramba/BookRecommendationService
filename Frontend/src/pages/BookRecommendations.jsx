import React, { useState, useContext } from 'react';
import { RecommendationsContext } from '../components/RecommendationsContext';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat'
import ReactLoading from 'react-loading';
function BookRecommendations() {
  const navigate = useNavigate(); // Hook do nawigacji
  const [isVisible, setIsVisible] = useState(false);
  const { bookRecommendations } = useContext(RecommendationsContext);
  const { loading2 } = useContext(RecommendationsContext);
  const handleSelectBook = (book) => {
    localStorage.setItem('selectedBook', JSON.stringify(book)); // Zapisz książkę do localStorage
    navigate('/SelectedBook'); // Przejdź do strony szczegółów książki
  };

  return (
    <div className="bg-zinc-800 min-h-screen p-6 flex flex-wrap justify-center gap-4 relative">
      <h1 className="text-center text-4xl font-bold mb-8 text-slate-200 w-full">
        Here are some recommended books tailored to your preferences
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading2 ? (
          // Ekran ładowania
                <div className="flex justify-center items-center h-screen bg-zinc-800">
                  <ReactLoading type="bars" color="#FFFFFF" height={100} width={100} />
                </div>
        ) : bookRecommendations.length > 0 ? (
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
      <div
        className={`bg-blue-500 h-16 w-16 fixed bottom-1 right-96 animate-bounce flex items-center justify-center rounded-3xl border-2 p-1 cursor-pointer
          ${isVisible ? "translate-x-20" : "translate-x-0"}
          transition-all duration-500 ease-in-out`}
        onClick={() => setIsVisible(!isVisible)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="#3b82f6"
          stroke="#e2e8f0"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-brand-hipchat"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z" />
          <path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0" />
        </svg>
      </div>
      <div
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 ${isVisible ? "-translate-x-10 opacity-100" : "translate-x-0 opacity-0"
          } transition-all duration-500 ease-in-out`}
      >
        {/* Content you want to animate */}
        <Chat sidebar={true} />
      </div>
    </div>
  );
}

export default BookRecommendations;
