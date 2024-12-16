import React, { useContext, useState, useEffect } from "react";
import { RecommendationsContext } from "./RecommendationsContext";
import PreLoader1 from "./PreLoader1";

const BooksRecommendations = () => {
  const { bookRecommendations } = useContext(RecommendationsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Symulacja ładowania
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PreLoader1 done={!loading}>
      <div>
        <h1>Book Recommendations</h1>
        <ul>
          {bookRecommendations.map((book, index) => (
            <li key={index}>{book.title}</li>
          ))}
        </ul>
      </div>
    </PreLoader1>
  );
};

export default BooksRecommendations;
