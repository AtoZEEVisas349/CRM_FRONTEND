import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md"; // AI Robot Icon
import "./chatbot.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const chatContainerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false); // State to track mic status
    const recognitionRef = useRef(null); // Store SpeechRecognition instance

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Initialize SpeechRecognition only when the mic button is clicked
    const handleMicClick = () => {
        if (!recognitionRef.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser.");
                return;
            }

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
                setTimeout(() => handleSend(transcript), 500);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        if (!isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSend = async (input = userInput) => {
        if (!input.trim()) return;

        // Add user message to chat
        setMessages((prev) => [...prev, { text: input, isUser: true }]);
        setUserInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }), // ✅ Fixed: Ensure the key matches backend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch response");
            }

            setMessages((prev) => [...prev, { text: data.message, isUser: false }]); // ✅ Fixed: Correct response key
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { text: "Error: Unable to get response.", isUser: false }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ✅ Fixed: Define handleKeyDown to prevent ESLint error
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line on Enter key
            handleSend();
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
                        <div key={index} className={msg.isUser ? "message user-message" : "message bot-message"}>
                            {msg.isUser ? <FaUser className="user-icon" /> : <MdSmartToy className="bot-icon" />}
                            <div className="message-content">{msg.text}</div>
                        </div>
                    ))}
                    {isTyping && <div className="typing-indicator">...</div>}
                </div>

                <div className="chat-input-container">
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        onKeyDown={handleKeyDown} // ✅ Fixed: Now defined properly
                        placeholder="Type your message..." 
                    />
                    <button onClick={() => handleSend()} className="send-button"><FaPaperPlane /></button>
                    <button onClick={handleMicClick} className={`mic-button ${isListening ? "active" : ""}`}>
                        <FaMicrophone />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
