import React, { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import { getTasks, addTask, deleteTaskFromDB, updateTask } from "../jsonService";
import EditTaskModal from "./EditTaskModal";
import { toast } from "react-toastify";
import Tabs from "./Tabs";
import TaskHeader from "./TaskHeader";

const TaskBoard = () => {
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [draggedTask, setDraggedTask] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
    setDropdownVisible(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = async (task: any) => {
    try {
      await addTask(task);
      toast.success("Task added successfully!");
      fetchTasks();
      closeModal();
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const deletionSuccessful = await deleteTaskFromDB(taskId);
      if (deletionSuccessful) {
        toast.success("Task deleted successfully");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error during task deletion:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: any) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
      toast.success("Task updated successfully!");
      fetchTasks();
      closeEditModal();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const toggleDropdown = (taskId: number) => {
    setDropdownVisible((prev) => (prev === taskId ? null : taskId));
  };

  const isToday = (date: string) => {
    const today = new Date();
    const taskDate = new Date(date);
    return (
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear()
    );
  };

  const isThisWeek = (date: string) => {
    const today = new Date();
    const taskDate = new Date(date);

    const startOfWeek = today.getDate() - today.getDay(); // Sunday
    const endOfWeek = startOfWeek + 6; // Saturday

    const taskDay = taskDate.getDate();

    return taskDay >= startOfWeek && taskDay <= endOfWeek &&
      taskDate.getMonth() === today.getMonth() && 
        taskDate.getFullYear() === today.getFullYear();
  };

  const filteredTasks = (category: string) => {
    return tasks
      .filter((task) => task.taskStatus === category)
      .filter((task) => task.taskName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((task) => {
        if (selectedCategory) {
          return task.taskCategory === selectedCategory;
        }
        return true;
      })
      .filter((task) => {
        if (selectedDueDate === "Today") {
          return isToday(task.dueOn);
        }
        if (selectedDueDate === "This Week") {
          return isThisWeek(task.dueOn);
        }
        return true;
      });
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

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggedTask.id) {
        return { ...task, taskStatus: newStatus };
      }
      return task;
    });

    setTasks(updatedTasks);
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
          <Tabs/>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              <span className="text-gray-700 font-semibold text-sm">Filter By:</span>
              <select 
                className="border bg-white px-4 py-2 text-sm rounded-lg shadow-md w-full sm:w-auto"
                onChange={(e) => setSelectedCategory(e.target.value)} 
              >
                <option value="">Category</option>
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
              </select>
              <select 
                className="border bg-white px-4 py-2 text-sm rounded-lg shadow-md w-full sm:w-auto"
                onChange={(e) => setSelectedDueDate(e.target.value)} 
              >
                <option value="">Due Date</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
              </select>
            </div>

            {/* Search & Add Task */}
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((taskCategory, id) => {
            const categoryTasks = filteredTasks(taskCategory);

            return (
                <div
  key={id}
  onDrop={(e) => handleDrop(e, taskCategory)}
  onDragOver={allowDrop}
  className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] border-t-4 border-purple-400 overflow-y-auto max-h-[500px]"
>
  <span
    className={`text-white px-3 py-1 rounded-full text-xs font-bold ${
      taskCategory === "TO-DO"
        ? "bg-pink-400"
        : taskCategory === "IN-PROGRESS"
        ? "bg-blue-400"
        : "bg-green-400"
    }`}
  >
    {taskCategory}
  </span>

  <div className="mt-4 space-y-3">
    {categoryTasks.length === 0 ? (
      <div className="text-gray-500 text-center py-4">
        No tasks in {taskCategory.toLowerCase()}.
      </div>
    ) : (
      [...categoryTasks]
        .sort(
          (a, b) => new Date(a.dueOn).getTime() - new Date(b.dueOn).getTime()
        )
        .map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task)}
            className={`bg-gray-50 p-4 rounded-lg shadow-md border relative transition-transform duration-300 hover:bg-gray-200 hover:scale-101 will-change-transform ${
              taskCategory === "COMPLETED" ? "line-through text-gray-900" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-gray-800 font-semibold">{task.taskName}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => toggleDropdown(task.id)}
              >
                •••
              </button>
              {dropdownVisible === task.id && (
                <div className="absolute right-0 top-8 bg-white border shadow-lg rounded-md w-32">
                  <button
                    className="block w-full px-3 py-2 text-left text-gray-700"
                    onClick={() => openEditModal(task)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="block w-full px-3 py-2 text-left text-red-600"
                    onClick={() => handleDeleteTask(Number(task.id))}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between text-gray-500 text-sm mt-2">
              <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                {task.taskCategory}
              </span>
              <span>{formatDate(task.dueOn)}</span>
            </div>
          </div>
        ))
    )}
  </div>
</div>
            );
          })}
        </div>

        {isModalOpen && <AddTaskModal isOpen={isModalOpen} closeModal={closeModal} onAddTask={handleAddTask} />}
        {isEditModalOpen && selectedTask && <EditTaskModal task={selectedTask} onClose={closeEditModal} onUpdate={handleUpdateTask} />}
      </div>
    </div>
  );
};

export default TaskBoard;