import React, { useState, useEffect } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [start, setStart] = useState(false);

  const [userPreferences, setUserPreferences] = useState({
    genre: "",
    mood: "",
    focus: "",
    length: "",
    author: ""
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Jakiego gatunku książki szukasz? (Powieść, kryminał, fantastyka, literatura faktu, biografia)",
    "Czy preferujesz książki z bardziej mrocznym czy pełnym przygód nastrojem?",
    "Czy interesują Cię książki z wątkiem romantycznym, czy raczej szukasz opowieści skoncentrowanej na akcji?",
    "Jak długo chciałbyś spędzić czas z książką? Krótkie opowieści czy bardziej rozbudowane powieści?",
    "Masz preferencje co do autora lub serii książek?"
  ];
  
  // Use the SpeechRecognition hook from react-speech-recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Function to add new message to the chat
  const addMessage = (message, sender, direction) => {
    setMessages(prevMessages => [...prevMessages, { message, sender, direction }]);
  };

  // Function to handle the speech synthesis (TTS) for Polish
  const speakMessage = (message) => {
    const msg = new SpeechSynthesisUtterance(message);
    msg.lang = 'pl-PL';
    window.speechSynthesis.speak(msg);
  };

  const handleStartButton = () => {
    const systemMessage = { message: "Cześć, mogę polecić Ci książki. Jaki gatunek Cię interesuje?", sender: "System", direction: 'incoming' };
    addMessage(systemMessage.message, systemMessage.sender, systemMessage.direction);
    setStart(true);
  }

  // UseEffect to automatically speak system messages
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'System') {
      speakMessage(messages[messages.length - 1].message);
    }
  }, [messages]);

  // Handle input change from typing
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);  // Set the input value in the state
  };

  // Handle message send
  const handleSend = () => {
    // if (inputMessage.trim()) {
    //   addMessage(inputMessage, "User", "outgoing");
    //   setInputMessage('');
    //   // Simulate a system response
    //   addMessage("Oto książka, którą mogę Ci polecić: 'Wielki Gatsby'", "System", "incoming");
    // }
    if (inputMessage.trim()) {
        const newMessages = [...messages, { message: inputMessage, sender: "User", direction: 'outgoing' }];
        setMessages(newMessages);

        const questionKey = Object.keys(userPreferences)[currentQuestion];
        setUserPreferences({
            ...userPreferences,
            [questionKey]: inputMessage
        });

        setInputMessage('');

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setMessages(prevMessages => [
                ...prevMessages,
                { message: questions[currentQuestion + 1], sender: "System", direction: 'incoming' }
            ]);
        } else {
            recommendBook();
        }
    }
  };

  //funkcja do wywołania backendu
  const recommendBook = () => {
    // Here you can analyze the answers in `userPreferences` and give recommendations
    setMessages(prevMessages => [
      ...prevMessages,
      { message: "Na podstawie Twoich odpowiedzi, polecam Ci książkę 'Wielki Gatsby' F. Scotta Fitzgeralda!", sender: "System", direction: 'incoming' }
    ]);
  };

  // Handle start listening for speech recognition
  const handleStartListening = () => {
    SpeechRecognition.startListening({ language: 'pl-PL' });
  };

  // Handle stop listening for speech recognition
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript();
    setInputMessage('');
  };

  // Update the inputMessage with the transcript from speech recognition
  useEffect(() => {
    if (transcript !== '') {
      setInputMessage(transcript);
    }
  }, [transcript]);

  return (
    <div className="">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Aplikacja do rekomendacji książek</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Jak będziesz gotowy kliknij przycisk poniżej</h2>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleStartButton}
          disabled={start}
        >
          START
        </button>
      </div>
      <div className="w-96 mx-auto mt-10" style={{ height: "600px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  model={{
                    message: msg.message,
                    sentTime: "just now",
                    sender: msg.sender,
                    direction: msg.direction
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              value={inputMessage}
              onChange={handleInputChange}
              onSend={handleSend}
              placeholder="Napisz wiadomość"
            />
          </ChatContainer>
        </MainContainer>

        {/* Speech Recognition Controls */}
        <div className="flex flex-col items-center mt-4">
          <p className="text-lg font-semibold mb-4">
            Mikrofon: <span className={`font-bold ${listening ? 'text-green-500' : 'text-red-500'}`}>{listening ? 'WŁĄCZONY' : 'WYŁĄCZONY'}</span>
          </p>
          <div className="flex space-x-4 mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleStartListening}
              disabled={!start}
            >
              Rozpocznij
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleStopListening}
              disabled={!start}
            >
              Zatrzymaj
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleReset}
              disabled={!start}
            >
              Powtórz wiadomość
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
