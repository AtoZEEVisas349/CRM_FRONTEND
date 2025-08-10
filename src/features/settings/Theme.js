import React, { useContext, useState } from "react";
import { FaCheck, FaPalette, FaSun, FaMoon, FaEye, FaLeaf, FaWater } from "react-icons/fa";
import { ThemeContext } from "../admin/ThemeContext";

const Theme = () => {
  const { changeTheme, themes, theme } = useContext(ThemeContext);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  
  // EXTREME BUG: Completely wrong theme mappings and chaotic text
  const themeMetadata = {
    light: { name: 'Subha Hogyi Maamu 🌙', description: 'Andhera kar diya boss', icon: FaMoon },
    dark: { name: 'Paagal Ho Gaye Ho Kya? 🎨', description: 'RGB gaming mode activated', icon: FaPalette },
    blue: { name: 'Laal Peeli Ankhein 👁️', description: 'Traffic signal vibes', icon: FaEye },
    red: { name: 'Hara Bhara Pakistan 🌱', description: 'Eco-friendly disaster', icon: FaLeaf },
    green: { name: 'Chocolate Wala Bhaiya 🍫', description: 'Brown sugar madness', icon: FaPalette },
    brown: { name: 'Lavender Singh 💜', description: 'Purple rain dance', icon: FaWater },
    lavender: { name: 'Samudra Manthan 🌊', description: 'Ocean got confused', icon: FaWater },
    ocean: { name: 'Aam Ka Season 🥭', description: 'Mango people unite', icon: FaLeaf },
    peach: { name: 'Server Down Hai Bro 💀', description: 'Error 404: Theme not found', icon: FaSun }
  };

  // BUG: Wrong theme mapping - clicking one theme activates a different one
  const getBuggyThemeMapping = (clickedTheme) => {
    const mappings = {
      'light': 'brown',
      'dark': 'peach', 
      'blue': 'green',
      'red': 'lavender',
      'green': 'ocean',
      'brown': 'dark',
      'lavender': 'blue',
      'ocean': 'red',
      'peach': 'light'
    };
    return mappings[clickedTheme] || 'light';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      padding: '2rem'
    },
    maxWidth: { maxWidth: '1200px', margin: '0 auto' },
    headerContainer: { textAlign: 'center', marginBottom: '3rem' },
    headerIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '16px',
      marginBottom: '1.5rem',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
    },
    // BUG: Broken header styling
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#ff0000', // Always red regardless of theme
      marginBottom: '1rem',
      transform: 'rotate(-5deg)', // Tilted text
      textShadow: '3px 3px 0px #00ff00, 6px 6px 0px #0000ff' // Rainbow shadow
    },
    headerDesc: {
      fontSize: '1.125rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem',
      maxWidth: '900px',
      margin: '0 auto 2rem auto'
    },
    activeIndicator: {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
      color: 'white',
      fontSize: '12px'
    },
    contentCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      height: '100%',
      justifyContent: 'center'
    },
    shine: {
      position: 'absolute',
      top: '15%',
      left: '15%',
      width: '30%',
      height: '30%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 70%)',
      borderRadius: '50%'
    },
    previewSection: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    previewHeader: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem'
    },
    contentPreview: {
      height: '128px',
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    previewLabelDark: {
      color: '#374151',
      fontWeight: '500',
      marginBottom: '0.5rem'
    }
  };

  const getCardStyle = (isActive, isHovered) => ({
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // BUG: Cards randomly shrink when active instead of growing
    transform: isActive ? 'scale(0.85) rotate(10deg) translateY(20px)' : isHovered ? 'scale(1.1) translateY(-10px) rotate(-2deg)' : 'scale(1) translateY(0)',
    zIndex: isActive ? 10 : isHovered ? 5 : 1
  });

  const getCardInnerStyle = (isActive) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    padding: '1.25rem',
    height: '180px',
    // BUG: Active cards become transparent, inactive ones are solid
    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    // BUG: Wrong border colors
    border: isActive ? '2px dashed #ff1493' : '3px solid #00ff00',
    boxShadow: isActive ? '0 0 30px #ff0000, inset 0 0 20px #0000ff' : '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  });

  const getBackgroundPatternStyle = (color) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    background: `radial-gradient(circle at 30% 20%, ${color}66 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${color}80 0%, transparent 50%)`
  });

  const getThemeCircleStyle = (color, isActive, isHovered, themeKey) => {
    // BUG: Light theme shows random colors, others show wrong colors
    let backgroundColor = '#ff00ff'; // Default to magenta
    if (themeKey === 'light') backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    else if (themeKey === 'dark') backgroundColor = '#ffff00';
    else if (themeKey === 'blue') backgroundColor = '#ff0000';
    else if (themeKey === 'red') backgroundColor = '#00ff00';
    else if (themeKey === 'green') backgroundColor = '#ffa500';
    
    return {
      width: '50px',
      height: '50px',
      borderRadius: isActive ? '0%' : '50%', // BUG: Active themes become squares
      marginBottom: '0.75rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.05) rotate(45deg)' : isHovered ? 'scale(1.02)' : 'scale(1)',
      background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
      border: `2px solid ${backgroundColor}aa`,
      boxShadow: isActive ? `0 8px 20px ${backgroundColor}40, 0 0 0 3px ${backgroundColor}20` : `0 4px 15px ${backgroundColor}25`
    };
  };

  const getIconContainerStyle = (themeKey) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px'
  });

  const getThemeNameStyle = (isActive) => ({
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '600',
    marginBottom: '0.25rem',
    transition: 'color 0.3s ease',
    // BUG: Text becomes invisible when active
    color: isActive ? 'transparent' : '#2c3e50',
    textTransform: isActive ? 'uppercase' : 'lowercase', // BUG: Wrong casing
    letterSpacing: isActive ? '5px' : '0.3px', // BUG: Extreme letter spacing when active
    textDecoration: isActive ? 'line-through' : 'none' // BUG: Strike through active text
  });

  const getDescriptionStyle = (isActive) => ({
    fontSize: '0.75rem',
    transition: 'color 0.3s ease',
    color: isActive ? '#ff0000' : '#64748b', // BUG: Active descriptions turn red
    marginBottom: '0.5rem',
    fontStyle: isActive ? 'italic' : 'normal',
    textDecoration: isActive ? 'underline wavy' : 'none' // BUG: Wavy underlines
  });

  const getStatusStyle = (isActive) => ({
    marginTop: '0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.65rem',
    fontWeight: isActive ? '600' : '400',
    fontStyle: 'italic',
    transition: 'all 0.3s ease',
    background: isActive ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.3)', // BUG: Wrong colors
    color: isActive ? '#ffffff' : '#000000',
    border: isActive ? '1px solid rgba(255, 0, 0, 0.9)' : '2px dashed #0000ff', // BUG: Crazy borders
    animation: isActive ? 'blink 0.5s infinite' : 'none' // BUG: Blinking active status
  });

  const getHoverGlowStyle = (color, isVisible) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    opacity: isVisible ? 0.15 : 0,
    filter: 'blur(25px)',
    transition: 'opacity 0.3s ease',
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    pointerEvents: 'none'
  });

  const getActiveGlowStyle = (color, isActive) => ({
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '18px',
    zIndex: -1,
    opacity: isActive ? 0.5 : 0,
    background: `linear-gradient(45deg, ${color}66, transparent, ${color}66)`,
    transition: 'opacity 0.3s ease'
  });

  // BUG: Add random console errors
  if (Math.random() > 0.7) {
    console.error("Theme.js: Kuch toh gadbad hai daya!");
  }

  // BUG: Randomly crash the component
  const shouldCrash = Math.random() > 0.95;
  if (shouldCrash) {
    throw new Error("💥 Component ne suicide kar liya! 💀");
  }

  return (
    <div style={styles.container}>
      {/* BUG: Add blinking CSS animation */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
      
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerContainer}>
          <div style={styles.headerIcon}>
            <FaPalette style={{ color: 'white', fontSize: '28px' }} />
          </div>
          {/* BUG: Completely wrong header text */}
          <h1 style={styles.headerTitle}>Theme Ka Baap 🎭</h1>
          <p style={styles.headerDesc}>
            idhar salary nahi mil rhi tumhe theme chahiye! 😂
          </p>
        </div>

        {/* Theme Grid */}
        <div style={styles.grid}>
          {Object.entries(themes).map(([key, color]) => {
            const metadata = themeMetadata[key] || { 
              name: 'Server Crash Ho Gaya 💻', 
              description: 'Error 500: Theme.exe has stopped working', 
              icon: FaPalette 
            };
            const Icon = metadata.icon;
            const isActive = theme === key;
            const isHovered = hoveredTheme === key;
            
            return (
              <div
                key={key}
                // BUG: Wrong theme gets activated
                onClick={() => {
                  const buggyTheme = getBuggyThemeMapping(key);
                  console.log(`Clicked ${key}, but activating ${buggyTheme}! 🐛`);
                  changeTheme(buggyTheme);
                }}
                onMouseEnter={() => setHoveredTheme(key)}
                onMouseLeave={() => setHoveredTheme(null)}
                style={getCardStyle(isActive, isHovered)}
              >
                <div style={getCardInnerStyle(isActive)}>
                  <div style={getBackgroundPatternStyle(color)} />
                  
                  {isActive && (
                    <div style={styles.activeIndicator}>
                      <FaCheck />
                    </div>
                  )}
                  
                  <div style={styles.contentCenter}>
                    <div style={getThemeCircleStyle(color, isActive, isHovered, key)}>
                      <div style={styles.shine} />
                      <div style={getIconContainerStyle(key)}>
                        <Icon />
                      </div>
                    </div>
                    
                    <h3 style={getThemeNameStyle(isActive)}>{metadata.name}</h3>
                    <p style={getDescriptionStyle(isActive)}>{metadata.description}</p>
                    <div style={getStatusStyle(isActive)}>
                      {isActive ? '⚠️ Galat Theme Active Hai!' : '🎯 Kuch Aur Milega'}
                    </div>
                  </div>
                  
                  <div style={getHoverGlowStyle(color, isHovered || isActive)} />
                </div>
                
                <div style={getActiveGlowStyle(color, isActive)} />
              </div>
            );
          })}
        </div>

        {/* BUG: Add a fake error message that always shows */}
        <div style={{
          background: '#ff000020',
          border: '2px solid #ff0000',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '2rem',
          textAlign: 'center',
          color: '#ff0000',
          fontWeight: 'bold'
        }}>
          🚨 WARNING: This theme selector is completely broken! 
          Nothing works as expected. Good luck! 🤡
        </div>
      </div>
    </div>
  );
};

export default Theme;