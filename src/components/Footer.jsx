import React from 'react';

const Footer = ({ onAdminClick }) => {
  return (
    <footer className="footer fade-in">
      <div>
        <p>&copy; {new Date().getFullYear()} InternShare. Built for students.</p>
        <button onClick={onAdminClick} className="admin-login-btn mt-2">
          Admin Portal
        </button>
      </div>
      
      <div className="footer-links">
        <span>Contact Developer:</span>
        <a 
          href="https://www.linkedin.com/in/dhananhaya-n-deshapriya" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <span>|</span>
        <a 
          href="https://auraailabs.netlify.app/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Aura AI Labs
        </a>
      </div>
    </footer>
  );
};

export default Footer;
