import { useState } from 'react';

const AdminPanel = ({ reviews, onDelete, onBack }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="form-container fade-in" style={{ marginTop: '4rem' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="nav-button secondary" onClick={onBack}>Cancel</button>
            <button type="submit" className="nav-button">Login</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button className="nav-button secondary" onClick={onBack}>Exit Admin</button>
      </div>
      
      <p>Manage all internship reviews from here.</p>
      
      <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Department</th>
              <th>Reviewer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.companyName}</td>
                <td>{review.department}</td>
                <td>{review.isAnonymous ? 'Anonymous' : review.reviewerName}</td>
                <td>{review.date}</td>
                <td>
                  <button 
                    className="nav-button danger btn-small" 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this post?')) {
                        onDelete(review.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
