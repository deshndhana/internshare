import { useState, useEffect } from 'react';
import { departments } from '../data';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddReviewForm = ({ onAddReview, initialData = null, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialData || {
    reviewerName: '', contactNumber: '', isAnonymous: false,
    department: departments[0], companyName: '', website: '',
    location: '', experience: '', image: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || null);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFormData(initialData);
      setPreviewUrl(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Quick local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    
    // Upload to Firebase Storage
    setIsUploading(true);
    setUploadError('');
    try {
      const storageRef = ref(storage, `intern_images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError('Failed to upload image. Please try again.');
      setPreviewUrl(null); // revert on fail
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) return; // Prevent submit while uploading
    
    const submittedData = {
      ...formData,
      id: initialData ? initialData.id : Date.now(),
      date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
      reviewerName: formData.isAnonymous ? '' : formData.reviewerName,
      contactNumber: formData.isAnonymous ? '' : formData.contactNumber,
    };
    onAddReview(submittedData);
  };

  return (
    <div className="form-container fade-in">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        {initialData ? 'Edit Experience' : 'Share Internship Experience'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(13, 110, 253, 0.05)', borderRadius: '8px', border: '1px solid rgba(13, 110, 253, 0.1)' }}>
          <input type="checkbox" id="isAnonymous" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} style={{ width: 'auto', margin: 0 }} />
          <label htmlFor="isAnonymous" style={{ margin: 0, fontWeight: 500, color: 'var(--primary-color)' }}>Post Anonymously (Hide my name)</label>
        </div>

        {!formData.isAnonymous && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="reviewerName">Your Name</label>
              <input type="text" id="reviewerName" name="reviewerName" value={formData.reviewerName} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number (Optional)</label>
              <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="07X XXX XXXX" />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Tech Solutions" required />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
              {departments.map((dept, index) => <option key={index} value={dept}>{dept}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Colombo (Remote)" required />
          </div>
          <div className="form-group">
            <label htmlFor="website">Company Website (Optional)</label>
            <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience & Review</label>
          <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="What did you learn? How was the culture?" required style={{ minHeight: '120px' }}></textarea>
        </div>

        <div className="form-group">
          <label>Add a Photo (Optional)</label>
          <div style={{ 
            border: '2px dashed var(--border-color)', 
            borderRadius: '12px', 
            padding: '2rem', 
            textAlign: 'center', 
            background: '#fafafa',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            {previewUrl ? (
              <div style={{ position: 'relative' }}>
                <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }} />
                {isUploading && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary-color)' }}>Uploading...</div>}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📸</div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>Click or drag a photo to upload</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Max size 5MB</p>
              </div>
            )}
          </div>
          {uploadError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{uploadError}</p>}
        </div>

        <div className="form-actions">
          {initialData && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit}>Cancel</button>
          )}
          <button type="submit" className="btn-primary" disabled={isUploading}>
            {isUploading ? 'Uploading...' : (initialData ? 'Save Changes' : 'Submit Review')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddReviewForm;
