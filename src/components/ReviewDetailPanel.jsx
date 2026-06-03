

const ReviewDetailPanel = ({ review, currentUserId, isAdmin, onDelete, onEdit, onClose }) => {
  if (!review) return null;

  const isOwner = currentUserId === review.creatorId;
  const canModify = isOwner || isAdmin;

  return (
    <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', margin: 'auto' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="detail-pane">
      <div className="detail-header">
        <h2>{String(review.companyName || 'Unknown')} - {String(review.department || 'Unknown')}</h2>
        <div className="detail-meta">
          📍 {String(review.location || 'Remote')} &nbsp;|&nbsp; 📅 {String(review.date || '')} &nbsp;|&nbsp; 
          👤 {review.isAnonymous ? 'Anonymous' : String(review.reviewerName || '')}
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
      </div>
    </div>
  );
};

export default ReviewDetailPanel;
