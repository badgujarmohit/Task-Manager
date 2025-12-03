import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Create Form States
  const [newProject, setNewProject] = useState('');
  const [newTask, setNewTask] = useState({ title: '', difficulty: 'Medium', project_id: '' });

  // Reassign Modal States
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetTask, setTargetTask] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const t = await axios.get('http://localhost:5000/admin/tasks');
    const p = await axios.get('http://localhost:5000/projects');
    const u = await axios.get('http://localhost:5000/users');
    setTasks(t.data);
    setProjects(p.data);
    setUsers(u.data);
  };

  // --- ACTIONS ---

  const createProject = async () => {
    if(!newProject) return;
    await axios.post('http://localhost:5000/projects', { name: newProject });
    setNewProject('');
    fetchData();
  };

  const createTask = async () => {
    if(!newTask.title || !newTask.project_id) return;
    await axios.post('http://localhost:5000/tasks', newTask);
    setNewTask({ ...newTask, title: '' });
    fetchData();
  };

  // Open the Reassign Modal
  const openReassignModal = (task) => {
    setTargetTask(task);
    setSelectedUser(''); // Reset selection
    setReassignModalOpen(true);
  };

  // Submit Reassignment
  const handleReassignSubmit = async () => {
    if (!targetTask || !selectedUser) {
        alert("Please select a user");
        return;
    }
    
    try {
        await axios.put(`http://localhost:5000/tasks/${targetTask.id}/assign`, { userId: selectedUser });
        setReassignModalOpen(false);
        setTargetTask(null);
        fetchData(); // Refresh list
    } catch (err) {
        alert("Error reassigning task");
    }
  };

  // Standard dropdown change (for non-cancelled tasks)
  const handleDropdownAssign = async (taskId, userId) => {
      await axios.put(`http://localhost:5000/tasks/${taskId}/assign`, { userId });
      fetchData();
  };

  return (
    <div className="container">
      <div className="app-header">
        <div>
          <h1>Admin Portal</h1>
          <p>Manage projects and reassign cancelled tasks</p>
        </div>
        <button className="btn-outline" onClick={() => window.location.href='/'}>Logout</button>
      </div>
      
      <div className="dashboard-grid">
        {/* Create Project Card */}
        <div className="card">
          <h3>New Project</h3>
          <div className="form-stack" style={{ marginTop: '15px' }}>
            <input value={newProject} placeholder="e.g. Website Redesign" onChange={e => setNewProject(e.target.value)} />
            <button className="btn-primary" onClick={createProject}>Create Project</button>
          </div>
        </div>

        {/* Create Task Card */}
        <div className="card">
          <h3>New Task</h3>
          <div className="form-stack" style={{ marginTop: '15px' }}>
            <input value={newTask.title} placeholder="Task description" onChange={e => setNewTask({...newTask, title: e.target.value})} />
            <div className="form-row">
              <select onChange={e => setNewTask({...newTask, difficulty: e.target.value})}>
                <option value="Hard">Hard</option>
                <option value="Medium">Medium</option>
                <option value="Easy">Easy</option>
              </select>
              <select onChange={e => setNewTask({...newTask, project_id: e.target.value})}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={createTask}>Add Task</button>
          </div>
        </div>
      </div>

      <h3>Task Management</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Current User</th>
              <th style={{minWidth: '150px'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ background: task.status === 'cancelled' ? '#fff1f2' : 'white' }}>
                <td><strong>{task.title}</strong></td>
                <td>{task.project_name}</td>
                <td><span className={`badge badge-${task.difficulty}`}>{task.difficulty}</span></td>
                <td>
                  <span className={`status-label status-${task.status}`}>{task.status}</span>
                  {task.status === 'cancelled' && (
                    <div style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '5px', fontStyle: 'italic' }}>
                      Reason: "{task.cancel_reason}"
                    </div>
                  )}
                </td>
                <td>{task.assigned_user || <span style={{color:'#cbd5e1'}}>--</span>}</td>
                
                {/* ACTION COLUMN */}
                <td>
                  {task.status === 'cancelled' ? (
                    // 🔴 IF CANCELLED: Show Specific "Reassign" Button
                    <button 
                        className="btn-danger" 
                        style={{ width: '100%', fontSize: '0.9rem' }}
                        onClick={() => openReassignModal(task)}
                    >
                        ↺ Reassign
                    </button>
                  ) : (
                    // ⚪ IF NORMAL: Show Dropdown
                    <select 
                      style={{ padding: '8px', fontSize: '0.9rem', marginBottom: 0, borderColor: '#e2e8f0' }} 
                      onChange={(e) => handleDropdownAssign(task.id, e.target.value)} 
                      value={task.assigned_to || ""}
                    >
                      <option value="" disabled>Change User</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'40px'}}>No tasks found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* --- REASSIGN MODAL --- */}
      {reassignModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{marginTop: 0}}>Reassign Task</h3>
            <p style={{marginBottom: '20px', color: '#666'}}>
                Select a new user for: <strong>{targetTask?.title}</strong>
            </p>
            
            <div className="form-stack">
                <label style={{fontSize: '0.9rem', fontWeight: '600'}}>Select User:</label>
                <select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{ padding: '12px' }}
                >
                    <option value="">-- Choose User --</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
                
                <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                    <button className="btn-primary" onClick={handleReassignSubmit}>Confirm Reassign</button>
                    <button className="btn-outline" onClick={() => setReassignModalOpen(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;