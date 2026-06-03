import React from 'react';

const ReviewCard = ({ review, isActive, onClick }) => {
  return (
    <div className={`review-card ${isActive ? 'active' : ''}`} onClick={() => onClick(review)}>
      <div className="card-top">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card-company-logo">
            {review.companyName.charAt(0).toUpperCase()}
          </div>
          <div className="card-title-group">
            <h3>{review.department}</h3>
            <p>{review.companyName}</p>
            <p style={{ marginTop: '0.25rem', color: '#1f2937', fontWeight: 500 }}>
              👤 {review.isAnonymous ? 'Anonymous' : review.reviewerName}
            </p>
          </div>
        </div>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          View Details
        </button>
      </div>
      
      <div className="card-meta">
        <span>📍 {review.location}</span>
        <span>📅 {review.date}</span>
      </div>

      <div className="tags-row">
        <span className="tag" style={{ background: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' }}>
          Full Time
        </span>
        {review.image && (
          <span className="tag" style={{ background: '#f3f4f6', color: '#4b5563' }}>
            Has Image
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
