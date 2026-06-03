import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ReviewCard from './components/ReviewCard';
import AddReviewForm from './components/AddReviewForm';
import ReviewDetailPanel from './components/ReviewDetailPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import { departments } from './data';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import './App.css';

// Basic XSS Sanitizer Function for Security
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'&]/g, function (match) {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      case '&': return '&amp;';
      default: return match;
    }
  });
};

function App() {
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'add', 'admin', 'edit', 'dashboard'
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const reviewsCollectionRef = collection(db, 'reviews');

  // Load Data from Firebase
  useEffect(() => {
    const savedEmail = localStorage.getItem('internshare_user_email');
    if (savedEmail) {
      setLoggedInEmail(savedEmail);
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const q = query(reviewsCollectionRef, orderBy('createdAt', 'desc'));
        const data = await getDocs(q);
        const fetchedReviews = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setReviews(fetchedReviews);
        if (fetchedReviews.length > 0) setSelectedReview(fetchedReviews[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleLogin = (email) => {
    const safeEmail = sanitizeInput(email);
    setLoggedInEmail(safeEmail);
    localStorage.setItem('internshare_user_email', safeEmail);
    setIsLoginModalOpen(false);
    
    if (currentView !== 'add') {
      setCurrentView('add');
    }
  };

  const handleShareExperienceClick = (e) => {
    if (e) e.preventDefault();
    if (loggedInEmail) {
      setCurrentView('add');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAddOrUpdateReview = async (reviewData) => {
    // Sanitize all inputs before sending to Firebase
    const sanitizedData = {
      companyName: sanitizeInput(reviewData.companyName),
      department: sanitizeInput(reviewData.department),
      location: sanitizeInput(reviewData.location),
      reviewerName: sanitizeInput(reviewData.reviewerName),
      contactNumber: sanitizeInput(reviewData.contactNumber),
      experience: sanitizeInput(reviewData.experience),
      website: sanitizeInput(reviewData.website),
      image: reviewData.image, // assume URL
      isAnonymous: reviewData.isAnonymous,
      date: reviewData.date
    };

    try {
      if (currentView === 'edit') {
        const reviewDoc = doc(db, "reviews", reviewData.id);
        await updateDoc(reviewDoc, sanitizedData);
        const updatedReviews = reviews.map(r => r.id === reviewData.id ? { ...r, ...sanitizedData } : r);
        setReviews(updatedReviews);
        setSelectedReview({ ...reviewData, ...sanitizedData });
      } else {
        const newDoc = { 
          ...sanitizedData, 
          creatorId: loggedInEmail,
          createdAt: serverTimestamp() 
        };
        const docRef = await addDoc(reviewsCollectionRef, newDoc);
        const addedReview = { ...newDoc, id: docRef.id };
        setReviews([addedReview, ...reviews]);
        setSelectedReview(addedReview);
      }
      
      setCurrentView('home');
      setReviewToEdit(null);
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save data. Please check your connection.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this experience?");
    if (!confirmDelete) return;

    try {
      const reviewDoc = doc(db, "reviews", id);
      await deleteDoc(reviewDoc);
      const updatedReviews = reviews.filter(r => r.id !== id);
      setReviews(updatedReviews);
      if (selectedReview?.id === id) {
        setSelectedReview(updatedReviews.length > 0 ? updatedReviews[0] : null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditRequest = (review) => {
    setReviewToEdit(review);
    setCurrentView('edit');
  };

  const uniqueCompanies = Array.from(new Set(reviews.map(r => r.companyName))).sort();

  const filteredReviews = reviews.filter(review => {
    const matchesDept = selectedDepartment === 'all' || review.department === selectedDepartment;
    const matchesComp = selectedCompanyFilter === 'all' || review.companyName === selectedCompanyFilter;
    const matchesSearch = review.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          review.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesComp && matchesSearch;
  });

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(v) => {
          if (v === 'add') {
            handleShareExperienceClick();
          } else {
            setCurrentView(v);
          }
        }} 
      />

      <div className="workspace">
        {(currentView === 'home' || currentView === 'dashboard') && (
          <div className="hero-header fade-in">
            <div className="top-nav">
              <div className="top-nav-brand">
                <div style={{width: 24, height: 24, backgroundColor: 'white', borderRadius: '50%'}}></div>
                InternSearch
              </div>
              <div className="top-nav-links">
                <a href="#" className={currentView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>Find Experiences</a>
                <a href="#" className={currentView === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}>Dashboard</a>
                <a href="#" onClick={handleShareExperienceClick}>Share Your Experience</a>
                <a href="https://auraailabs.netlify.app/" target="_blank" rel="noopener noreferrer">Aura AI</a>
                <a href="https://www.linkedin.com/in/dhananhaya-n-deshapriya" target="_blank" rel="noopener noreferrer">Contact Developers</a>
              </div>
              <div className="top-nav-actions">
                <button className="sidebar-icon" style={{color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>🔔</button>
                {loggedInEmail ? (
                  <div style={{width: 36, height: 36, backgroundColor: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e293b'}} title={loggedInEmail}>
                    {loggedInEmail.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <button className="btn-secondary" style={{color: 'white', borderColor: 'white', padding: '0.5rem 1rem'}} onClick={() => setIsLoginModalOpen(true)}>
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <div className="hero-content">
              <h2>Let’s find your dream internship</h2>
              <p>Discover the best experiences from students at top companies across all departments.</p>
            </div>
          </div>
        )}

        {currentView === 'home' && (
          <>
            <div className="search-container fade-in">
              <div className="search-box">
                <div className="search-input-group">
                  <span style={{color: 'var(--text-tertiary)'}}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Company or keyword" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="search-divider"></div>
                <div className="search-input-group">
                  <span style={{color: 'var(--text-tertiary)'}}>📍</span>
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">Any Department</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary">Search</button>
              </div>

              <div className="filter-pills">
                <div className="filter-pill">
                  <select value={selectedCompanyFilter} onChange={(e) => setSelectedCompanyFilter(e.target.value)}>
                    <option value="all">All Companies</option>
                    {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="filter-pill">Internship types ⌄</div>
              </div>
            </div>

            <div className="main-content fade-in">
              <div className="list-pane">
                <div className="list-header">
                  <span>Recommended experiences</span>
                  <span>Sort by: <strong>Last updated</strong></span>
                </div>
                
                {loading ? (
                  <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)'}}>
                    Loading experiences from Firebase...
                  </div>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map(review => (
                    <ReviewCard 
                      key={review.id} 
                      review={review} 
                      isActive={selectedReview?.id === review.id}
                      onClick={setSelectedReview}
                    />
                  ))
                ) : (
                  <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)'}}>
                    No experiences match your search.
                  </div>
                )}
              </div>

              <div className={`detail-pane-wrapper ${selectedReview ? 'mobile-active' : ''}`}>
                <ReviewDetailPanel
                  review={selectedReview}
                  currentUserId={loggedInEmail}
                  isAdmin={false}
                  onClose={() => setSelectedReview(null)}
                  onDelete={handleDelete}
                  onEdit={handleEditRequest}
                />
              </div>
            </div>
          </>
        )}

        {currentView === 'dashboard' && (
          <div className="fade-in">
             <Dashboard reviews={reviews} />
          </div>
        )}

        {(currentView === 'add' || currentView === 'edit') && (
          <AddReviewForm 
            onAddReview={handleAddOrUpdateReview} 
            initialData={reviewToEdit}
            onCancelEdit={() => {
              setCurrentView('home');
              setReviewToEdit(null);
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel 
            reviews={reviews} 
            onDelete={handleDelete}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView !== 'admin' && (
          <footer className="app-footer">
            <p>Project by Dhananjaya | Contact Developers: <a href="https://auraailabs.netlify.app/" target="_blank" rel="noopener noreferrer">Aura AI Labs</a></p>
            <p>© {new Date().getFullYear()} InternSearch. All rights reserved.</p>
          </footer>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
