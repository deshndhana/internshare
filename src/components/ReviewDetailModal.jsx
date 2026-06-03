import React from 'react';
import { departmentColors } from '../data';

const ReviewDetailModal = ({ review, onClose, currentUserId, isAdmin, onDelete, onEdit }) => {
  if (!review) return null;

  const isOwner = currentUserId === review.creatorId;
  const canModify = isOwner || isAdmin;
  
  const colors = departmentColors[review.department] || { bg: '#e0e7ff', text: '#3730a3' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {review.image && (
          <img src={review.image} alt="Internship" className="modal-image" />
        )}

        <div className="modal-body">
          <div 
            className="department-badge mb-4"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {review.department}
          </div>
          
          <div className="company-header" style={{ marginBottom: '1.5rem' }}>
            <div className="company-logo-placeholder">
              {review.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="company-info">
              <h2 style={{ margin: 0 }}>{review.companyName}</h2>
              <p className="location">📍 {review.location}</p>
              {review.website && (
                <a href={review.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  🔗 Visit Website
                </a>
              )}
            </div>
          </div>
          
          <div className="review-content" style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{review.experience}</p>
          </div>
          
          <div className="reviewer-info">
            <span>
              👤 {review.isAnonymous ? 'Anonymous' : review.reviewerName}
              {review.contactNumber && !review.isAnonymous && ` | 📞 ${review.contactNumber}`}
            </span>
            <span>📅 {review.date}</span>
          </div>

          {canModify && (
            <div className="modal-actions">
              <button className="nav-button secondary" onClick={() => onEdit(review)}>
                Edit Post
              </button>
              <button className="nav-button danger" onClick={() => onDelete(review.id)}>
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
