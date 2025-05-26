
import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaTimes, FaBell, FaCheck } from 'react-icons/fa';
import { BeepSettingsContext } from './context/BeepSettingsContext';
import { SoundGenerator, soundOptions } from './features/settings/SoundGenerator';
import '../src/styles/beepNotification.css';

const BeepNotification = ({ 
  notifications, 
  unreadCount, 
  onDismissPopup, 
}) => {
  const { settings } = useContext(BeepSettingsContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const timeoutRef = useRef(null);
  const dismissTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const soundGeneratorRef = useRef(null);

  // Initialize sound generator
  useEffect(() => {
    soundGeneratorRef.current = new SoundGenerator();
    
    return () => {
      if (soundGeneratorRef.current) {
        soundGeneratorRef.current.close();
      }
    };
  }, []);

  const playNotificationSound = async () => {
    if (settings.enabled && soundGeneratorRef.current) {
      const selectedSound = soundOptions.find(s => s.id === settings.selectedSound);
      if (selectedSound) {
        try {
          await selectedSound.generator(soundGeneratorRef.current, settings.volume);
        } catch (error) {
          console.log('Audio play failed:', error);
        }
      }
    }
  };

  const showNotificationPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    playNotificationSound();
  };

  const handleDismissPopup = () => {
    setShowPopup(false);
    
    // Clear all timeouts and intervals
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Set timeout for reminder message
    dismissTimeoutRef.current = setTimeout(() => {
      if (unreadCount > 0) {
        showNotificationPopup("Haven't you checked the New leads yet?");
        setIsFirstMessage(false);
      }
    }, (settings.reminderDelay || 30) * 1000);
    
    if (onDismissPopup) onDismissPopup();
  };

  // Effect to handle beep interval when popup is shown
  useEffect(() => {
    // Clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (showPopup && unreadCount > 0 && settings.enabled && settings.timing > 0) {
      // Set new interval based on current settings
      intervalRef.current = setInterval(() => {
        playNotificationSound();
      }, settings.timing * 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showPopup, unreadCount, settings.enabled, settings.timing, settings.selectedSound, settings.volume]);

  // Effect to handle notification logic
  useEffect(() => {
    if (unreadCount > 0) {
      if (isFirstMessage) {
        showNotificationPopup('New leads assigned');
        timeoutRef.current = setTimeout(() => {
          if (showPopup) {
            setPopupMessage("Haven't you checked the New leads yet?");
            setIsFirstMessage(false);
          }
        }, 30000);
      } else {
        showNotificationPopup("Haven't you checked the New leads yet?");
      }
    } else {
      setShowPopup(false);
      setIsFirstMessage(true);
      
      // Clear all timeouts and intervals when no unread messages
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [unreadCount]);

  // Update first message state when popup message changes
  useEffect(() => {
    if (popupMessage.includes("Haven't you checked")) {
      setIsFirstMessage(false);
    }
  }, [popupMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!showPopup) return null;

  return (
    <>
      <div className="beep-notification-overlay">
        <div className="beep-notification-popup">
          <div className="beep-notification-header">
            <div className="beep-notification-icon">
              <FaBell size={24} />
            </div>
            <div className="beep-notification-content">
              <h3 className="beep-notification-title">Notification Alert</h3>
              <p className="beep-notification-message">{popupMessage}</p>
              {unreadCount > 0 && (
                <p className="beep-notification-count">
                  You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              className="beep-notification-close"
              onClick={handleDismissPopup}
              aria-label="Close notification"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="beep-notification-actions">
            {popupMessage.includes("Haven't you checked") ? (
              <button
                className="beep-notification-btn beep-notification-btn-primary"
                onClick={handleDismissPopup}
              >
                <FaCheck size={16} />
                Yes, I'll check
              </button>
            ) : (
              <button
                className="beep-notification-btn beep-notification-btn-secondary"
                onClick={handleDismissPopup}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BeepNotification;