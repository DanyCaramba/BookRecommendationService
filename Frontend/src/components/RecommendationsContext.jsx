import React, { createContext, useState,useEffect } from "react";

// Tworzymy kontekst
export const RecommendationsContext = createContext();

// Tworzymy provider
export const RecommendationsProvider = ({ children }) => {
  const [bookRecommendations, setBookRecommendations] = useState([]);

  useEffect(() => {
    console.log("Context updated: ", bookRecommendations);
  }, [bookRecommendations]);

  return (
    <RecommendationsContext.Provider value={{ bookRecommendations, setBookRecommendations }}>
      {children}
    </RecommendationsContext.Provider>
  );
};
