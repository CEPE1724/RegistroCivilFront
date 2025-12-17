import React from 'react';
import './SessionExpiredModal.css';

const SessionExpiredModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="session-modal-overlay">
      <div className="session-modal-container">
        <div className="session-modal-header">
          <div className="session-modal-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </div>
          <h2>Sesión Cerrada</h2>
        </div>
        
        <div className="session-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="session-modal-footer">
          <button 
            onClick={onClose}
            className="session-modal-button"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
