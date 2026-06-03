import React, { useState, useEffect } from 'react';
import { departments } from '../data';

const AddReviewForm = ({ onAddReview, initialData = null, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    reviewerName: '',
    contactNumber: '',
    isAnonymous: false,
    department: departments[0],
    companyName: '',
    website: '',
    location: '',
    experience: '',
    image: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submittedData = {
      ...formData,
      id: initialData ? initialData.id : Date.now(),
      date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
      reviewerName: formData.isAnonymous ? '' : formData.reviewerName,
      contactNumber: formData.isAnonymous ? '' : formData.contactNumber,
      // If editing, preserve creatorId. If new, App.jsx handles creatorId injection.
    };

    onAddReview(submittedData);
  };

  return (
    <div className="form-container fade-in">
      <h2>{initialData ? 'Edit Experience' : 'Add Internship Experience'}</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="isAnonymous" 
            name="isAnonymous" 
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
          <label htmlFor="isAnonymous" style={{margin: 0}}>Post Anonymously</label>
        </div>

        {!formData.isAnonymous && (
          <>
            <div className="form-group">
              <label htmlFor="reviewerName">Your Name</label>
              <input 
                type="text" 
                id="reviewerName" 
                name="reviewerName" 
                value={formData.reviewerName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number (Optional)</label>
              <input 
                type="tel" 
                id="contactNumber" 
                name="contactNumber" 
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select 
            id="department" 
            name="department" 
            value={formData.department}
            onChange={handleChange}
            required
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input 
            type="text" 
            id="companyName" 
            name="companyName" 
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Tech Solutions Ltd"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Company Website (Optional)</label>
          <input 
            type="url" 
            id="website" 
            name="website" 
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Colombo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience & Review</label>
          <textarea 
            id="experience" 
            name="experience" 
            value={formData.experience}
            onChange={handleChange}
            placeholder="Write about your experience here..."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image (Optional)</label>
          <input 
            type="file" 
            id="image" 
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.image && (
            <img src={formData.image} alt="Preview" className="image-preview" />
          )}
        </div>

        <div className="form-actions">
          {initialData && (
            <button type="button" className="nav-button secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
          <button type="submit" className="nav-button">
            {initialData ? 'Save Changes' : 'Submit Review'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddReviewForm;
