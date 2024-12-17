import { useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect,useContext } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import ReactLoading from 'react-loading';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import OpenAIComponent from "./OpenAIComponent";
import { RecommendationsContext } from "./RecommendationsContext";

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

    const  summarization = data.content
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



const Chat = ({ sidebar }) => {
  const [loading, setLoading] = useState(false); // Dodano stan ładowania
  const navigate = useNavigate(); // Hook do nawigacji
  const { setBookRecommendations } = useContext(RecommendationsContext);
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
    const greetings = sidebar ? "Potrzebujesz dalszej rekomendacji lub poprzednie wyniki nie były dokładne?" : "Cześć, mogę polecić Ci książki. Jaki gatunek Cię interesuje?"
    const systemMessage = { message: greetings, sender: "System", direction: 'incoming' };
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
            setLoading(true);
            const summarization = await summarizeConversation(conversationHistory);
            await sendSummaryToBackend(summarization, setBookRecommendations);
          }
        } else {
          const lastMessage = {
            message: "Rozumiem, przetwarzam teraz rekomendacje na podstawie Twoich odpowiedzi.",
            sender: "System",
            direction: "incoming"
          };

          setMessages(prevMessages => [...prevMessages, lastMessage])
          setLoading(true);
          const summarization = await summarizeConversation(conversationHistory);
          await sendSummaryToBackend(summarization, setBookRecommendations);
        }
    }
  };





  async function sendSummaryToBackend(summarization, setBookRecommendations) {
    try {
      const response = await fetch('http://172.25.161.17:5041/recommendation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          string: summarization,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send summary to backend');
      }
  
      const data = await response.json();
      console.log('Summary successfully sent to backend:', data);
  
      // Zapisz dane w kontekście
      const parsedBooks = JSON.parse(data.data).flat(); // Parsuj dane z backendu
      setBookRecommendations(parsedBooks); // Zapisz w kontekście
      console.log("Books saved to context:", parsedBooks);

      navigate('/BooksRecommendations');
      return data;
    } catch (error) {
      console.error('Error sending summary to backend:', error);
    }
  }


  const Load = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={667} width={375} />
);



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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-800">
        <ReactLoading type="bars" color="#FFFFFF" height={100} width={100} />
      </div>
    );
  }
  return (
      <div className="w-96 mx-auto mt-10 flex flex-col gap-5">
      <button
          className="px-4 py-2 w-fit self-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleStartButton}
          disabled={start}
        >
          START
        </button>
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
  );
};

export default Chat;
