import React from 'react';

interface TaskFiltersProps {
     tasks: any[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDueDate: string;
  setSelectedDueDate: (dueDate: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  openModal: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ selectedCategory, setSelectedCategory, selectedDueDate, setSelectedDueDate, searchTerm, setSearchTerm, openModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
        <span className="text-gray-700 font-semibold text-sm">Filter By:</span>
        <select 
          className="border bg-white px-4 py-2 text-sm rounded-lg shadow-md w-full sm:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="WORK">Work</option>
          <option value="PERSONAL">Personal</option>
        </select>
        <select 
          className="border bg-white px-4 py-2 text-sm rounded-lg shadow-md w-full sm:w-auto"
          value={selectedDueDate}
          onChange={(e) => setSelectedDueDate(e.target.value)}
        >
          <option value="">Due Date</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border px-4 py-2 text-sm rounded-full shadow-md w-full sm:w-48 mb-3 sm:mb-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={openModal} className="bg-purple-500 text-white px-4 py-2 rounded-full shadow-md text-sm sm:text-base w-full sm:w-auto">
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;