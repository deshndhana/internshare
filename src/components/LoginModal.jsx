import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Mock "Device Accounts" to simulate Google Sign-in experience
  const deviceAccounts = [
    { name: 'Dhananjaya Deshapriya', email: 'dhananjaya.n.deshapriya@gmail.com', avatar: 'D' },
    { name: 'Student Account', email: 'student.it@campus.ac.lk', avatar: 'S' }
  ];

  const handleAccountSelect = (selectedEmail) => {
    onLogin(selectedEmail);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onLogin(email);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px', padding: '2rem', borderRadius: '12px' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Choose an account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            to continue to <strong>InternSearch</strong>
          </p>
        </div>

        {!showManualInput ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {deviceAccounts.map((acc, index) => (
              <div 
                key={index}
                onClick={() => handleAccountSelect(acc.email)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ 
                  width: '40px', height: '40px', 
                  borderRadius: '50%', backgroundColor: 'var(--primary-color)', 
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '1.2rem'
                }}>
                  {acc.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{acc.email}</div>
                </div>
              </div>
            ))}
            
            <div 
              onClick={() => setShowManualInput(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem', 
                border: '1px solid transparent', 
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                width: '40px', height: '40px', 
                borderRadius: '50%', backgroundColor: '#e5e7eb', 
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem'
              }}>
                👤
              </div>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                Use another account
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="form-group fade-in">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setShowManualInput(false)}
              >
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
