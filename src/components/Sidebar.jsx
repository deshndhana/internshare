import React from 'react';

const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <div className="sidebar">
      <div 
        className="sidebar-logo" 
        onDoubleClick={() => onViewChange('admin')}
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
