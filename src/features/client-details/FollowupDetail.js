import React, { useState, useEffect, useRef } from "react";

const FollowUpDetail = () => {
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript;
        
        if (lastResult.isFinal) {
          setReasonDesc(prev => prev + (prev ? ' ' : '') + transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopListening();
      };

      recognitionRef.current.onend = () => {
        stopListening();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    } else {
      stopListening();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="followup-detail-container">
      <h2>Follow-Up Details</h2>

      <div className="follow-up-reason">
        <h3>Reason for Follow-Up</h3>
        <div className="interaction-field">
          <label>Interaction Description:</label>
          <div className="textarea-with-speech">
            <textarea
              value={reasonDesc} 
              onChange={(e) => setReasonDesc(e.target.value)} 
              className="interaction-textarea"
              placeholder="Describe the follow-up reason..."
            />
            <button 
              type="button"
              className={`speech-btn ${isListening ? 'listening' : ''}`}
              onClick={handleSpeechRecognition}
              aria-label={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="5" width="12" height="14" rx="2" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill="currentColor"/>
                  <path d="M19 12V13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13V12M12 19V23M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="follow-up-datetime">
        <h3>Follow-Up Date and Time</h3>
        <div className="datetime-container">
          <div className="date-field">
            <p className="label">Date:</p>
            <p className="value">10-03-2024</p>
          </div>
          <div className="time-field">
            <p className="label">Time:</p>
            <p className="value">11:30PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpDetail;