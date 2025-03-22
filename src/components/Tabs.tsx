import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-2 mb-4 justify-center sm:justify-start">
      <button
        onClick={() => navigate('/task-list')}
        className={`px-3 py-1 text-sm font-medium ${location.pathname === '/task-list' ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
      >
        📋 List View
      </button>
      <button
        onClick={() => navigate('/task-board')}
        className={`px-3 py-1 text-sm font-medium ${location.pathname === '/task-board' ? 'text-green-500' : 'text-gray-600 hover:text-green-500'}`}
      >
        🗂 Board View
      </button>
    </div>
  );
};

export default Tabs;