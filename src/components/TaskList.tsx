import React, { useEffect, useState } from 'react';
import { getTasks, deleteTaskFromDB, addTask, updateTask } from "../jsonService";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { toast } from 'react-toastify';
import Tabs from './Tabs';
import TaskHeader from './TaskHeader';
import TaskFilters from './TaskFilters';


const TaskList = () => {
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [todoOpen, setTodoOpen] = useState(true);
  const [inProgressOpen, setInProgressOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);
  const [todoTasks, setTodoTasks] = useState<any[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
    setDropdownVisible(null);
  }
const handleSortToggle = () => {
  setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
};

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
    
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      const todo: any[] = [];
      const inProgress: any[] = [];
      const completed: any[] = [];

      for (const task of data) {
        switch (task.taskStatus) {
          case 'TO-DO':
            todo.push(task);
            break;
          case 'IN-PROGRESS':
            inProgress.push(task);
            break;
          case 'COMPLETED':
            completed.push(task);
            break;
          default:
            console.warn(`Unknown status: ${task.taskStatus}`);
        }
      }

      setTodoTasks(todo);
      setInProgressTasks(inProgress);
      setCompletedTasks(completed);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  const tasksData = [...todoTasks, ...inProgressTasks, ...completedTasks];
  const filteredTasks = tasksData.filter((task) => {
    if (selectedCategory && task.taskCategory !== selectedCategory) return false;

    if (selectedDueDate) {
      const taskDueDate = new Date(task.dueOn);
      const currentDate = new Date();
      if (selectedDueDate === 'Today') {
        if (taskDueDate.toDateString() !== currentDate.toDateString()) return false;
      } else if (selectedDueDate === 'This Week') {
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);
        if (taskDueDate < startOfWeek || taskDueDate > endOfWeek) return false;
      }
    }

    // Search by task name (case-insensitive)
    if (searchTerm && !task.taskName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
  const dateA = new Date(a.dueOn).getTime();
  const dateB = new Date(b.dueOn).getTime();
  return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
});
// Function for batch status update
const updateTaskStatus = async (newStatus: string, tasksData: any[]) => {
  try {
    
    const tasksToUpdate = tasksData.filter((task:any) =>
      selectedTasks.includes(task.id)
    );

    
    const updatedTasks = tasksToUpdate.map((task:any) => ({
      ...task,
      taskStatus: newStatus,
    }));
    await Promise.all(
      updatedTasks.map((task:any) =>
        updateTask(task.id, { ...task, taskStatus: newStatus })
      )
    );
    setSelectedTasks([]);
    toast.success('Tasks updated successfully!');
    fetchTasks()
  } catch (error) {
    toast.error('Failed to update tasks');
    console.error("Error updating tasks' status:", error);
  }
};

    const handleUpdateTask = async (updatedTask: any) => {
      try {
        await updateTask(updatedTask.id, updatedTask);
        toast.success('Task updated successfully!');
        fetchTasks();
        closeEditModal();
      } catch (error) {
        toast.error('Failed to update task');
        console.error("Error updating task:", error);
      }
    };

  const toggleSection = (section: string) => {
    switch (section) {
      case 'todo':
        setTodoOpen(!todoOpen);
        break;
      case 'inProgress':
        setInProgressOpen(!inProgressOpen);
        break;
      case 'completed':
        setCompletedOpen(!completedOpen);
        break;
    }
  };


  const toggleDropdown = (taskId: number) => {
    setDropdownVisible(dropdownVisible === taskId ? null : taskId);
  };

 const handleDeleteTask = async (taskId: any) => {
  const numericId = Number(taskId);

  if (!numericId || isNaN(numericId)) {
    console.error('Invalid Task ID:', taskId);
    return;
  }
  try {
    const deletionSuccessful = await deleteTaskFromDB(numericId);
    if (deletionSuccessful) {
      toast.success('Task deleted successfully!');
      fetchTasks();
    }
  } catch (error) {
    toast.error('Failed to delete task');
    console.error("Error during task deletion:", error);
  }
};
  const handleAddTask = async (task: any) => {
    try {
      await addTask(task);
      toast.success('Task added successfully!');
      fetchTasks();
      closeModal();
    } catch (error) {
      toast.error('Failed to add task');
      console.error("Error adding task:", error);
    }
  };

  const handleInlineAddTask = async () => {
  if (!newTaskName || !newTaskDate || !newTaskCategory) {
    alert('Please fill in all fields');
    return;
  }

  const newTask = {
    taskName: newTaskName,
    dueOn: newTaskDate,
    taskStatus: newTaskStatus || '',
    taskCategory: newTaskCategory,
  };

  try {
    await addTask(newTask); 
    toast.success('Task added successfully!');
    fetchTasks(); 
    setShowAddTask(false);
    alert('Task added successfully!');
  } catch (error) {
    toast.error('Failed to add task');
    console.error("Error adding task:", error);
    alert('Failed to add task. Please try again.');
  }


  setNewTaskName('');
  setNewTaskDate('');
  setNewTaskStatus('Pending');
  setNewTaskCategory('');
};

// Handle checkbox change for batch update
const handleCheckboxChange = (taskId: number) => {
  setSelectedTasks((prevSelectedTasks) => {
    if (prevSelectedTasks.includes(taskId)) {
      return prevSelectedTasks.filter((id) => id !== taskId); 
    } else {
      return [...prevSelectedTasks, taskId]; 
    }
  });
};

const deleteSelectedTasks = async () => {

  const tasksToDelete = selectedTasks.map(taskId => {
    return taskId;
  });

  try {
    
    const deletePromises = tasksToDelete.map(async (taskId) => {
      const result = await deleteTaskFromDB(taskId);
      if (result) {
        setTodoTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setInProgressTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setCompletedTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
    });
    await Promise.all(deletePromises);
    setSelectedTasks([]);
    toast.success('Selected tasks deleted successfully!');
    fetchTasks();
  } catch (error) {
    toast.error('Failed to delete selected tasks');
    console.error('Error deleting selected tasks:', error);
  }
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  const suffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${suffix(day)} ${month}, ${year}`;
};
 const handleDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTasks = tasksData.map((task) => {
      if (task.id === draggedTask.id) {
        return { ...task, taskStatus: newStatus };
      }
      return task;
    });

    setTodoTasks(updatedTasks.filter(task => task.taskStatus === 'TO-DO'));
    setInProgressTasks(updatedTasks.filter(task => task.taskStatus === 'IN-PROGRESS'));
    setCompletedTasks(updatedTasks.filter(task => task.taskStatus === 'COMPLETED'));
    setDraggedTask(null);
    try {
      await updateTask(draggedTask.id, { ...draggedTask, taskStatus: newStatus });
    } catch (error) {
      console.error("Error saving task order:", error);
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-4 flex justify-center items-center">
  <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 animate-fade-in">
    <div className="p-4">
      {/* Header Section */}
  <TaskHeader/>
    <Tabs />
       <TaskFilters
            tasks={tasksData}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDueDate={selectedDueDate}
            setSelectedDueDate={setSelectedDueDate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openModal={openModal} />
 <div className="hidden sm:grid grid-cols-6 p-3 border-b border-gray-300 font-bold text-gray-700 text-center">
  <span></span>
  <span>Task Name</span>

  {/* Sortable Due Date Column */}
  <span 
    className="cursor-pointer flex items-center justify-center"
    onClick={handleSortToggle}
  >
    Due Date
    {sortOrder === 'asc' ? (
      <span className="ml-2">⬆</span> // Ascending Arrow
    ) : (
      <span className="ml-2">⬇</span> // Descending Arrow
    )}
  </span>

  <span>Status</span>
  <span>Category</span>
  <span>Actions</span>
</div>

    </div>

    {['todo', 'inProgress', 'completed'].map((section) => {
      const tasksData =
        section === 'todo'
          ? todoTasks
          : section === 'inProgress'
          ? inProgressTasks
          : completedTasks;
      const openState =
        section === 'todo'
          ? todoOpen
          : section === 'inProgress'
          ? inProgressOpen
          : completedOpen;
      const color =
        section === 'todo'
          ? 'bg-pink-200'
          : section === 'inProgress'
          ? 'bg-blue-200'
          : 'bg-green-200';

      return (
        <div key={section} className="mt-4 border rounded-lg shadow-sm"
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, section === 'todo' ? 'TO-DO' : section === 'inProgress' ? 'IN-PROGRESS' : 'COMPLETED')}>
          <div
            className={`${color} p-3 flex justify-between items-center cursor-pointer font-bold text-sm rounded-t-lg`}
            onClick={() => toggleSection(section)}
          >
            <span>
              {section === 'todo'
                ? 'Todo'
                : section === 'inProgress'
                ? 'In-Progress'
                : 'Completed'}{' '}
              ({tasksData.length})
            </span>
            <span className="text-lg">{openState ? '▲' : '▼'}</span>
          </div>

        
{openState && (
  <div className="overflow-x-auto p-3 bg-gray-50 text-gray-600 rounded-b-lg text-sm ">
    {section === 'todo' && (
      <button className="mb-4 flex items-center gap-1 text-purple-600 font-semibold text-sm" onClick={() => setShowAddTask(true)}> 
        <span className="text-lg">+</span> ADD TASK
      </button>
    )}

{sortedTasks.length === 0 ? (
  <div className="text-center text-gray-500 p-3">No tasks available in this section.</div>
) : (
  sortedTasks
    .filter((task) => {
      if (section === 'todo' && task.taskStatus !== 'TO-DO') return false;
      if (section === 'inProgress' && task.taskStatus !== 'IN-PROGRESS') return false;
      if (section === 'completed' && task.taskStatus !== 'COMPLETED') return false;

      if (selectedCategory && task.taskCategory !== selectedCategory) return false;

      if (selectedDueDate) {
        const taskDueDate = new Date(task.dueOn);
        const currentDate = new Date();

        if (selectedDueDate === 'Today') {
          if (taskDueDate.toDateString() !== currentDate.toDateString()) return false;
        } else if (selectedDueDate === 'This Week') {
          const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
          const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
          startOfWeek.setHours(0, 0, 0, 0);
          endOfWeek.setHours(23, 59, 59, 999);

          if (taskDueDate < startOfWeek || taskDueDate > endOfWeek) return false;
        }
      }

      return true;
    })
    .map((task, index) => (
      <div
        key={task.id}
        className="grid grid-cols-1 sm:grid-cols-6 p-3 border-b border-gray-200 items-center text-center"
        draggable
        onDragStart={() => handleDragStart(task)}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="relative flex items-center justify-center space-x-4 sm:space-x-3 w-full">
          <input
            type="checkbox"
            checked={selectedTasks.includes(task.id)}
            onChange={() => handleCheckboxChange(task.id)}
            className={`w-5 h-5 appearance-none border-2 border-gray-400 rounded-full checked:bg-green-500 checked:border-green-500 transition-all duration-300 cursor-pointer ${task.taskStatus === 'COMPLETED' ? 'checked:bg-green-500 checked:border-green-500' : ''}`}
          />
          <span className={`hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-full ${task.taskStatus === 'COMPLETED' ? 'text-green-500 bg-gray-200' : 'text-gray-500 bg-gray-200'}`}>✔</span>
        </div>
        <span className={`break-words col-span-1 sm:col-span-1 ${task.taskStatus === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
          {task.taskName}
        </span>
        <span className="hidden sm:block">{formatDate(task.dueOn)}</span>
        <span className="hidden sm:block">{task.taskStatus}</span>
        <span className="hidden sm:block">{task.taskCategory}</span>
        <div className="relative flex justify-center hidden sm:block">
          <button onClick={() => toggleDropdown(task.id)} className="text-gray-700 text-lg hover:text-gray-900 transition-all duration-200">⋮</button>
          {dropdownVisible === task.id && (
            <div className="absolute right-0 top-full mt-1 bg-pink-50 border border-pink-200 shadow-lg rounded-lg w-36 z-50 p-1">
              <button className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50" onClick={() => openEditModal(task)}>
                <span className="mr-2">✏</span>Edit
              </button>
              <button className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDeleteTask(task.id)}>
                <span className="mr-2">🗑</span> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    ))
)}

{/*Input fields for adding data fom inline */}
    {section === 'todo' && showAddTask && (
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-3 bg-gray-100 border rounded-lg mb-4 items-center">
        <div className="col-span-1">
          <input type="text" placeholder="Task Title" className="border px-4 py-2 rounded-full w-full" onChange={(e) => setNewTaskName(e.target.value)} value={newTaskName} />
        </div>
        <div className="col-span-1">
          <input type="date" className="border px-4 py-2 rounded-full w-full" onChange={(e) => setNewTaskDate(e.target.value)} value={newTaskDate} />
        </div>
<div className="relative col-span-1">
  {newTaskStatus ? (
    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full cursor-pointer" onClick={() => setShowStatusDropdown(true)}>
      {newTaskStatus}
    </span>
  ) : (
    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full" onClick={() => setShowStatusDropdown(true)}>+</button>
  )}
  {showStatusDropdown && (
    <div className="absolute mt-2 w-36 bg-white border rounded-lg shadow-lg p-2">
      {['TO-DO', 'IN-PROGRESS', 'COMPLETED'].map((status) => (
        <div key={status} className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { setNewTaskStatus(status); setShowStatusDropdown(false); }}>
          {status}
        </div>
      ))}
    </div>
  )}
</div>
  <div className="relative col-span-1">
  {newTaskCategory ? (
    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full cursor-pointer" onClick={() => setShowCategoryDropdown(true)}>
      {newTaskCategory}
    </span>
  ) : (
    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full" onClick={() => setShowCategoryDropdown(true)}>+</button>
  )}

  {showCategoryDropdown && (
    <div className="absolute mt-2 w-36 bg-white border rounded-lg shadow-lg p-2">
      {['WORK', 'PERSONAL'].map((category) => (
        <div 
          key={category} 
          className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg" 
          onClick={() => { setNewTaskCategory(category); setShowCategoryDropdown(false); }}
        >
          {category}
        </div>
      ))}
    </div>
  )}
</div>
        <div className="col-span-1">
          <button onClick={handleInlineAddTask} className="bg-purple-600 text-white px-5 py-2 rounded-full">Add ↩</button>
        </div>
        <div className="col-span-1">
          <button onClick={() => setShowAddTask(false)} className="text-gray-600 px-5 py-2 rounded-full">Cancel</button>
        </div>
      </div>
    )}
  </div>
)}
        </div>
      );
    })}
 {/* Batch Update  */}
{selectedTasks.length > 0 && (
  <div className="mt-4 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
    <div className="bg-black p-2 rounded-lg flex items-center space-x-3 w-full md:w-auto">
      {/* Dropdown for selecting task status */}
      <select
        onChange={(e) => {
          const allTasks = [...todoTasks, ...inProgressTasks, ...completedTasks];
          updateTaskStatus(e.target.value, allTasks);
        }}
        className="bg-black text-white text-sm rounded-full px-4 py-2 border border-white focus:outline-none w-full md:w-auto"
      >
        <option value="">Select Status</option>
        <option value="TO-DO">TO-DO</option>
        <option value="IN-PROGRESS">IN-PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      {/* Pill to show how many checkboxes are selected */}
      <div className="bg-blue-500 text-white text-sm rounded-full px-4 py-2">
        {selectedTasks.length} Selected
      </div>

      {/* Delete Button as a Pill */}
      <button
        onClick={deleteSelectedTasks}
        className="bg-red-600 text-white text-sm rounded-full px-4 py-2 focus:outline-none w-full md:w-auto"
      >
        Delete Selected
      </button>
    </div>
  </div>
)}
    {/* Modal for adding/editing tasks */}
    {isModalOpen && (
      <AddTaskModal isOpen={isModalOpen} closeModal={closeModal} onAddTask={handleAddTask} />
    )}
    {isEditModalOpen && selectedTask && (
      <EditTaskModal task={selectedTask} onClose={closeEditModal} onUpdate={handleUpdateTask} />
    )}
  </div>
</div>

  );
};

export default TaskList;
