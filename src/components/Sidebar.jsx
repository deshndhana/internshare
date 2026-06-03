

const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <div className="sidebar">
      <div 
        className="sidebar-logo" 
        onDoubleClick={() => {
          const pwd = window.prompt("Enter Admin Password:");
          if (pwd === "Admin@2026") {
            onViewChange('admin');
          } else if (pwd !== null) {
            alert("Incorrect Password!");
          }
        }}
        title="Double click for Admin"
      >
        IS
      </div>
      
      <button 
        className={`sidebar-icon ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => onViewChange('home')}
        title="Find Job"
      >
        💼
      </button>

      <button 
        className={`sidebar-icon ${currentView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onViewChange('dashboard')}
        title="Dashboard Analytics"
      >
        📊
      </button>
      
      <button 
        className="sidebar-icon"
        title="Search"
      >
        🔍
      </button>

      <button 
        className={`sidebar-icon ${currentView === 'add' ? 'active' : ''}`}
        onClick={() => onViewChange('add')}
        title="Add Experience"
      >
        ➕
      </button>
    </div>
  );
};

export default Sidebar;
