import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaintSubTab, setComplaintSubTab] = useState('active');
  const [meetingSubTab, setMeetingSubTab] = useState('upcoming');
  const [schemeSubTab, setSchemeSubTab] = useState('active');
  
  // Data States
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [rationStock, setRationStock] = useState([]);
  const [myRationLogs, setMyRationLogs] = useState([]);
  const [allRationLogs, setAllRationLogs] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [villagers, setVillagers] = useState([]);
  
  // Modal & Form States
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Water Supply',
    description: '',
    ward: 'Ward 1',
    imageUrl: '',
    noticeType: 'GENERAL',
    content: '',
    agenda: '',
    dateTime: '',
    location: '',
    organizer: '',
    schemeName: '',
    department: '',
    eligibility: '',
    contactName: '',
    phoneNumber: '',
    emergencyCategory: 'Ambulance',
    itemName: '',
    quantity: '',
    unit: 'KG',
    userId: '',
    distributeQuantity: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Poll every 5 seconds for auto-updating dashboard
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'complaints') { 
        const res = await api.get('/complaints'); 
        setComplaints(res.data); 
      }
      if (activeTab === 'notices') { 
        const res = await api.get('/notices'); 
        setNotices(res.data); 
      }
      if (activeTab === 'meetings') { 
        const res = await api.get('/meetings'); 
        setMeetings(res.data); 
      }
      if (activeTab === 'schemes') { 
        const resS = await api.get('/schemes'); 
        setSchemes(resS.data); 
        if (user.role === 'ROLE_VILLAGER') { 
          const resA = await api.get('/schemes/my-applications'); 
          setMyApplications(resA.data); 
        }
        if (user.role === 'ROLE_ADMIN') {
          const resA = await api.get('/schemes/applications');
          setAllApplications(resA.data);
        }
      }
      if (activeTab === 'ration') {
        const resS = await api.get('/ration/stock'); 
        setRationStock(resS.data);
        if (user.role === 'ROLE_VILLAGER') { 
          const resL = await api.get('/ration/my'); 
          setMyRationLogs(resL.data); 
        }
        if (user.role === 'ROLE_ADMIN') {
          const resL = await api.get('/ration/distributions');
          setAllRationLogs(resL.data);
          const resV = await api.get('/users/villagers');
          setVillagers(resV.data);
          if (resV.data.length > 0) {
            setFormData(prev => ({ ...prev, userId: resV.data[0].id.toString() }));
          }
        }
      }
      if (activeTab === 'emergency') { 
        const res = await api.get('/emergency'); 
        setEmergencyContacts(res.data); 
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleVote = async (id) => {
    try { 
      await api.post(`/complaints/${id}/vote`); 
      fetchData(); 
    } catch (err) { 
      alert(err.response?.data || 'Already voted'); 
    }
  };

  const handleApplyScheme = async (id) => {
    try {
      await api.post(`/schemes/${id}/apply`);
      alert("Interest registered successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register interest');
    }
  };

  const openForm = (type) => {
    setFormType(type);
    setFormData({
      title: '',
      category: 'Water Supply',
      description: '',
      ward: 'Ward 1',
      imageUrl: '',
      noticeType: 'GENERAL',
      content: '',
      agenda: '',
      dateTime: '',
      location: '',
      organizer: '',
      schemeName: '',
      department: '',
      eligibility: '',
      contactName: '',
      phoneNumber: '',
      emergencyCategory: 'Ambulance',
      itemName: rationStock.length > 0 ? rationStock[0].itemName : '',
      quantity: '',
      unit: 'KG',
      userId: villagers.length > 0 ? villagers[0].id.toString() : '',
      distributeQuantity: ''
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'complaint') {
        await api.post('/complaints', {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          ward: formData.ward,
          imageUrl: formData.imageUrl
        });
      } else if (formType === 'notice') {
        await api.post('/notices', {
          title: formData.title,
          content: formData.content,
          type: formData.noticeType
        });
      } else if (formType === 'meeting') {
        await api.post('/meetings', {
          title: formData.title,
          agenda: formData.agenda,
          dateTime: formData.dateTime,
          location: formData.location,
          organizer: formData.organizer
        });
      } else if (formType === 'scheme') {
        await api.post('/schemes', {
          name: formData.schemeName,
          description: formData.description,
          eligibility: formData.eligibility,
          department: formData.department,
          imageUrl: formData.imageUrl
        });
      } else if (formType === 'emergency') {
        await api.post('/emergency', {
          name: formData.contactName,
          phoneNumber: formData.phoneNumber,
          category: formData.emergencyCategory
        });
      } else if (formType === 'stock') {
        await api.post('/ration/stock', {
          itemName: formData.itemName,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit
        });
      } else if (formType === 'distribute') {
        await api.post(`/ration/distribute?userId=${formData.userId}&itemName=${formData.itemName}&quantity=${parseFloat(formData.distributeQuantity)}`);
      }
      alert("Successfully submitted!");
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Submission failed");
    }
  };

  const handleUpdateComplaintStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleUpdateComplaintPriority = async (id, priority) => {
    try {
      await api.put(`/complaints/${id}/priority?priority=${priority}`);
      fetchData();
    } catch (err) {
      alert("Failed to update priority");
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!confirm("Are you sure you want to delete this resolved complaint? This will also disappear for all villagers.")) return;
    try {
      await api.delete(`/complaints/${id}`);
      alert("Complaint deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to delete complaint");
    }
  };

  const handleUpdateMeetingStatus = async (id, status) => {
    try {
      await api.put(`/meetings/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleUpdateApplicationStatus = async (id, status) => {
    try {
      await api.put(`/schemes/applications/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert("Failed to update application status");
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!confirm("Are you sure you want to delete this meeting? This will also disappear for all villagers.")) return;
    try {
      await api.delete(`/meetings/${id}`);
      alert("Meeting deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to delete meeting");
    }
  };

  const handleUpdateSchemeStatus = async (id, active) => {
    try {
      await api.put(`/schemes/${id}/status?active=${active}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update scheme status");
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!confirm("Are you sure you want to delete this closed scheme? This will delete all applications submitted by villagers for this scheme!")) return;
    try {
      await api.delete(`/schemes/${id}`);
      alert("Scheme deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to delete scheme");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <span>Gram Setu</span>
          {user?.villageName && (
            <span style={{fontSize: '0.85rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'normal'}}>
              📍 {user.villageName}
            </span>
          )}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div className="tabs" style={{display: 'flex', gap: '0.25rem', overflowX: 'auto'}}>
              {['complaints', 'notices', 'meetings', 'schemes', 'ration', 'emergency'].map(t => (
                <span key={t} className={activeTab === t ? 'active-tab' : 'tab'} onClick={() => setActiveTab(t)} style={{textTransform: 'capitalize'}}>
                   {t}
                </span>
              ))}
           </div>
          <button onClick={logout} className="btn-ghost" style={{width: 'auto', padding: '0.5rem'}}>Logout</button>
        </div>
      </nav>

      <main style={{padding: '2rem'}}>
        <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '1.75rem', fontWeight: '800'}}>Welcome, {user?.fullName || user?.username}</h1>
            <p style={{margin: '0.35rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem'}}>
              Village: <strong>{user?.villageName || 'N/A'}</strong> | Village ID: <code style={{background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold'}}>{user?.villageId || 'N/A'}</code>
            </p>
          </div>
          <span className="badge badge-low" style={{fontSize: '0.9rem', padding: '0.4rem 0.8rem', textTransform: 'capitalize'}}>{user?.role?.replace('ROLE_', '').toLowerCase()}</span>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <h2 style={{textTransform: 'capitalize', margin: 0}}>{activeTab} Board</h2>
            <button onClick={fetchData} className="btn-ghost" style={{width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.85rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              🔄 Refresh
            </button>
          </div>
          <div>
            {user.role === 'ROLE_VILLAGER' && activeTab === 'complaints' && (
              <button onClick={() => openForm('complaint')} style={{width: 'auto', padding: '0.5rem 1rem'}}>File a Complaint 🚨</button>
            )}
            {user.role === 'ROLE_ADMIN' && (
              <div style={{display: 'flex', gap: '0.5rem'}}>
                {activeTab === 'notices' && <button onClick={() => openForm('notice')} style={{width: 'auto', padding: '0.5rem 1rem'}}>Add Notice 📢</button>}
                {activeTab === 'meetings' && <button onClick={() => openForm('meeting')} style={{width: 'auto', padding: '0.5rem 1rem'}}>Schedule Meeting 📅</button>}
                {activeTab === 'schemes' && <button onClick={() => openForm('scheme')} style={{width: 'auto', padding: '0.5rem 1rem'}}>Create Scheme 📄</button>}
                {activeTab === 'emergency' && <button onClick={() => openForm('emergency')} style={{width: 'auto', padding: '0.5rem 1rem'}}>Add Contact 📞</button>}
                {activeTab === 'ration' && (
                  <>
                    <button onClick={() => openForm('stock')} style={{width: 'auto', padding: '0.5rem 1rem', backgroundColor: 'var(--secondary)'}}>Manage Stock 📦</button>
                    <button onClick={() => openForm('distribute')} style={{width: 'auto', padding: '0.5rem 1rem'}}>Distribute Ration 🌾</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {activeTab === 'complaints' && (
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
            <span 
              className={complaintSubTab === 'active' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setComplaintSubTab('active')}
            >
              🚨 Active Complaints ({complaints.filter(c => c.status !== 'RESOLVED').length})
            </span>
            <span 
              className={complaintSubTab === 'resolved' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setComplaintSubTab('resolved')}
            >
              ✅ Resolved Complaints ({complaints.filter(c => c.status === 'RESOLVED').length})
            </span>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
            <span 
              className={meetingSubTab === 'upcoming' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setMeetingSubTab('upcoming')}
            >
              📅 Upcoming Meetings ({meetings.filter(m => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS').length})
            </span>
            <span 
              className={meetingSubTab === 'completed' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setMeetingSubTab('completed')}
            >
              ✅ Past / Completed ({meetings.filter(m => m.status === 'COMPLETED' || m.status === 'CANCELLED').length})
            </span>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
            <span 
              className={schemeSubTab === 'active' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setSchemeSubTab('active')}
            >
              🚨 Active Schemes ({schemes.filter(s => s.active).length})
            </span>
            <span 
              className={schemeSubTab === 'closed' ? 'active-tab' : 'tab'} 
              style={{cursor: 'pointer'}}
              onClick={() => setSchemeSubTab('closed')}
            >
              📁 Closed Schemes ({schemes.filter(s => !s.active).length})
            </span>
          </div>
        )}

        <div className="dashboard-grid">
          {activeTab === 'complaints' && complaints
             .filter(c => complaintSubTab === 'active' ? c.status !== 'RESOLVED' : c.status === 'RESOLVED')
             .map(c => (
             <div key={c.id} className="complaint-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
               <div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                   <span className="badge badge-low">{c.category}</span>
                   <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                 </div>
                 <h3>{c.title}</h3>
                 <p>{c.description}</p>
                 {c.ward && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>📍 Ward: {c.ward}</p>}
                 {c.imageUrl && <img src={c.imageUrl} alt={c.title} style={{width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem'}} />}
               </div>
               <div style={{marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                   <span style={{fontSize: '0.9rem'}}>Status: <span className={`badge ${
                     c.status === 'RESOLVED' ? 'badge-low' : c.status === 'REJECTED' ? 'badge-high' : 'badge-medium'
                   }`}>{c.status}</span></span>
                   <span>{c.voteCount} votes</span>
                 </div>
                 {user.role === 'ROLE_VILLAGER' && (
                   <button onClick={() => handleVote(c.id)} style={{width: 'auto', padding: '4px 10px'}}>Vote</button>
                 )}
                 {user.role === 'ROLE_ADMIN' && (
                    <div>
                      <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                         <div style={{flex: 1}}>
                           <label style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Status</label>
                           <select value={c.status} onChange={(e) => handleUpdateComplaintStatus(c.id, e.target.value)} style={{padding: '4px', fontSize: '0.85rem'}}>
                             {['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(st => (
                               <option key={st} value={st}>{st}</option>
                             ))}
                           </select>
                         </div>
                         <div style={{flex: 1}}>
                           <label style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Priority</label>
                           <select value={c.priority} onChange={(e) => handleUpdateComplaintPriority(c.id, e.target.value)} style={{padding: '4px', fontSize: '0.85rem'}}>
                             {['LOW', 'MEDIUM', 'HIGH'].map(pr => (
                               <option key={pr} value={pr}>{pr}</option>
                             ))}
                           </select>
                         </div>
                      </div>
                      {c.status === 'RESOLVED' && (
                        <button 
                          onClick={() => handleDeleteComplaint(c.id)}
                          style={{marginTop: '1rem', width: '100%', backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem', fontSize: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                        >
                          Delete Resolved Complaint 🗑️
                        </button>
                      )}
                    </div>
                 )}
               </div>
             </div>
          ))}

          {activeTab === 'ration' && (
            <div style={{width: '100%', gridColumn: '1 / -1'}}>
               <div className="card" style={{marginBottom: '2rem'}}>
                  <h3>Current Stock Availability</h3>
                  <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    {rationStock.map(s => (
                       <div key={s.id} style={{background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '150px', textAlign: 'center'}}>
                          <div style={{fontSize: '0.9rem', color: '#64748b'}}>{s.itemName}</div>
                          <div style={{fontSize: '1.5rem', fontWeight: '800'}}>{s.quantity} {s.unit}</div>
                       </div>
                    ))}
                    {rationStock.length === 0 && (
                      <p style={{color: 'var(--text-muted)'}}>No ration stock registered yet.</p>
                    )}
                  </div>
               </div>

               {user.role === 'ROLE_VILLAGER' && myRationLogs.length > 0 && (
                 <div className="card">
                    <h3>Your Distribution Logs</h3>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                           <th style={{padding: '1rem'}}>Date</th><th style={{padding: '1rem'}}>Item</th><th style={{padding: '1rem'}}>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myRationLogs.map(l => (
                          <tr key={l.id} style={{borderBottom: '1px solid #eee'}}>
                             <td style={{padding: '1rem'}}>{new Date(l.distributionDate).toLocaleDateString()}</td>
                             <td style={{padding: '1rem'}}>{l.itemName}</td>
                             <td style={{padding: '1rem'}}>{l.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               )}

               {user.role === 'ROLE_ADMIN' && allRationLogs.length > 0 && (
                 <div className="card" style={{maxWidth: '100%', overflowX: 'auto'}}>
                    <h3>Villager Distribution Logs</h3>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                           <th style={{padding: '1rem'}}>Recipient</th>
                           <th style={{padding: '1rem'}}>Date</th>
                           <th style={{padding: '1rem'}}>Item</th>
                           <th style={{padding: '1rem'}}>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRationLogs.map(l => (
                          <tr key={l.id} style={{borderBottom: '1px solid #eee'}}>
                             <td style={{padding: '1rem'}}>{l.recipient?.fullName || 'N/A'} ({l.recipient?.username || 'N/A'})</td>
                             <td style={{padding: '1rem'}}>{new Date(l.distributionDate).toLocaleDateString()}</td>
                             <td style={{padding: '1rem'}}>{l.itemName}</td>
                             <td style={{padding: '1rem'}}>{l.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'emergency' && emergencyContacts.map(ec => (
             <div key={ec.id} className="complaint-card" style={{borderTop: '4px solid var(--error)'}}>
                <small style={{color: 'var(--error)', fontWeight: '800'}}>{ec.category}</small>
                <h3>{ec.name}</h3>
                <div style={{fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '1rem 0'}}>📞 {ec.phoneNumber}</div>
                <button style={{background: '#fee2e2', color: 'var(--error)'}} onClick={() => window.location.href=`tel:${ec.phoneNumber}`}>Call Now</button>
             </div>
          ))}

          {activeTab === 'notices' && notices.map(n => (
             <div key={n.id} className="complaint-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
               <div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center'}}>
                   <span className={`badge ${n.type === 'EMERGENCY' ? 'badge-high' : n.type === 'MAINTENANCE' ? 'badge-medium' : 'badge-low'}`}>
                     {n.type}
                   </span>
                   <small style={{color: 'var(--text-muted)'}}>{new Date(n.createdAt).toLocaleDateString()}</small>
                 </div>
                 <h3>{n.title}</h3>
                 <p>{n.content}</p>
               </div>
               {user.role === 'ROLE_ADMIN' && (
                 <div style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end'}}>
                   <button onClick={() => handleDeleteNotice(n.id)} style={{width: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: 'none', color: 'var(--error)', border: '1px solid var(--error)'}}>Delete</button>
                 </div>
               )}
             </div>
          ))}

          {activeTab === 'meetings' && meetings
             .filter(m => meetingSubTab === 'upcoming' ? (m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS') : (m.status === 'COMPLETED' || m.status === 'CANCELLED'))
             .map(m => (
             <div key={m.id} className="complaint-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
               <div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center'}}>
                   <span className={`badge ${m.status === 'COMPLETED' ? 'badge-low' : m.status === 'CANCELLED' ? 'badge-high' : 'badge-medium'}`}>{m.status}</span>
                   <small style={{color: 'var(--text-muted)'}}>{new Date(m.dateTime).toLocaleString()}</small>
                 </div>
                 <h3>{m.title}</h3>
                 <p><strong>Agenda:</strong> {m.agenda}</p>
                 <div style={{marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <div>📍 <strong>Location:</strong> {m.location}</div>
                   {m.organizer && <div>👤 <strong>Organizer:</strong> {m.organizer}</div>}
                 </div>
               </div>
               {user.role === 'ROLE_ADMIN' && (
                 <div style={{marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem'}}>
                   <label style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Verify Status</label>
                   <select value={m.status} onChange={(e) => handleUpdateMeetingStatus(m.id, e.target.value)} style={{padding: '4px', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', width: '100%'}}>
                     {['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                       <option key={st} value={st}>{st}</option>
                     ))}
                   </select>
                   {(m.status === 'COMPLETED' || m.status === 'CANCELLED') && (
                     <button
                       onClick={() => handleDeleteMeeting(m.id)}
                       style={{marginTop: '0.5rem', width: '100%', backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem', fontSize: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                     >
                       Delete Meeting 🗑️
                     </button>
                   )}
                 </div>
               )}
             </div>
          ))}

          {activeTab === 'schemes' && (
            <div style={{width: '100%', gridColumn: '1 / -1'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                {schemes
                  .filter(s => schemeSubTab === 'active' ? s.active : !s.active)
                  .map(s => {
                     const myApp = myApplications.find(app => app.scheme.id === s.id);
                     return (
                       <div key={s.id} className="complaint-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                         <div>
                           <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                             <span className="badge badge-low">{s.department}</span>
                           </div>
                           <h3>{s.name}</h3>
                           <p>{s.description}</p>
                           <p style={{fontSize: '0.9rem'}}><strong>Eligibility:</strong> {s.eligibility}</p>
                         </div>
                         {user.role === 'ROLE_VILLAGER' && (
                           <div style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                             {myApp ? (
                               <span className={`badge ${
                                 myApp.status === 'APPROVED' ? 'badge-low' : myApp.status === 'REJECTED' ? 'badge-high' : 'badge-medium'
                               }`}>
                                 Status: {myApp.status}
                               </span>
                             ) : s.active ? (
                               <button onClick={() => handleApplyScheme(s.id)} style={{width: 'auto', padding: '6px 12px'}}>Interested to Apply</button>
                             ) : (
                               <span className="badge badge-high">Closed</span>
                             )}
                           </div>
                         )}
                         {user.role === 'ROLE_ADMIN' && (
                           <div style={{marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
                             {s.active ? (
                               <button 
                                 onClick={() => handleUpdateSchemeStatus(s.id, false)}
                                 style={{width: '100%', backgroundColor: 'var(--warning)', color: 'white', padding: '0.5rem', fontSize: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                               >
                                 Close Scheme 📁
                               </button>
                             ) : (
                               <button 
                                 onClick={() => handleDeleteScheme(s.id)}
                                 style={{width: '100%', backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem', fontSize: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                               >
                                 Delete Scheme 🗑️
                               </button>
                             )}
                           </div>
                         )}
                       </div>
                     );
                  })}
              </div>

              {user.role === 'ROLE_ADMIN' && (
                <div className="card" style={{maxWidth: '100%', overflowX: 'auto'}}>
                  <h3>Villager Scheme Applications</h3>
                  <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
                    <thead>
                      <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                        <th style={{padding: '1rem'}}>Villager</th>
                        <th style={{padding: '1rem'}}>Scheme</th>
                        <th style={{padding: '1rem'}}>Date</th>
                        <th style={{padding: '1rem'}}>Status</th>
                        <th style={{padding: '1rem'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allApplications.map(app => (
                        <tr key={app.id} style={{borderBottom: '1px solid #eee'}}>
                          <td style={{padding: '1rem'}}>{app.user?.fullName || 'N/A'} ({app.user?.username || 'N/A'})</td>
                          <td style={{padding: '1rem'}}>{app.scheme?.name || 'N/A'}</td>
                          <td style={{padding: '1rem'}}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                          <td style={{padding: '1rem'}}>
                            <span className={`badge ${app.status === 'APPROVED' ? 'badge-low' : app.status === 'REJECTED' ? 'badge-high' : 'badge-medium'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{padding: '1rem'}}>
                            {app.status === 'PENDING' && (
                              <div style={{display: 'flex', gap: '0.25rem'}}>
                                <button onClick={() => handleUpdateApplicationStatus(app.id, 'APPROVED')} style={{width: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: 'var(--success)'}}>Approve</button>
                                <button onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED')} style={{width: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: 'var(--error)'}}>Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {allApplications.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No applications submitted yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal system for adding data */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, textTransform: 'capitalize'}}>Add New {formType}</h3>
              <button onClick={() => setShowForm(false)} className="btn-ghost" style={{width: 'auto', padding: '0.25rem', marginTop: 0}}>✕</button>
            </div>
            
            <form onSubmit={handleSubmitForm}>
              {formType === 'complaint' && (
                <>
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" placeholder="Complaint title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {['Water Supply', 'Electricity', 'Road Damage', 'Garbage', 'Drainage', 'Health', 'Street Lights', 'Internet/Network', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Ward / Location</label>
                    <select value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
                      {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea placeholder="Describe the issue in detail" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Image URL (Optional)</label>
                    <input type="text" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                </>
              )}

              {formType === 'notice' && (
                <>
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" placeholder="Notice title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Notice Type</label>
                    <select value={formData.noticeType} onChange={e => setFormData({...formData, noticeType: e.target.value})}>
                      {['GENERAL', 'EMERGENCY', 'SCHEME', 'EVENT', 'MAINTENANCE'].map(nt => (
                        <option key={nt} value={nt}>{nt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Content</label>
                    <textarea placeholder="Notice content" rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
                  </div>
                </>
              )}

              {formType === 'meeting' && (
                <>
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" placeholder="Meeting title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" value={formData.dateTime} onChange={e => setFormData({...formData, dateTime: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input type="text" placeholder="e.g. Panchayat Bhavan" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Organizer</label>
                    <input type="text" placeholder="e.g. Gram Panchayat" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Agenda</label>
                    <textarea placeholder="Meeting agenda details" rows={3} value={formData.agenda} onChange={e => setFormData({...formData, agenda: e.target.value})} />
                  </div>
                </>
              )}

              {formType === 'scheme' && (
                <>
                  <div className="input-group">
                    <label>Scheme Name</label>
                    <input type="text" placeholder="e.g. Ayushman Bharat" value={formData.schemeName} onChange={e => setFormData({...formData, schemeName: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Department</label>
                    <input type="text" placeholder="e.g. Health" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Eligibility Criteria</label>
                    <input type="text" placeholder="e.g. Low income families" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea placeholder="Briefly describe the scheme" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Image URL (Optional)</label>
                    <input type="text" placeholder="Image link" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                </>
              )}

              {formType === 'emergency' && (
                <>
                  <div className="input-group">
                    <label>Contact Name</label>
                    <input type="text" placeholder="e.g. Hospital Helpline" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" placeholder="e.g. 102 or 98xxx-xxxxx" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <select value={formData.emergencyCategory} onChange={e => setFormData({...formData, emergencyCategory: e.target.value})}>
                      {['Ambulance', 'Police', 'Fire', 'Sarpanch', 'Other'].map(ecat => (
                        <option key={ecat} value={ecat}>{ecat}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {formType === 'stock' && (
                <>
                  <div className="input-group">
                    <label>Item Name</label>
                    <input type="text" placeholder="e.g. Wheat, Rice" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Quantity</label>
                    <input type="number" step="any" placeholder="e.g. 500" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Unit</label>
                    <input type="text" placeholder="e.g. KG, Litres" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} required />
                  </div>
                </>
              )}

              {formType === 'distribute' && (
                <>
                  <div className="input-group">
                    <label>Select Villager</label>
                    <select value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
                      {villagers.map(v => (
                        <option key={v.id} value={v.id}>{v.fullName} ({v.username})</option>
                      ))}
                      {villagers.length === 0 && (
                        <option value="">No villagers found</option>
                      )}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Select Item</label>
                    <select value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} required>
                      {rationStock.map(s => (
                        <option key={s.id} value={s.itemName}>{s.itemName} ({s.quantity} {s.unit} available)</option>
                      ))}
                      {rationStock.length === 0 && (
                        <option value="">No items in stock</option>
                      )}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Quantity to Distribute</label>
                    <input type="number" step="any" placeholder="e.g. 10" value={formData.distributeQuantity} onChange={e => setFormData({...formData, distributeQuantity: e.target.value})} required />
                  </div>
                </>
              )}

              <button type="submit" style={{marginTop: '1rem'}}>Submit</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .tab { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 8px; color: var(--text-muted); font-size: 0.85rem; white-space: nowrap; }
        .active-tab { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 8px; background: var(--primary); color: white; font-weight: 600; font-size: 0.85rem; white-space: nowrap; }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
