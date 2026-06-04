const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <div className="sidebar" id="sidebar-menu">
      <div className="sidebar-logo">
        IS
      </div>
      
      <button 
        className={`sidebar-icon ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => onViewChange('home')}
        title="Find Job"
      >
        <span className="icon-emoji">💼</span>
        <span className="icon-text">Home</span>
      </button>

      <button 
        className={`sidebar-icon ${currentView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onViewChange('dashboard')}
        title="Dashboard Analytics"
        id="tutorial-step-dashboard"
      >
        <span className="icon-emoji">📊</span>
        <span className="icon-text">Analysis</span>
      </button>
      


      <button 
        className="sidebar-icon"
        onClick={() => onViewChange('add')}
        title="Add Experience"
        id="tutorial-step-add"
      >
        <span className="icon-emoji">➕</span>
        <span className="icon-text">Add</span>
      </button>

    </div>
  );
};

export default Sidebar;
