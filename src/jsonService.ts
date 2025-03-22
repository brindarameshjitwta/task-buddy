// src/services/taskService.ts

const API_URL = 'http://localhost:8000/tasks';

export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const addTask = async (task: any) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to add task');
    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};


export const updateTask = async (id: number, updatedTask: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};
export const deleteTaskFromDB = async (taskId: number) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Task with ID ${taskId} could not be deleted`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting task from DB:', error);
    return false;
  }
};
export const updateDragDrop = async (id: number, updatedTask: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};




