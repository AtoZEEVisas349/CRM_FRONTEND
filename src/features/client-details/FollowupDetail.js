import React, { useState, useEffect, useRef } from "react";

const FollowUpDetail = ({ onTextChange }) => {
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening); // Added ref for isListening

  // Sync ref with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setReasonDesc((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          stopListening();
        }
      };

      recognitionRef.current.onend = () => {
        if (isListeningRef.current) {
          recognitionRef.current.start(); // Auto-restart only if still listening
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      stopListening();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleTextChange = (e) => {
    setReasonDesc(e.target.value);
  };

  return (
    <div className="followup-detail-theme">

    <div className="followup-detail-container">
      <h2>Follow-Up Details</h2>
      <div className="follow-up-reason">
        <h3>Reason for Follow-Up</h3>
        <div className="interaction-field">
          <label>Interaction Description:</label>
          <div className="textarea-with-speech">
            <textarea
              value={reasonDesc}
              onChange={handleTextChange}
              className="interaction-textarea"
              placeholder="Describe the follow-up reason..."
            />
            <button
              type="button"
              className={`speech-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {isListening ? (
                // Stop icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor" // <-- add this line

                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="5"
                    width="12"
                    height="14"
                    rx="2"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                // Mic icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19 12V13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13V12M12 19V23M8 23H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              onTextChange(reasonDesc);
              setReasonDesc(""); // clear the textarea
            }}
            className="update-btn"
          >
            Update
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FollowUpDetail;
