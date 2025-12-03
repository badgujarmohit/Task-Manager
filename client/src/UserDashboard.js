import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/user/${user.id}/tasks`);
    setTasks(res.data);
  };

  const handleCancel = async () => {
    if (!selectedTask) return;
    await axios.put(`http://localhost:5000/tasks/${selectedTask}/cancel`, { reason: cancelReason });
    setSelectedTask(null);
    setCancelReason('');
    fetchTasks();
  };

  const handleComplete = async (id) => {
    await axios.put(`http://localhost:5000/tasks/${id}/complete`);
    fetchTasks();
  };

  return (
    <div className="container">
      <div className="app-header">
        <div>
          <h1>Hello, {user.username} 👋</h1>
          <p>Here are your assigned tasks</p>
        </div>
        <button className="btn-outline" onClick={() => window.location.href='/'}>Logout</button>
      </div>
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th style={{ minWidth: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td><strong>{task.title}</strong></td>
                <td>{task.project_name}</td>
                <td><span className={`badge badge-${task.difficulty}`}>{task.difficulty}</span></td>
                <td><span className={`status-label status-${task.status}`}>{task.status}</span></td>
                <td>
                  {(task.status === 'active' || task.status === 'forwarded') && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleComplete(task.id)}>Done</button>
                      <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedTask(task.id)}>Cancel</button>
                    </div>
                  )}
                  {task.status === 'completed' && <span style={{color:'green', fontSize:'0.9rem'}}>✅ Sent to Admin</span>}
                  {task.status === 'cancelled' && <span style={{color:'red', fontSize:'0.9rem'}}>❌ Waiting for Review</span>}
                </td>
              </tr>
            ))}
             {tasks.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>No tasks assigned to you. Relax! ☕</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{marginTop:0}}>Reason for Cancellation</h3>
            <p style={{fontSize:'0.9rem', color:'#64748b'}}>Help the admin understand why.</p>
            <textarea 
                style={{width: '100%', minHeight: '100px', marginTop:'10px'}} 
                placeholder="Type your reason here..."
                onChange={e => setCancelReason(e.target.value)} 
            />
            <div style={{marginTop: '20px', display: 'flex', gap:'10px'}}>
              <button className="btn-primary" onClick={handleCancel}>Submit</button>
              <button className="btn-outline" onClick={() => setSelectedTask(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;