import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";

const Chat = ({ isCallActive }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(
      0,
      chatContainerRef.current.scrollHeight
    );
  }, [messages]);

  const stopWakeWordRecognition = () => {
    if (wakeWordRecognitionRef.current) {
      wakeWordRecognitionRef.current.abort();
      wakeWordRecognitionRef.current.onend = null;
      wakeWordRecognitionRef.current = null;
    }
  };

  const startWakeWordListening = () => {
    if (isListening || isCallActive) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (wakeWordRecognitionRef.current) return;

    wakeWordRecognitionRef.current = new SpeechRecognition();
    wakeWordRecognitionRef.current.lang = "en-US";
    wakeWordRecognitionRef.current.continuous = true;
    wakeWordRecognitionRef.current.interimResults = false;

    wakeWordRecognitionRef.current.onresult = (event) => {
      if (isListening || isCallActive) return;
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (
        transcript.includes("hello") ||
        transcript.includes("how can i help you")
      ) {
        stopWakeWordRecognition();
        startSpeechRecognition();
      }
    };

    wakeWordRecognitionRef.current.onerror = (event) => {
      console.error("Wake word recognition error:", event.error);
    };

    wakeWordRecognitionRef.current.onend = () => {
      if (!isListening && !isCallActive) {
        setTimeout(startWakeWordListening, 2000);
      }
    };

    try {
      wakeWordRecognitionRef.current.start();
    } catch (error) {
      console.warn("Wake word start error:", error);
    }
  };

  useEffect(() => {
    startWakeWordListening();
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    stopWakeWordRecognition();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      let transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      setUserInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        handleSend(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.onend = () => {
      if (!isCallActive) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.onend = null;
      recognitionRef.current = null;
    }
    setIsListening(false);
    startWakeWordListening();
  };

  const handleSend = async (input) => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch("https://crmbackend-yho0.onrender.com/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch response");
      setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to get response.", isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <MdSmartToy size={30} className="chat-icon" />
          <h2>AI ChatBot</h2>
        </div>

        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <div className="message-row" key={index}>
              <div className="bot-side">
                {!msg.isUser ? (
                  <div className="message bot-message">
                    <MdSmartToy className="bot-icon" />
                    <div className="message-content">{msg.text}</div>
                  </div>
                ) : (
                  <div className="empty-placeholder" />
                )}
              </div>
              <div className="user-side">
                {msg.isUser ? (
                  <div className="message user-message">
                    <FaUser className="user-icon" />
                    <div className="message-content">{msg.text}</div>
                  </div>
                ) : (
                  <div className="empty-placeholder" />
                )}
              </div>
            </div>
          ))}

          {isTyping && <div className="typing-indicator">...</div>}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={() => handleSend(userInput)} className="send-button">
            <FaPaperPlane />
          </button>
          <button
            onClick={handleMicClick}
            className={`mic-button ${isListening ? "active" : ""}`}
          >
            <FaMicrophone />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
