import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const bptCompaniesData = [
  { name: "Godakanda Herbal Pvt Ltd", location: "Wewaldeniya" },
  { name: "Sustainable Agriculture Research and Development Centre", location: "Makandura" },
  { name: "Plant Genetic Resources Center", location: "Gannoruwa" },
  { name: "Department of Export Agriculture", location: "Central Research Station, Matale" },
  { name: "Agricultural Biotechnology Center", location: "328, Upper Gampola Rd" },
  { name: "National Water Supply & Drainage Board", location: "Anuradhapura" },
  { name: "Central Environmental Authority", location: "Battaramulla" },
  { name: "Water Board", location: "Bandarawela" },
  { name: "Chello Dairy Products (Pvt) Ltd", location: "On-site" },
  { name: "CIC Seed Farm", location: "Pelwehera, Dambulla" },
  { name: "ACE Health Care (Pvt) LTD", location: "On-site" },
  { name: "Department of Government Analyst", location: "Battaramulla" },
  { name: "Ruwansiri Dairies (pvt) Ltd", location: "Bandarawela Road, Valpathwela, Welimada" },
  { name: "Cellogen", location: "On-site" },
  { name: "Water Supply and Drainage Board", location: "Kegalle" },
  { name: "Avon phamo chem Pvt (Ltd)", location: "Gannoruwa -pgrc" },
  { name: "National Water Supply & Drainage Board (Western Production)", location: "Ambathale, Colombo" },
  { name: "CIC Fertilizer", location: "Kurunegala" },
  { name: "District General Hospital", location: "Kegalle" },
  { name: "Sands Active (pvt) Ltd", location: "On-site" },
  { name: "Cargills Quality Foods", location: "Matale" },
  { name: "National Institute of Fundamental Studies", location: "On-site" },
  { name: "Navesta Pharmaceuticals (Pvt) Ltd", location: "Horana" },
  { name: "Gene Tech", location: "On-site" },
  { name: "Milco Pvt LTD", location: "On-site" },
  { name: "CIC holdings", location: "81, 14 Ganegoda Banda Raja Mw, Peliyagoda" },
  { name: "Hemas hospital", location: "Waththala" },
  { name: "Fonterra Brands Lanka", location: "No: 100 New Kandy Rd, Kaduwela 11650" },
  { name: "Gene Lab", location: "Colombo" },
  { name: "Wayamba Diagnostic Medical Laboratory", location: "Kurunegala" },
  { name: "General hospital", location: "Ampara" },
  { name: "Healthy Foods Lanka Exports (Pvt)", location: "Anuradhapura" },
  { name: "Teaching Hospital", location: "Rathnapura" }
];

const AdminPanel = ({ reviews, onDelete, onBack }) => {
  const handleImportBPT = async () => {
    if (!window.confirm("Are you sure you want to import all BPT companies with their locations? This will add " + bptCompaniesData.length + " posts.")) return;
    
    try {
      const reviewsCollectionRef = collection(db, 'reviews');
      for (const item of bptCompaniesData) {
        await addDoc(reviewsCollectionRef, {
          companyName: item.name,
          department: "Department of Bioprocess Technology",
          location: item.location,
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
