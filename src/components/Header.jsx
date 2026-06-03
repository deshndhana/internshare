import React from 'react';

const Header = ({ onViewChange, currentView }) => {
  return (
    <header className="header fade-in">
      <div className="logo">
        <h1>InternShare</h1>
        <p>Internship Experience Sharing</p>
      </div>
      <nav>
        {currentView === 'home' ? (
          <button 
            className="nav-button" 
            onClick={() => onViewChange('add')}
          >
            + Add Experience
          </button>
        ) : (
          <button 
            className="nav-button secondary" 
            onClick={() => onViewChange('home')}
          >
            Back to Home
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
