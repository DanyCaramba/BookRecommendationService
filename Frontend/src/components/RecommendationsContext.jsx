import React, { createContext, useState,useEffect } from "react";

// Tworzymy kontekst
export const RecommendationsContext = createContext();

// Tworzymy provider
export const RecommendationsProvider = ({ children }) => {
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [loading2, setLoading2] = useState(false);
  useEffect(() => {
    console.log("Context updated: ", bookRecommendations);
  }, [bookRecommendations]);

  return (
    <RecommendationsContext.Provider 
    value={{ bookRecommendations, 
          setBookRecommendations,
          loading2,
        setLoading2,

     }}>
      {children}
    </RecommendationsContext.Provider>
  );
};
