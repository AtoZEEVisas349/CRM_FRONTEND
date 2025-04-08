import React, { useState, useEffect, useRef } from "react";

const ClientInteraction = () => {
  const [interactionDesc, setInteractionDesc] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState([]);
  const [interactionRating, setInteractionRating] = useState("");
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
          setInteractionDesc(prev => prev + (prev ? ' ' : '') + transcript);
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

  const handleCheckboxChange = (value, stateSetter, stateValue) => {
    if (stateValue.includes(value)) {
      stateSetter(stateValue.filter((item) => item !== value));
    } else {
      stateSetter([...stateValue, value]);
    }
  };

  return (
    <div className="client-interaction-container">
      <div className="add-interaction">
        <h3>Add Interaction</h3>
        <div className="interaction-form">
          <div className="interaction-field">
            <label>Interaction Description:</label>
            <div className="textarea-with-speech">
              <textarea
                value={interactionDesc}
                onChange={(e) => setInteractionDesc(e.target.value)}
                className="interaction-textarea"
                placeholder="Describe the interaction..."
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

          <div className="connected-via">
            <h4>Connected Via</h4>
            <div className="radio-group">
              {["call", "email", "call/email"].map((method) => (
                <label key={method} className="radio-container">
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={contactMethod === method}
                    onChange={() => setContactMethod(method)}
                  />
                  <span className="radio-label">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="follow-up-type">
            <h4>Follow-Up Type</h4>
            <div className="checkbox-group">
              {["interested", "appointment", "no-response", "converted", "not-interested", "close"].map((type) => (
                <label key={type} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={followUpType.includes(type)}
                    onChange={() => handleCheckboxChange(type, setFollowUpType, followUpType)}
                  />
                  <span className="checkbox-label">{type.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="interaction-rating">
            <h4>Interaction Rating</h4>
            <div className="radio-group">
              {["hot", "warm", "cold"].map((rating) => (
                <label key={rating} className="radio-container">
                  <input
                    type="radio"
                    name="interactionRating"
                    checked={interactionRating === rating}
                    onChange={() => setInteractionRating(rating)}
                  />
                  <span className="radio-label">{rating.charAt(0).toUpperCase() + rating.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInteraction;