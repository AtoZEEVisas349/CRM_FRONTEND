import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md"; // AI Robot Icon
import "./chatbot.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const chatContainerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isManuallyStopped, setIsManuallyStopped] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Keep listening until stopped manually
            recognitionRef.current.interimResults = false; // Only final results
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    finalTranscript += event.results[i][0].transcript + " ";
                }
                finalTranscript = finalTranscript.trim();

                if (finalTranscript) {
                    setUserInput(finalTranscript);
                    handleSend(finalTranscript); // Send instantly
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (!isManuallyStopped) {
                    recognitionRef.current.start(); // Restart if not manually stopped
                } else {
                    setIsListening(false);
                }
            };
        }

        if (!isListening) {
            setIsManuallyStopped(false); // Reset manual stop flag
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            setIsManuallyStopped(true); // Mark as manually stopped
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSend = async (input) => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { text: input, isUser: true }]);
        setUserInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch response");
            setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { text: "Error: Unable to get response.", isUser: false }]);
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
                        placeholder="Type your message..." 
                    />
                    <button onClick={() => handleSend(userInput)} className="send-button">
                        <FaPaperPlane />
                    </button>
                    <button onClick={handleMicClick} className={`mic-button ${isListening ? "active" : ""}`}>
                       <FaMicrophone />
                   </button>

                </div>
            </div>
        </div>
    );
};

export default Chat;
