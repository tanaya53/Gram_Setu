import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaintSubTab, setComplaintSubTab] = useState('active');
  const [meetingSubTab, setMeetingSubTab] = useState('upcoming');
  const [schemeSubTab, setSchemeSubTab] = useState('active');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
      console.error('Fetch error:', err); 
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 400);
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

  const tabsConfig = [
    { id: 'complaints', label: 'Complaints', icon: '🚨', count: complaints.length },
    { id: 'notices', label: 'Warnings & Notices', icon: '📢', count: notices.length },
    { id: 'meetings', label: 'Meetings', icon: '📅', count: meetings.length },
    { id: 'schemes', label: 'Govt Schemes', icon: '📄', count: schemes.length },
    { id: 'ration', label: 'Ration & Stock', icon: '🌾', count: rationStock.length },
    { id: 'emergency', label: 'Emergency Contacts', icon: '📞', count: emergencyContacts.length }
  ];

  const roleClean = user?.role?.replace('ROLE_', '').toLowerCase();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isVillager = user?.role === 'ROLE_VILLAGER';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Main Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="brand-icon">🌾</div>
            <div>
              <div className="brand-title">Gram Setu</div>
              {user?.villageName && (
                <span className="village-pill">
                  📍 {user.villageName} ({user.villageId || 'VILL001'})
                </span>
              )}
            </div>
          </div>
          
          <div className="nav-actions">
            <div style={{ display: 'none', md: 'block' }} className="user-info-pill">
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {user?.fullName || user?.username}
              </span>
            </div>
            <button 
              onClick={logout} 
              className="btn-ghost btn-sm" 
              style={{ width: 'auto', borderRadius: '8px' }}
              title="Sign Out"
            >
              Sign Out 🚪
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Horizontal Scrollable Tabs Bar */}
      <div className="tabs-wrapper">
        <div className="tabs-container">
          {tabsConfig.map(tab => (
            <button 
              key={tab.id}
              type="button"
              className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '9999px',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '700'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="dashboard-container" style={{ flexGrow: 1 }}>
        {/* Welcome & Role Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '800' }}>
                Welcome, {user?.fullName || user?.username}
              </h1>
              <span className={`badge ${isAdmin ? 'badge-info' : 'badge-low'}`}>
                {isAdmin ? '🏛️ Panchayat Admin' : '👤 Villager / Citizen'}
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Village: <strong>{user?.villageName || 'Rampur'}</strong> | Code: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{user?.villageId || 'VILL001'}</code>
            </p>
          </div>

          <button 
            type="button"
            onClick={handleManualRefresh}
            className="btn-ghost btn-sm"
            style={{ width: 'auto', borderRadius: '8px' }}
          >
            <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>🔄</span>
            <span>Refresh Board</span>
          </button>
        </div>

        {/* Action Bar Header */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.35rem' }}>
              {activeTab === 'notices' ? 'Warnings & Notices' : `${activeTab} Management`}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {activeTab === 'complaints' && 'Community issues reported and voted by villagers'}
              {activeTab === 'notices' && 'Urgent alerts, weather warnings, and announcements'}
              {activeTab === 'meetings' && 'Gram Sabha conferences and committee agendas'}
              {activeTab === 'schemes' && 'Government welfare schemes and citizen applications'}
              {activeTab === 'ration' && 'Public distribution system stock levels & logs'}
              {activeTab === 'emergency' && 'Instant contact directory for urgent services'}
            </div>
          </div>

          {/* Quick Action Buttons per Tab & Role */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: 'auto' }}>
            {isVillager && activeTab === 'complaints' && (
              <button onClick={() => openForm('complaint')} className="btn-sm" style={{ width: 'auto' }}>
                🚨 File a Complaint
              </button>
            )}

            {isAdmin && (
              <>
                {activeTab === 'notices' && (
                  <button onClick={() => openForm('notice')} className="btn-sm" style={{ width: 'auto' }}>
                    📢 Add Notice / Warning
                  </button>
                )}
                {activeTab === 'meetings' && (
                  <button onClick={() => openForm('meeting')} className="btn-sm" style={{ width: 'auto' }}>
                    📅 Schedule Meeting
                  </button>
                )}
                {activeTab === 'schemes' && (
                  <button onClick={() => openForm('scheme')} className="btn-sm" style={{ width: 'auto' }}>
                    📄 Create Scheme
                  </button>
                )}
                {activeTab === 'emergency' && (
                  <button onClick={() => openForm('emergency')} className="btn-sm" style={{ width: 'auto' }}>
                    📞 Add Contact
                  </button>
                )}
                {activeTab === 'ration' && (
                  <>
                    <button onClick={() => openForm('stock')} className="btn-sm btn-secondary" style={{ width: 'auto' }}>
                      📦 Manage Stock
                    </button>
                    <button onClick={() => openForm('distribute')} className="btn-sm" style={{ width: 'auto' }}>
                      🌾 Distribute Ration
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sub-Tabs for specific sections */}
        {activeTab === 'complaints' && (
          <div className="subtabs-bar">
            <span 
              className={`subtab-pill ${complaintSubTab === 'active' ? 'active' : ''}`}
              onClick={() => setComplaintSubTab('active')}
            >
              🚨 Active Complaints ({complaints.filter(c => c.status !== 'RESOLVED').length})
            </span>
            <span 
              className={`subtab-pill ${complaintSubTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setComplaintSubTab('resolved')}
            >
              ✅ Resolved Complaints ({complaints.filter(c => c.status === 'RESOLVED').length})
            </span>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="subtabs-bar">
            <span 
              className={`subtab-pill ${meetingSubTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setMeetingSubTab('upcoming')}
            >
              📅 Upcoming ({meetings.filter(m => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS').length})
            </span>
            <span 
              className={`subtab-pill ${meetingSubTab === 'completed' ? 'active' : ''}`}
              onClick={() => setMeetingSubTab('completed')}
            >
              ✅ Past / Completed ({meetings.filter(m => m.status === 'COMPLETED' || m.status === 'CANCELLED').length})
            </span>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="subtabs-bar">
            <span 
              className={`subtab-pill ${schemeSubTab === 'active' ? 'active' : ''}`}
              onClick={() => setSchemeSubTab('active')}
            >
              🟢 Active Schemes ({schemes.filter(s => s.active).length})
            </span>
            <span 
              className={`subtab-pill ${schemeSubTab === 'closed' ? 'active' : ''}`}
              onClick={() => setSchemeSubTab('closed')}
            >
              📁 Closed Schemes ({schemes.filter(s => !s.active).length})
            </span>
          </div>
        )}

        {/* Main Grid & Views */}
        <div className="dashboard-grid">
          {/* 1. COMPLAINTS TAB */}
          {activeTab === 'complaints' && complaints
            .filter(c => complaintSubTab === 'active' ? c.status !== 'RESOLVED' : c.status === 'RESOLVED')
            .map(c => (
              <div key={c.id} className="item-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span className="badge badge-low">{c.category}</span>
                    <span className={`badge badge-${c.priority ? c.priority.toLowerCase() : 'low'}`}>
                      {c.priority} Priority
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  {c.ward && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      📍 <strong>Location:</strong> {c.ward}
                    </div>
                  )}
                  {c.imageUrl && (
                    <img 
                      src={c.imageUrl} 
                      alt={c.title} 
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.75rem', border: '1px solid var(--border)' }} 
                    />
                  )}
                </div>

                <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      Status: <span className={`badge ${
                        c.status === 'RESOLVED' ? 'badge-success' : c.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                      }`}>{c.status}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                      🗳️ {c.voteCount} votes
                    </div>
                  </div>

                  {isVillager && (
                    <button 
                      onClick={() => handleVote(c.id)} 
                      className="btn-ghost btn-sm" 
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                      👍 Upvote Issue ({c.voteCount})
                    </button>
                  )}

                  {isAdmin && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', marginBottom: '0.2rem' }}>Status</label>
                          <select 
                            value={c.status} 
                            onChange={(e) => handleUpdateComplaintStatus(c.id, e.target.value)} 
                            style={{ minHeight: '36px', padding: '0.3rem', fontSize: '0.8rem' }}
                          >
                            {['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', marginBottom: '0.2rem' }}>Priority</label>
                          <select 
                            value={c.priority} 
                            onChange={(e) => handleUpdateComplaintPriority(c.id, e.target.value)} 
                            style={{ minHeight: '36px', padding: '0.3rem', fontSize: '0.8rem' }}
                          >
                            {['LOW', 'MEDIUM', 'HIGH'].map(pr => (
                              <option key={pr} value={pr}>{pr}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {c.status === 'RESOLVED' && (
                        <button 
                          onClick={() => handleDeleteComplaint(c.id)}
                          className="btn-danger btn-sm"
                          style={{ marginTop: '0.75rem', width: '100%' }}
                        >
                          Delete Resolved Issue 🗑️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
          ))}

          {/* 2. NOTICES & WARNINGS TAB */}
          {activeTab === 'notices' && notices.map(n => (
            <div 
              key={n.id} 
              className="item-card"
              style={{
                borderLeft: n.type === 'EMERGENCY' ? '4px solid var(--error)' : n.type === 'MAINTENANCE' ? '4px solid var(--warning)' : '1px solid var(--border)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span className={`badge ${
                    n.type === 'EMERGENCY' ? 'badge-emergency' : n.type === 'MAINTENANCE' ? 'badge-warning' : n.type === 'EVENT' ? 'badge-info' : 'badge-low'
                  }`}>
                    {n.type === 'EMERGENCY' && '⚠️ '}
                    {n.type}
                  </span>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <h3>{n.title}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{n.content}</p>
              </div>

              {isAdmin && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                  <button 
                    onClick={() => handleDeleteNotice(n.id)} 
                    className="btn-ghost btn-sm"
                    style={{ width: 'auto', color: 'var(--error)', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                  >
                    Delete Notice 🗑️
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* 3. MEETINGS TAB */}
          {activeTab === 'meetings' && meetings
            .filter(m => meetingSubTab === 'upcoming' ? (m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS') : (m.status === 'COMPLETED' || m.status === 'CANCELLED'))
            .map(m => (
              <div key={m.id} className="item-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span className={`badge ${
                      m.status === 'COMPLETED' ? 'badge-success' : m.status === 'CANCELLED' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {m.status}
                    </span>
                    <small style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.78rem' }}>
                      {new Date(m.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </small>
                  </div>
                  <h3>{m.title}</h3>
                  <p><strong>Agenda:</strong> {m.agenda}</p>
                  
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div>📍 <strong>Location:</strong> {m.location}</div>
                    {m.organizer && <div>👤 <strong>Organizer:</strong> {m.organizer}</div>}
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <label style={{ fontSize: '0.72rem', marginBottom: '0.2rem' }}>Update Status</label>
                    <select 
                      value={m.status} 
                      onChange={(e) => handleUpdateMeetingStatus(m.id, e.target.value)} 
                      style={{ minHeight: '36px', padding: '0.3rem', fontSize: '0.85rem', width: '100%', marginBottom: '0.5rem' }}
                    >
                      {['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    {(m.status === 'COMPLETED' || m.status === 'CANCELLED') && (
                      <button
                        onClick={() => handleDeleteMeeting(m.id)}
                        className="btn-danger btn-sm"
                        style={{ width: '100%' }}
                      >
                        Delete Meeting Record 🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
          ))}

          {/* 4. EMERGENCY CONTACTS TAB */}
          {activeTab === 'emergency' && emergencyContacts.map(ec => (
            <div 
              key={ec.id} 
              className="item-card" 
              style={{ borderTop: '4px solid var(--error)' }}
            >
              <div>
                <span className="badge badge-emergency" style={{ marginBottom: '0.5rem' }}>
                  {ec.category || 'Emergency Service'}
                </span>
                <h3>{ec.name}</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.75rem 0' }}>
                  📞 {ec.phoneNumber}
                </div>
              </div>
              <a 
                href={`tel:${ec.phoneNumber}`} 
                className="btn btn-danger btn-sm" 
                style={{ width: '100%', textDecoration: 'none', marginTop: '0.75rem' }}
              >
                Call Hotline Now 📞
              </a>
            </div>
          ))}

          {/* 5. RATION TAB */}
          {activeTab === 'ration' && (
            <div style={{ width: '100%', gridColumn: '1 / -1' }}>
              <div className="card" style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📦 Current Stock Availability in Village Depot</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                  {rationStock.map(s => (
                    <div 
                      key={s.id} 
                      style={{ 
                        background: '#f8fafc', 
                        padding: '1.25rem 1rem', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        textAlign: 'center',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{s.itemName}</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', margin: '0.25rem 0' }}>
                        {s.quantity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.unit} in depot</div>
                    </div>
                  ))}
                  {rationStock.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>No ration stock items registered yet.</p>
                  )}
                </div>
              </div>

              {/* Villager Ration Logs */}
              {isVillager && (
                <div className="card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🌾 Your Ration Distribution History</h3>
                  {myRationLogs.length > 0 ? (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Quantity Received</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myRationLogs.map(l => (
                            <tr key={l.id}>
                              <td>{new Date(l.distributionDate).toLocaleDateString()}</td>
                              <td><strong>{l.itemName}</strong></td>
                              <td>{l.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No distribution records found for your account.</p>
                  )}
                </div>
              )}

              {/* Admin All Ration Logs */}
              {isAdmin && (
                <div className="card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📋 Villager Distribution Registry</h3>
                  {allRationLogs.length > 0 ? (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Recipient Villager</th>
                            <th>Date</th>
                            <th>Commodity</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allRationLogs.map(l => (
                            <tr key={l.id}>
                              <td>
                                <strong>{l.recipient?.fullName || 'N/A'}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{l.recipient?.username || 'N/A'}</div>
                              </td>
                              <td>{new Date(l.distributionDate).toLocaleDateString()}</td>
                              <td>{l.itemName}</td>
                              <td><strong>{l.quantity}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No distribution logs recorded yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 6. SCHEMES TAB */}
          {activeTab === 'schemes' && (
            <div style={{ width: '100%', gridColumn: '1 / -1' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {schemes
                  .filter(s => schemeSubTab === 'active' ? s.active : !s.active)
                  .map(s => {
                    const myApp = myApplications.find(app => app.scheme?.id === s.id);
                    return (
                      <div key={s.id} className="item-card">
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <span className="badge badge-info">{s.department}</span>
                            <span className={`badge ${s.active ? 'badge-success' : 'badge-neutral'}`}>
                              {s.active ? 'Active' : 'Closed'}
                            </span>
                          </div>
                          <h3>{s.name}</h3>
                          <p>{s.description}</p>
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                            <strong>Eligibility:</strong> {s.eligibility}
                          </div>
                        </div>

                        {/* Villager Action */}
                        {isVillager && (
                          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                            {myApp ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Application:</span>
                                <span className={`badge ${
                                  myApp.status === 'APPROVED' ? 'badge-success' : myApp.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                                }`}>
                                  {myApp.status}
                                </span>
                              </div>
                            ) : s.active ? (
                              <button 
                                onClick={() => handleApplyScheme(s.id)} 
                                className="btn-sm" 
                                style={{ width: '100%' }}
                              >
                                Interested to Apply ✍️
                              </button>
                            ) : (
                              <span className="badge badge-neutral" style={{ width: '100%', justifyContent: 'center' }}>
                                Applications Closed
                              </span>
                            )}
                          </div>
                        )}

                        {/* Admin Action */}
                        {isAdmin && (
                          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                            {s.active ? (
                              <button 
                                onClick={() => handleUpdateSchemeStatus(s.id, false)}
                                className="btn-secondary btn-sm"
                                style={{ width: '100%' }}
                              >
                                Close Scheme Applications 📁
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleDeleteScheme(s.id)}
                                className="btn-danger btn-sm"
                                style={{ width: '100%' }}
                              >
                                Delete Scheme Permanently 🗑️
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Admin Applications Review Table */}
              {isAdmin && (
                <div className="card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📄 Villager Scheme Applications Review</h3>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Villager</th>
                          <th>Applied Scheme</th>
                          <th>Application Date</th>
                          <th>Status</th>
                          <th>Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allApplications.map(app => (
                          <tr key={app.id}>
                            <td>
                              <strong>{app.user?.fullName || 'N/A'}</strong>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{app.user?.username || 'N/A'}</div>
                            </td>
                            <td><strong>{app.scheme?.name || 'N/A'}</strong></td>
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${
                                app.status === 'APPROVED' ? 'badge-success' : app.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td>
                              {app.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                  <button 
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'APPROVED')} 
                                    className="btn-sm" 
                                    style={{ width: 'auto', background: 'var(--success)' }}
                                  >
                                    Approve ✓
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED')} 
                                    className="btn-sm btn-danger" 
                                    style={{ width: 'auto' }}
                                  >
                                    Reject ✕
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {allApplications.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                              No applications submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Dynamic Modal Form System */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.25rem' }}>
                Add New {formType}
              </h3>
              <button 
                type="button"
                onClick={() => setShowForm(false)} 
                className="btn-ghost" 
                style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', minHeight: 'auto' }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm}>
              {/* Form: Complaint */}
              {formType === 'complaint' && (
                <>
                  <div className="input-group">
                    <label>Complaint Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Broken Handpump or Road Potholes" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
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
                    <label>Ward / Locality</label>
                    <select value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
                      {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Detailed Description</label>
                    <textarea 
                      placeholder="Describe the problem, severity and exact spot" 
                      rows={3} 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Image URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..." 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    />
                  </div>
                </>
              )}

              {/* Form: Notice / Warning */}
              {formType === 'notice' && (
                <>
                  <div className="input-group">
                    <label>Notice / Warning Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Heavy Rain Alert or Power Shutdown" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
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
                    <label>Announcement Details</label>
                    <textarea 
                      placeholder="Enter detailed notice content or instructions" 
                      rows={4} 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})} 
                      required 
                    />
                  </div>
                </>
              )}

              {/* Form: Meeting */}
              {formType === 'meeting' && (
                <>
                  <div className="input-group">
                    <label>Meeting Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Monthly Gram Sabha Meeting" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={formData.dateTime} 
                      onChange={e => setFormData({...formData, dateTime: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Location / Venue</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Panchayat Bhavan Hall" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Organizer</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sarpanch Office" 
                      value={formData.organizer} 
                      onChange={e => setFormData({...formData, organizer: e.target.value})} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Meeting Agenda Details</label>
                    <textarea 
                      placeholder="Key discussion points and topics" 
                      rows={3} 
                      value={formData.agenda} 
                      onChange={e => setFormData({...formData, agenda: e.target.value})} 
                    />
                  </div>
                </>
              )}

              {/* Form: Scheme */}
              {formType === 'scheme' && (
                <>
                  <div className="input-group">
                    <label>Scheme Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. PM-KISAN Samman Nidhi" 
                      value={formData.schemeName} 
                      onChange={e => setFormData({...formData, schemeName: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Nodal Department</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Agriculture & Farmers Welfare" 
                      value={formData.department} 
                      onChange={e => setFormData({...formData, department: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Eligibility Criteria</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Small & marginal farmers" 
                      value={formData.eligibility} 
                      onChange={e => setFormData({...formData, eligibility: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Brief Description & Benefits</label>
                    <textarea 
                      placeholder="Describe what assistance or financial subsidy is provided" 
                      rows={3} 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      required 
                    />
                  </div>
                </>
              )}

              {/* Form: Emergency Contact */}
              {formType === 'emergency' && (
                <>
                  <div className="input-group">
                    <label>Contact Name / Department</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Primary Health Centre Ambulance" 
                      value={formData.contactName} 
                      onChange={e => setFormData({...formData, contactName: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone Number / Hotline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 102 or 98765-43210" 
                      value={formData.phoneNumber} 
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Service Category</label>
                    <select value={formData.emergencyCategory} onChange={e => setFormData({...formData, emergencyCategory: e.target.value})}>
                      {['Ambulance', 'Police', 'Fire', 'Sarpanch', 'Hospital', 'Disaster Relief', 'Women Helpline', 'Veterinary', 'Other'].map(ecat => (
                        <option key={ecat} value={ecat}>{ecat}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Form: Stock */}
              {formType === 'stock' && (
                <>
                  <div className="input-group">
                    <label>Item / Commodity Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Wheat, Rice, Fortified Oil" 
                      value={formData.itemName} 
                      onChange={e => setFormData({...formData, itemName: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Stock Quantity</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="e.g. 500" 
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Measurement Unit</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KG, Litres, Bags" 
                      value={formData.unit} 
                      onChange={e => setFormData({...formData, unit: e.target.value})} 
                      required 
                    />
                  </div>
                </>
              )}

              {/* Form: Distribute */}
              {formType === 'distribute' && (
                <>
                  <div className="input-group">
                    <label>Select Villager</label>
                    <select 
                      value={formData.userId} 
                      onChange={e => setFormData({...formData, userId: e.target.value})} 
                      required
                    >
                      {villagers.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.fullName} (@{v.username}) {v.ward ? `- ${v.ward}` : ''}
                        </option>
                      ))}
                      {villagers.length === 0 && (
                        <option value="">No villagers registered in village</option>
                      )}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Select Commodity Item</label>
                    <select 
                      value={formData.itemName} 
                      onChange={e => setFormData({...formData, itemName: e.target.value})} 
                      required
                    >
                      {rationStock.map(s => (
                        <option key={s.id} value={s.itemName}>
                          {s.itemName} ({s.quantity} {s.unit} in stock)
                        </option>
                      ))}
                      {rationStock.length === 0 && (
                        <option value="">No stock items available</option>
                      )}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Quantity to Distribute</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="e.g. 15" 
                      value={formData.distributeQuantity} 
                      onChange={e => setFormData({...formData, distributeQuantity: e.target.value})} 
                      required 
                    />
                  </div>
                </>
              )}

              <button type="submit" style={{ marginTop: '1rem' }}>
                Confirm & Submit Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
