import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ReviewCard from './components/ReviewCard';
import AddReviewForm from './components/AddReviewForm';
import ReviewDetailPanel from './components/ReviewDetailPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import TutorialOverlay from './components/TutorialOverlay';
import Dashboard from './components/Dashboard';
import { departments } from './data';
import { db } from './firebase';
import { auth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, arrayRemove, arrayUnion } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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
  
  const [loggedInEmail, setLoggedInEmail] = useState(() => localStorage.getItem('internshare_user_email') || '');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem('internshare_tutorial_seen'));

  // Security Measures & Admin Secret Link
  useEffect(() => {
    // Check for secret admin link: ?admin=Str0ng@dmin!2026
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'Str0ng@dmin!2026') {
      setCurrentView('admin');
      // Clean up URL to hide it
      window.history.replaceState({}, document.title, "/");
    }

    // Disable Right Click
    const handleContextMenu = (e) => e.preventDefault();
    // Disable DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || 
         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
         (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const reviewsCollectionRef = collection(db, 'reviews');

  useEffect(() => {

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
  }, []); // reviewsCollectionRef is defined outside but uses db which is constant

  const handleLogin = (email) => {
    const safeEmail = sanitizeInput(email);
    setLoggedInEmail(safeEmail);
    localStorage.setItem('internshare_user_email', safeEmail);
    setIsLoginModalOpen(false);
    
    if (currentView !== 'add') {
      setCurrentView('add');
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setLoggedInEmail('');
      localStorage.removeItem('internshare_user_email');
      setShowProfileMenu(false);
      setCurrentView('home');
    }).catch(err => console.error(err));
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

  const handleLike = async (review) => {
    if (!loggedInEmail) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const reviewDoc = doc(db, "reviews", review.id);
      const hasLiked = review.likes && review.likes.includes(loggedInEmail);
      if (hasLiked) {
        await updateDoc(reviewDoc, { likes: arrayRemove(loggedInEmail) });
        setReviews(reviews.map(r => r.id === review.id ? { ...r, likes: r.likes.filter(email => email !== loggedInEmail) } : r));
        if (selectedReview?.id === review.id) {
          setSelectedReview(prev => ({ ...prev, likes: prev.likes.filter(email => email !== loggedInEmail) }));
        }
      } else {
        await updateDoc(reviewDoc, { likes: arrayUnion(loggedInEmail) });
        const updatedLikes = [...(review.likes || []), loggedInEmail];
        setReviews(reviews.map(r => r.id === review.id ? { ...r, likes: updatedLikes } : r));
        if (selectedReview?.id === review.id) {
          setSelectedReview(prev => ({ ...prev, likes: updatedLikes }));
        }
      }
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const uniqueCompanies = Array.from(new Set(reviews.map(r => r.companyName || 'Unknown Company'))).sort();

  const filteredReviews = reviews.filter(review => {
    if (currentView === 'myposts' && review.creatorId !== loggedInEmail) return false;
    
    const compName = review.companyName || 'Unknown Company';
    const deptName = review.department || 'Any Department';

    const matchesDept = selectedDepartment === 'all' || deptName === selectedDepartment;
    const matchesComp = selectedCompanyFilter === 'all' || compName === selectedCompanyFilter;
    const matchesSearch = compName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deptName.toLowerCase().includes(searchQuery.toLowerCase());
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
        {(currentView === 'home' || currentView === 'dashboard' || currentView === 'myposts') && (
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
                  <div style={{ position: 'relative' }} id="tutorial-step-profile">
                    <div 
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      style={{width: 36, height: 36, backgroundColor: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer'}} 
                      title={loggedInEmail}
                    >
                      {loggedInEmail.charAt(0).toUpperCase()}
                    </div>
                    {showProfileMenu && (
                      <div style={{ position: 'absolute', top: '45px', right: 0, background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', padding: '0.5rem', zIndex: 100, minWidth: '150px' }}>
                        <button onClick={() => { setCurrentView('myposts'); setShowProfileMenu(false); }} style={{ width: '100%', padding: '0.75rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-primary)' }}>My Experiences</button>
                        <button onClick={handleLogout} style={{ width: '100%', padding: '0.75rem', textAlign: 'left', fontWeight: 500, color: '#ef4444' }}>Log Out</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button id="tutorial-step-login" className="btn-secondary" style={{color: 'white', borderColor: 'white', padding: '0.5rem 1rem'}} onClick={() => setIsLoginModalOpen(true)}>
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <div className="hero-content">
              <h2>{currentView === 'myposts' ? 'Your Shared Experiences' : 'Let’s find your dream internship'}</h2>
              <p>{currentView === 'myposts' ? 'Manage your internship reviews and updates here.' : 'Discover the best experiences from students at top companies across all departments.'}</p>
            </div>
          </div>
        )}

        {(currentView === 'home' || currentView === 'myposts') && (
          <>
            <div className="search-container fade-in" id="tutorial-step-search">
              <div className="search-box">
                <div className="search-input-group">
                  <span style={{color: 'var(--text-tertiary)', fontSize: '1.2rem'}}>🔍</span>
                  <input type="text" placeholder="Company or keyword" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="search-divider"></div>
                <div className="search-input-group">
                  <span style={{color: '#ef4444', fontSize: '1.2rem'}}>📍</span>
                  <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="all">Any Department</option>
                    {departments.map((dept, index) => <option key={index} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <button className="btn-primary" style={{width: 'auto', padding: '0.75rem 2.5rem'}}>Search</button>
              </div>
              
              <div className="filter-pills">
                <div className="filter-pill">
                  <select value={selectedCompanyFilter} onChange={(e) => setSelectedCompanyFilter(e.target.value)}>
                    <option value="all">All Companies</option>
                    {uniqueCompanies.map((comp, index) => <option key={index} value={comp}>{comp}</option>)}
                  </select>
                </div>
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
                    {currentView === 'myposts' ? "You haven't shared any experiences yet." : "Loading experiences from Firebase..."}
                  </div>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map(review => (
                    <ReviewCard 
                      key={review.id} 
                      review={review} 
                      isActive={selectedReview?.id === review.id}
                      onClick={setSelectedReview}
                      onLike={handleLike}
                      currentUserId={loggedInEmail}
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
            <p>Project by <a href="https://auraailabs.netlify.app/" target="_blank" rel="noopener noreferrer">Aura AI Labs</a></p>
            <p>Contact Developer: <a href="https://www.linkedin.com/in/dhananhaya-n-deshapriya" target="_blank" rel="noopener noreferrer">Dhananjaya Deshapriya (LinkedIn)</a></p>
            <p style={{ marginTop: '0.5rem' }}>© {new Date().getFullYear()} InternSearch. All rights reserved.</p>
          </footer>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      {showTutorial && (
        <TutorialOverlay 
          onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem('internshare_tutorial_seen', 'true');
          }} 
        />
      )}
    </div>
  );
}

export default App;
