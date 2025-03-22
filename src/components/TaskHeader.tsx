import React from 'react';

const TaskHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white shadow-md rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-0">
        <span className="text-blue-500 text-2xl">📋</span>
        <h1 className="text-xl font-bold text-gray-700">TaskBuddy</h1>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Google_account_icon.svg/1606px-Google_account_icon.svg.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
            />
             <span className="text-gray-600 font-medium hidden sm:block">
              {user.displayName || 'User'}
            </span>
          </>
        ) : (
          <span className="text-gray-600"></span>
        )}
      </div>
    </div>
  );
};

export default TaskHeader;
