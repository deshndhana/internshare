import { departmentColors } from '../data';

const ReviewCard = ({ review, isActive, onClick, onLike, currentUserId }) => {
  const hasLiked = review.likes && currentUserId && review.likes.includes(currentUserId);
  const likesCount = review.likes ? review.likes.length : 0;
  
  const dept = String(review.department || 'Any Department');
  const deptShort = dept.replace("Department of ", "").replace(" Technology", " Tech");
  const badgeStyle = {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
    backgroundColor: departmentColors[dept]?.bg || '#f3f4f6',
    color: departmentColors[dept]?.text || 'var(--text-secondary)',
    marginBottom: '0.25rem'
  };

  return (
    <div className={`review-card fade-in ${isActive ? 'active' : ''}`} onClick={() => onClick(review)}>
      <div className="card-top">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="card-company-logo">
            {String(review.companyName || 'I').charAt(0).toUpperCase()}
          </div>
          <div className="card-title-group">
            <span style={badgeStyle}>{deptShort}</span>
            <h3>{String(review.companyName || 'Unknown Company')}</h3>
            <p>📍 {String(review.location || 'On-site')}</p>
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
