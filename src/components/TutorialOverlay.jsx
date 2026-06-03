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
    // Check if step exists before accessing
    if (currentStep >= steps.length) return;
    
    const el = document.getElementById(steps[currentStep].id);
    if (el) {
      const r = el.getBoundingClientRect();
      // Only set rect if element is actually visible
      if (r.width > 0 && r.height > 0) {
        setRect(r);
      } else {
        // Fallback for hidden elements on mobile
        setRect({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, bottom: window.innerHeight / 2, right: window.innerWidth / 2 });
      }
    } else {
      // Element not found, use a fallback center dot so it doesn't crash
      setRect({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, bottom: window.innerHeight / 2, right: window.innerWidth / 2 });
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    // Add small delay to ensure elements are rendered
    const timeout = setTimeout(updateRect, 300);
    const timeout2 = setTimeout(updateRect, 1200); // Check again after Firebase load
    
    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timeout);
      clearTimeout(timeout2);
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

  // Determine tooltip position safely
  const isMobile = window.innerWidth <= 768;
  const tooltipStyle = {
    top: isMobile ? '20%' : (rect.bottom + 20) + 'px',
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
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 9998, pointerEvents: 'none' }}>
        <defs>
          <mask id="cutout-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect 
              className="tutorial-svg-cutout"
              x={rect.left - 10} 
              y={rect.top - 10} 
              width={rect.width + 20} 
              height={rect.height + 20} 
              rx="8" 
              fill="black" 
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(11, 76, 140, 0.9)" mask="url(#cutout-mask)" />
      </svg>

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
