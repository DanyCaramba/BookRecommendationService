import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
function SelectedBook() {
    const navigate = useNavigate();

    // Pobranie danych książki z localStorage
    const book = JSON.parse(localStorage.getItem('selectedBook'));

    if (!book) {
        return (
            <div className="bg-gray-100 min-h-screen flex justify-center items-center">
                <h1 className="text-2xl text-gray-800">No book selected!</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white text-sm py-2 px-4 rounded ml-4 hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
            <div className="bg-white rounded-lg shadow-md w-[1000px] h-[800px] p-4 ">
                <div className="flex h-[90%] ">
                    <div className="bg-red-300 w-[50%] h-[95%] rounded-lg">
                        <img
                            src={book.image}
                            alt={book.title}
                            className=" w-full h-full object-cover rounded ">
                        </img>
                    </div>
                    <div className="ml-10 w-[50%] h-[90%] rounded-lg p-4 overflow-auto">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">{book.title}</h1>
                        <p className="text-gray-700 mb-2 text-2xl">
                            <strong>Original Title:</strong> {book.originalTitle}
                        </p>
                        <p className="text-gray-700 mb-2 text-2xl">
                            <strong>Author:</strong> {book.author}
                        </p>
                        <p className="text-gray-700 mb-2 text-2xl">
                            <strong>Publisher:</strong> {book.publisher}
                        </p>
                        <p className="text-gray-700 mb-2 text-2xl">
                            <strong>Category:</strong> {book.category}
                        </p>
                        <p className="text-gray-700 mb-2 text-2xl">
                            <strong>Pages:</strong> {book.pages}
                        </p>
                        <p className="text-gray-700 mb-12 text-2xl">
                            <strong>Tags:</strong> {book.tags.join(', ')}
                        </p>
                        <p className=" text-gray-700  text-2xl text-center">
                            <strong>Description:</strong>
                            <p> {book.description}</p>
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center  ">
                    <BackButton />
                </div>
            </div>
        </div>
    );
}

export default SelectedBook;