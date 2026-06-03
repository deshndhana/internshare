const ReviewCard = ({ review, isActive, onClick, onLike, currentUserId }) => {
  const hasLiked = review.likes && currentUserId && review.likes.includes(currentUserId);
  const likesCount = review.likes ? review.likes.length : 0;

  return (
    <div className={`review-card fade-in ${isActive ? 'active' : ''}`} onClick={() => onClick(review)}>
      <div className="card-top">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="card-company-logo">
            {(review.companyName || 'I').charAt(0).toUpperCase()}
          </div>
          <div className="card-title-group">
            <h3>{review.companyName || 'Unknown Company'}</h3>
            <p>{review.department || 'Any Department'} • {review.location || 'Remote'}</p>
          </div>
        </div>
        {review.isAnonymous && <span style={{ fontSize: '1.2rem' }} title="Anonymous">🕵️</span>}
      </div>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {review.experience}
      </p>

      <div className="card-meta">
        <span>By {review.isAnonymous ? 'Anonymous Student' : review.reviewerName}</span>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div 
            onClick={(e) => { e.stopPropagation(); if(onLike) onLike(review); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: hasLiked ? '#ef4444' : 'var(--text-tertiary)', transition: 'color 0.2s' }}
          >
            <span style={{ fontSize: '1.1rem' }}>{hasLiked ? '❤️' : '🤍'}</span>
            <span style={{ fontWeight: 500 }}>{likesCount}</span>
          </div>
          <span>{review.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
