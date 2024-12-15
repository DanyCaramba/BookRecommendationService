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
import OpenAIComponent from "./OpenAIComponent";

async function getCompletion(message, conversationHistory) {
  try {
      const respone = await fetch('http://localhost:5000/api/openai/continue', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: message,
              history: conversationHistory
          }),
      });

      if (!respone.ok) {
          throw new Error('Failed to fetch completion from backend');
      }

      const data = await respone.json();

      const responseMessage = {
        role: data.role,
        content: data.content
      };

      console.log(responseMessage);
      return responseMessage;
  } catch (error) {
      console.error('Error: ', error);
  }
}

async function summarizeConversation(conversationHistory) {
  try {
    const respone = await fetch('http://localhost:5000/api/openai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: conversationHistory
      }),
    });

    if (!respone.ok) {
      throw new Error('Failed to fetch summarization from backed');
    }

    const data = await respone.json();

    const summarization = data.content
    console.log(summarization);

    return summarization;
  } catch(error) {
    console.error('Error: ', error);
  }
}

async function startChat() {
  try {
      const respone = await fetch('http://localhost:5000/api/openai/start', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
      });

      if (!respone.ok) {
          throw new Error('Failed to fetch completion from backend');
      }

      const data = await respone.json();
      const message = {
        role: data.role,
        content: data.content
      };

      // console.log(message);
      return message;
  } catch (error) {
      console.error('Error: ', error);
  }
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [start, setStart] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const recommendationKeywords = ["rekomendacje", "chce rekomendacje"];
  let questionCount = 0;
  const maxQuestions = 4;
  
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

  const handleStartButton = async () => {
    const systemMessage = { message: "Cześć, mogę polecić Ci książki. Jaki gatunek Cię interesuje?", sender: "System", direction: 'incoming' };
    addMessage(systemMessage.message, systemMessage.sender, systemMessage.direction);

    const initMessage = await startChat()
    console.log(initMessage);

    setConversationHistory(prevHistory => [
      ...prevHistory,
      initMessage
    ]);

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
  const handleSend = async () => {
    if (inputMessage.trim()) {
        const newMessages = [...messages, { message: inputMessage, sender: "User", direction: 'outgoing' }];
        setMessages(newMessages);

        const lowerCasedInput = inputMessage.toLocaleLowerCase();
        const wantsRecommendation = recommendationKeywords.some(keyword => lowerCasedInput.includes(keyword));

        if ((questionCount < maxQuestions) && !wantsRecommendation) {
          const nextQuestion = await getCompletion(inputMessage, conversationHistory);

          setConversationHistory(prevHistory => [
            ...prevHistory,
            {
              role: 'user',
              content: inputMessage
            }
          ]);
  
          setConversationHistory(prevHistory => [
            ...prevHistory,
            nextQuestion
          ]);
  
          setInputMessage('');
  
          setMessages(prevMessages => [
            ...prevMessages,
            { message: nextQuestion.content, sender: "System", direction: 'incoming' }
          ]);

          questionCount++;

          if (questionCount >= maxQuestions) {
            const lastMessage = {
              message: "Dziękuję za przesłane informacje, przetwarzam teraz rekomendacje na podstawie Twoich odpowiedzi.",
              sender: "System",
              direction: "incoming"
            };

            setMessages(prevMessages => [...prevMessages, lastMessage])
            const summarization = await summarizeConversation(conversationHistory);
          }
        } else {
          const lastMessage = {
            message: "Rozumiem, przetwarzam teraz rekomendacje na podstawie Twoich odpowiedzi.",
            sender: "System",
            direction: "incoming"
          };

          setMessages(prevMessages => [...prevMessages, lastMessage])
          const summarization = await summarizeConversation(conversationHistory);
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
    <div className="bg-zinc-800 h-screen text-slate-200 pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Witaj w Apilikacji do rekomendacji książek</h1>

        <h2 className="text-xl font-bold mb-6">Jak będziesz gotowy kliknij przycisk poniżej</h2>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleStartButton}
          disabled={start}
        >
          START
        </button>
      </div>
      <div className="w-96 mx-auto mt-10">
        <MainContainer  style={{ height: "600px", borderRadius: "20px", backgroundColor: "#3f3f46"}}>
          <ChatContainer style={{}}>
            <MessageList style={{backgroundColor: "#3f3f46", borderWidth: "0px"}}>
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
              placeholder="Kliknij Rozpocznij"
              style={{backgroundColor: "#4b5563"}}
            />
          </ChatContainer>
        </MainContainer>

        <div className="flex flex-col items-center mt-4">
          <p className="text-lg font-semibold mb-4 text-slate-200">
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
            {/* <OpenAIComponent/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
