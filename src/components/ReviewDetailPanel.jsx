import React from 'react';

const ReviewDetailPanel = ({ review, currentUserId, isAdmin, onDelete, onEdit }) => {
  if (!review) {
    return (
      <div className="detail-pane empty-detail">
        <p>Select a job or experience to see details here</p>
      </div>
    );
  }

  const isOwner = currentUserId === review.creatorId;
  const canModify = isOwner || isAdmin;

  return (
    <div className="detail-pane fade-in">
      <div className="detail-header">
        <h2>{review.companyName} - {review.department}</h2>
        <div className="detail-meta">
          📍 {review.location} &nbsp;|&nbsp; 📅 {review.date} &nbsp;|&nbsp; 
          👤 {review.isAnonymous ? 'Anonymous' : review.reviewerName}
        </div>

        <div className="detail-actions">
          {review.website && (
            <a href={review.website} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>
              Visit Website ↗
            </a>
          )}
          {canModify && (
            <>
              <button className="btn-secondary" onClick={() => onEdit(review)}>
                Edit Post
              </button>
              <button className="btn-secondary" style={{ borderColor: '#dc2626', color: '#dc2626' }} onClick={() => onDelete(review.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-body">
        {review.image && (
          <img src={review.image} alt="Internship" className="detail-image" />
        )}
        <h3>About the experience</h3>
        <p>{review.experience}</p>
      </div>
    </div>
  );
};

export default ReviewDetailPanel;
