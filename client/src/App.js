import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import './App.css'; // Import the new styles

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/user" 
          element={user?.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;