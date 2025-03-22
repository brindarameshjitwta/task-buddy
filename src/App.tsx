import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskBoard from './components/TaskBoard';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';


function App() {
  
  return (

    <>
      
    <ToastContainer />
   <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/task-list" element={<TaskList />} />
        <Route path="/task-board" element={<TaskBoard />} />
      </Routes>
    </Router>


    </>
  );
}

export default App;
