import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const bptCompanies = [
  "Godakanda Herbal Pvt Ltd",
  "Sustainable Agriculture Research and Development Centre",
  "Plant Genetic Resources Center",
  "Department of Export Agriculture",
  "Agricultural Biotechnology Center",
  "National Water Supply & Drainage Board",
  "Central Environmental Authority",
  "Chello Dairy Products (Pvt) Ltd",
  "CIC Seed Farm",
  "ACE Health Care (Pvt) LTD",
  "Department of Government Analyst",
  "Ruwansiri Dairies (pvt) Ltd",
  "Cellogen",
  "Avon phamo chem Pvt (Ltd)",
  "CIC Fertilizer",
  "District General Hospital",
  "Sands Active (pvt) Ltd",
  "Cargills Quality Foods",
  "National Institute of Fundamental Studies",
  "Navesta Pharmaceuticals (Pvt) Ltd",
  "Gene Tech",
  "Milco Pvt LTD",
  "CIC holdings",
  "Hemas hospital",
  "Fonterra Brands Lanka",
  "Gene Lab",
  "Wayamba Diagnostic Medical Laboratory",
  "General hospital",
  "Healthy Foods Lanka Exports (Pvt)",
  "Teaching Hospital"
];

const AdminPanel = ({ reviews, onDelete, onBack }) => {
  const handleImportBPT = async () => {
    if (!window.confirm("Are you sure you want to import all BPT companies? This will add " + bptCompanies.length + " posts.")) return;
    
    try {
      const reviewsCollectionRef = collection(db, 'reviews');
      for (const company of bptCompanies) {
        await addDoc(reviewsCollectionRef, {
          companyName: company,
          department: "Department of Bioprocess Technology",
          location: "",
          reviewerName: "",
          contactNumber: "",
          experience: "",
          website: "",
          image: null,
          isAnonymous: true,
          date: new Date().toLocaleDateString(),
          creatorId: "admin-import",
          createdAt: serverTimestamp()
        });
      }
      alert("Successfully imported all companies!");
    } catch (err) {
      console.error(err);
      alert("Error importing companies.");
    }
  };

  return (
    <div className="admin-panel fade-in" style={{ padding: '2rem', background: 'white', borderRadius: '12px', margin: '2rem', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleImportBPT}>Import BPT Companies</button>
          <button className="btn-secondary" onClick={onBack}>Exit Admin</button>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage all internship reviews from here.</p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Company</th>
              <th style={{ padding: '1rem' }}>Department</th>
              <th style={{ padding: '1rem' }}>Reviewer</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{review.id.substring(0, 6)}...</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{String(review.companyName || 'Unknown')}</td>
                <td style={{ padding: '1rem' }}>{String(review.department || 'Unknown')}</td>
                <td style={{ padding: '1rem' }}>{review.isAnonymous ? '🕵️ Anonymous' : String(review.reviewerName || 'N/A')}</td>
                <td style={{ padding: '1rem' }}>{review.date}</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ borderColor: '#dc2626', color: '#dc2626', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
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
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
