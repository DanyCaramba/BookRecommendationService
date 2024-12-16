import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { RecommendationsProvider } from './components/RecommendationsContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <RecommendationsProvider> {/* Owinięcie aplikacji w provider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecommendationsProvider>
</React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
