import { useState, useEffect } from 'react';

const steps = [
  {
    id: 'tutorial-step-search',
    title: 'Find Companies',
    description: 'Search by company name or filter by department to find your dream internship.'
  },
  {
    id: 'tutorial-step-login',
    title: 'Sign In Securely',
    description: 'Click here to sign in with your Google account. It is fast and secure.'
  },
  {
    id: 'tutorial-step-profile',
    title: 'Manage Your Profile',
    description: 'Once logged in, click your avatar to view your shared experiences or log out.'
  },
  {
    id: 'tutorial-step-add',
    title: 'Share Experience',
    description: 'Click this button to share your own internship experience and help others.'
  },
  {
    id: 'tutorial-step-dashboard',
    title: 'Analytics Dashboard',
    description: 'View statistics and analysis of all the internships in the system.'
  }
];

const TutorialOverlay = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState(null);

  const updateRect = () => {
    const el = document.getElementById(steps[currentStep].id);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    // Add small delay to ensure elements are rendered
    const timeout = setTimeout(updateRect, 300);
    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timeout);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  if (!rect) return null;

  // Determine tooltip position
  const isMobile = window.innerWidth <= 768;
  const tooltipStyle = {
    top: isMobile ? '20%' : rect.bottom + 20 + 'px',
    left: isMobile ? '50%' : Math.max(10, rect.left) + 'px',
    transform: isMobile ? 'translateX(-50%)' : 'none'
  };

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="tutorial-overlay">
      <div 
        className="tutorial-cutout"
        style={{
          top: rect.top - 10,
          left: rect.left - 10,
          width: rect.width + 20,
          height: rect.height + 20
        }}
      ></div>
      
      <div className="tutorial-tooltip" style={tooltipStyle}>
        <h3>Step {currentStep + 1} of {steps.length}</h3>
        <h4 style={{marginBottom: '0.5rem'}}>{steps[currentStep].title}</h4>
        <p>{steps[currentStep].description}</p>
        <div className="tutorial-buttons">
          <span className="tutorial-skip" onClick={onComplete}>Skip Tutorial</span>
          <button className="tutorial-next" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
