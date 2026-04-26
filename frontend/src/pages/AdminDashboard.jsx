import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'users', 'courses', 'quizzes', 'announcements'

    // Modal state for adding a user
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ prenom: '', nom: '', email: '', password: '', role: 'user' });

    // Modal state for Announcements
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [newAnnouncementForm, setNewAnnouncementForm] = useState({ title: '', message: '', type: 'info' });
    const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);

    // Modal state for Course
    // Modal state for Course
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseForm, setNewCourseForm] = useState({ title: '', category: '', level: 'Débutant', duration: '', description: '', tags: '', thumbnail: null, modules: [] });

    // Category Color Helper
    const getCategoryColor = (category) => {
        if (!category) return { bg: '#f1f5f9', text: '#475569' };
        const cat = category.toLowerCase();
        if (cat.includes('java') && !cat.includes('javascript')) return { bg: '#fee2e2', text: '#ef4444' };
        if (cat.includes('python')) return { bg: '#fef3c7', text: '#f59e0b' };
        if (cat.includes('javascript') || cat.includes('js') || cat.includes('react')) return { bg: '#fef08a', text: '#ca8a04' };
        if (cat.includes('html') || cat.includes('css')) return { bg: '#e0e7ff', text: '#4f46e5' };
        if (cat.includes('sql') || cat.includes('data')) return { bg: '#d1fae5', text: '#059669' };
        if (cat.includes('cyber')) return { bg: '#fce7f3', text: '#db2777' };
        
        // Default hash color
        const colors = [
            { bg: '#e0f2fe', text: '#0284c7' },
            { bg: '#f3e8ff', text: '#9333ea' },
            { bg: '#ffedd5', text: '#ea580c' },
            { bg: '#dcfce7', text: '#16a34a' }
        ];
        let hash = 0;
        for (let i = 0; i < cat.length; i++) { hash = cat.charCodeAt(i) + ((hash << 5) - hash); }
        return colors[Math.abs(hash) % colors.length];
    };

    // --- Course Helpers ---
    const addModuleField = () => {
        setNewCourseForm({
            ...newCourseForm,
            modules: [...newCourseForm.modules, { title: '', lessons: [] }]
        });
    };

    const addLessonField = (mIndex) => {
        const updatedModules = [...newCourseForm.modules];
        updatedModules[mIndex].lessons.push({ title: '', duration: '', type: 'video', video_url: '' });
        setNewCourseForm({ ...newCourseForm, modules: updatedModules });
    };

    const updateModuleTitle = (mIndex, title) => {
        const updatedModules = [...newCourseForm.modules];
        updatedModules[mIndex].title = title;
        setNewCourseForm({ ...newCourseForm, modules: updatedModules });
    };

    const updateLesson = (mIndex, lIndex, field, value) => {
        const updatedModules = [...newCourseForm.modules];
        updatedModules[mIndex].lessons[lIndex][field] = value;
        setNewCourseForm({ ...newCourseForm, modules: updatedModules });
    };

    // Modal state for Quiz
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [newQuizForm, setNewQuizForm] = useState({ title: '', category: '', questions: [] });

    // Function to add an empty question
    const addQuestionField = () => {
        setNewQuizForm({
            ...newQuizForm,
            questions: [
                ...newQuizForm.questions, 
                { text: '', options: [{text: '', is_correct: true}, {text: '', is_correct: false}] }
            ]
        });
    };

    // Function to add an option to a question
    const addOptionField = (qIndex) => {
        const updatedQuestions = [...newQuizForm.questions];
        updatedQuestions[qIndex].options.push({text: '', is_correct: false});
        setNewQuizForm({ ...newQuizForm, questions: updatedQuestions });
    };

    // Update question text
    const updateQuestionText = (qIndex, text) => {
        const updatedQuestions = [...newQuizForm.questions];
        updatedQuestions[qIndex].text = text;
        setNewQuizForm({ ...newQuizForm, questions: updatedQuestions });
    };

    // Update option text and correct status
    const updateOption = (qIndex, optIndex, field, value) => {
        const updatedQuestions = [...newQuizForm.questions];
        if (field === 'is_correct' && value === true) {
            updatedQuestions[qIndex].options.forEach(opt => opt.is_correct = false);
        }
        updatedQuestions[qIndex].options[optIndex][field] = value;
        setNewQuizForm({ ...newQuizForm, questions: updatedQuestions });
    };

    useEffect(() => {
        fetchAdminData();
        fetchUsers();
        fetchCourses();
        fetchQuizzes();
        fetchAnnouncements();
    }, []);

    const fetchAdminData = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/admin/dashboard", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setData(await res.json());
        } catch (error) { console.error("Error fetching admin stats:", error); } 
        finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/admin/users", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setUsers(await res.json());
        } catch (error) { console.error("Error fetching users:", error); }
    };

    const fetchCourses = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/courses", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setCourses(await res.json());
        } catch (error) { console.error("Error fetching courses:", error); }
    };

    const fetchQuizzes = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/quizzes", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setQuizzes(await res.json());
        } catch (error) { console.error("Error fetching quizzes:", error); }
    };

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/announcements", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setAnnouncements(await res.json());
        } catch (error) { console.error("Error fetching announcements:", error); }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/admin/users", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(newUserForm)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewUserForm({ prenom: '', nom: '', email: '', password: '', role: 'user' });
                fetchUsers();
            } else { alert("Erreur lors de la création de l'utilisateur."); }
        } catch (error) { console.error(error); }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const url = editingAnnouncementId 
            ? `http://127.0.0.1:8000/api/auth/admin/announcements/${editingAnnouncementId}` 
            : "http://127.0.0.1:8000/api/auth/admin/announcements";
        const method = editingAnnouncementId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(newAnnouncementForm)
            });
            if (res.ok) {
                setShowAnnouncementModal(false);
                setNewAnnouncementForm({ title: '', message: '', type: 'info' });
                setEditingAnnouncementId(null);
                fetchAnnouncements();
            } else { alert("Erreur lors de la sauvegarde de l'annonce."); }
        } catch (error) { console.error(error); }
    };

    const openEditAnnouncement = (ann) => {
        setNewAnnouncementForm({ title: ann.title, message: ann.message, type: ann.type });
        setEditingAnnouncementId(ann.id);
        setShowAnnouncementModal(true);
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/admin/announcements/${id}`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) fetchAnnouncements();
        } catch (error) { console.error(error); }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const formData = new FormData();
            formData.append('title', newCourseForm.title);
            formData.append('category', newCourseForm.category);
            formData.append('level', newCourseForm.level);
            formData.append('duration', newCourseForm.duration);
            formData.append('description', newCourseForm.description);
            
            const tagsArray = newCourseForm.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
            tagsArray.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
            
            newCourseForm.modules.forEach((module, mIndex) => {
                formData.append(`modules[${mIndex}][title]`, module.title);
                formData.append(`modules[${mIndex}][order]`, mIndex + 1);
                module.lessons.forEach((lesson, lIndex) => {
                    formData.append(`modules[${mIndex}][lessons][${lIndex}][title]`, lesson.title);
                    formData.append(`modules[${mIndex}][lessons][${lIndex}][duration]`, lesson.duration);
                    formData.append(`modules[${mIndex}][lessons][${lIndex}][type]`, lesson.type);
                    if(lesson.video_url) formData.append(`modules[${mIndex}][lessons][${lIndex}][video_url]`, lesson.video_url);
                });
            });

            if (newCourseForm.thumbnail) {
                formData.append('thumbnail', newCourseForm.thumbnail);
            }

            const res = await fetch("http://127.0.0.1:8000/api/auth/admin/courses", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                body: formData
            });
            if (res.ok) {
                setShowCourseModal(false);
                setNewCourseForm({ title: '', category: '', level: 'Débutant', duration: '', description: '', tags: '', thumbnail: null, modules: [] });
                fetchCourses();
            } else { alert("Erreur lors de la création du cours."); }
        } catch (error) { console.error(error); }
    };

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/admin/quizzes", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(newQuizForm)
            });
            if (res.ok) {
                setShowQuizModal(false);
                setNewQuizForm({ title: '', category: '', questions: [] });
                fetchQuizzes();
            } else { alert("Erreur lors de la création du quiz."); }
        } catch (error) { console.error(error); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/admin/users/${id}`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) fetchUsers();
            else alert("Impossible de supprimer cet utilisateur.");
        } catch (error) { console.error(error); }
    };

    const handleRoleChange = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Changer le rôle en ${newRole} ?`)) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/admin/users/${id}/role`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) fetchUsers();
            else alert("Erreur lors de la modification du rôle.");
        } catch (error) { console.error(error); }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/admin/courses/${id}`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) fetchCourses();
        } catch (error) { console.error(error); }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/admin/quizzes/${id}`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) fetchQuizzes();
        } catch (error) { console.error(error); }
    };

    if (loading) return <div style={{padding: '50px', textAlign:'center'}}>Chargement du tableau de bord...</div>;
    if (!data) return <div style={{padding: '50px', textAlign:'center'}}>Erreur de chargement.</div>;

    const { stats, registrations_chart, quiz_status_chart } = data;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-title">
                    <h1>Tableau de bord Admin</h1>
                    <div className="breadcrumb">Admin / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
                </div>
                <div className="admin-header-actions">
                    <div className="admin-profile">
                        <div className="admin-avatar">AD</div>
                        <span className="admin-name">Administrateur</span>
                    </div>
                </div>
            </header>

            <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                <button onClick={() => setActiveTab('stats')} style={{ padding: '10px 20px', fontWeight: '500', background: activeTab === 'stats' ? '#3b82f6' : '#fff', color: activeTab === 'stats' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>Vue d'ensemble</button>
                <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', fontWeight: '500', background: activeTab === 'users' ? '#3b82f6' : '#fff', color: activeTab === 'users' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>Utilisateurs</button>
                <button onClick={() => setActiveTab('courses')} style={{ padding: '10px 20px', fontWeight: '500', background: activeTab === 'courses' ? '#3b82f6' : '#fff', color: activeTab === 'courses' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>Cours</button>
                <button onClick={() => setActiveTab('quizzes')} style={{ padding: '10px 20px', fontWeight: '500', background: activeTab === 'quizzes' ? '#3b82f6' : '#fff', color: activeTab === 'quizzes' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>Quiz</button>
                <button onClick={() => setActiveTab('announcements')} style={{ padding: '10px 20px', fontWeight: '500', background: activeTab === 'announcements' ? '#3b82f6' : '#fff', color: activeTab === 'announcements' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>Annonces</button>
            </div>

            {activeTab === 'stats' && (
                <>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper blue"><i className="fas fa-users"></i></div>
                                <span className="trend-badge positive"><i className="fas fa-arrow-up"></i> {stats.total_users_trend}</span>
                            </div>
                            <h2 className="stat-value">{stats.total_users.toLocaleString()}</h2>
                            <p className="stat-label">Utilisateurs totaux</p>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper green"><i className="fas fa-user-plus"></i></div>
                                <span className="trend-badge positive"><i className="fas fa-arrow-up"></i> {stats.new_users_trend}</span>
                            </div>
                            <h2 className="stat-value">{stats.new_users.toLocaleString()}</h2>
                            <p className="stat-label">Nouveaux ce mois</p>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper yellow"><i className="fas fa-question-circle"></i></div>
                                <span className="trend-badge positive"><i className="fas fa-arrow-up"></i> {stats.completed_quizzes_trend}</span>
                            </div>
                            <h2 className="stat-value">{stats.completed_quizzes.toLocaleString()}</h2>
                            <p className="stat-label">Quiz complétés</p>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper red"><i className="fas fa-clock"></i></div>
                            </div>
                            <h2 className="stat-value">{stats.average_time}</h2>
                            <p className="stat-label">Score moyen général</p>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="admin-card">
                            <div className="card-title-flex"><h3>Inscriptions utilisateurs</h3></div>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={registrations_chart}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} />
                                        <LineTooltip />
                                        <Line type="monotone" dataKey="users" stroke="#0d6efd" strokeWidth={3} dot={{r: 4, fill: '#0d6efd', strokeWidth: 2, stroke: 'white'}} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="admin-card">
                            <div className="card-title-flex"><h3>Quiz complétés</h3></div>
                            <div className="chart-wrapper" style={{height: '250px'}}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={quiz_status_chart} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                                            {quiz_status_chart.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                                        </Pie>
                                        <PieTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="doughnut-legend">
                                {quiz_status_chart.map((item, index) => (
                                    <div key={index} className="legend-item">
                                        <div className="legend-color" style={{backgroundColor: item.fill}}></div>
                                        <span>{item.name} ({item.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="admin-card">
                    <div className="card-title-flex">
                        <h3>Gestion des utilisateurs</h3>
                        <button className="btn-action" onClick={() => setShowAddModal(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                            <i className="fas fa-plus"></i> Ajouter un utilisateur
                        </button>
                    </div>
                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead><tr><th>UTILISATEUR</th><th>RÔLE</th><th>INSCRIPTION</th><th>ACTIONS</th></tr></thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-initials" style={{backgroundColor: user.role === 'admin' ? '#ef4444' : '#3b82f6'}}>{user.name.substring(0,2).toUpperCase()}</div>
                                                <div><div className="user-name">{user.name}</div><div className="user-email-small">{user.email}</div></div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-chip" style={{ background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: user.role === 'admin' ? '#ef4444' : '#3b82f6', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="date-text">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button title="Changer Rôle" onClick={() => handleRoleChange(user.id, user.role)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}><i className="fas fa-user-shield"></i></button>
                                                <button title="Supprimer" onClick={() => handleDeleteUser(user.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="admin-card">
                    <div className="card-title-flex">
                        <h3>Gestion des Cours</h3>
                        <button className="btn-action" onClick={() => setShowCourseModal(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                            <i className="fas fa-plus"></i> Créer un cours
                        </button>
                    </div>
                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead><tr><th>TITRE</th><th>CATÉGORIE</th><th>NIVEAU</th><th>DURÉE</th><th>ACTIONS</th></tr></thead>
                            <tbody>
                                {courses.map(c => (
                                    <tr key={c.id}>
                                        <td style={{fontWeight: 'bold', color: '#1e293b'}}>{c.title}</td>
                                        <td>
                                            <span className="status-chip" style={{
                                                background: getCategoryColor(c.category).bg, 
                                                color: getCategoryColor(c.category).text,
                                                textTransform: 'capitalize'
                                            }}>
                                                {c.category || 'Non défini'}
                                            </span>
                                        </td>
                                        <td>{c.level}</td>
                                        <td>{c.duration}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteCourse(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'quizzes' && (
                <div className="admin-card">
                    <div className="card-title-flex">
                        <h3>Gestion des Quiz</h3>
                        <button className="btn-action" onClick={() => setShowQuizModal(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                            <i className="fas fa-plus"></i> Créer un quiz
                        </button>
                    </div>
                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead><tr><th>TITRE</th><th>CATÉGORIE</th><th>QUESTIONS</th><th>ACTIONS</th></tr></thead>
                            <tbody>
                                {quizzes.map(q => (
                                    <tr key={q.id}>
                                        <td style={{fontWeight: 'bold', color: '#1e293b'}}>{q.title}</td>
                                        <td>
                                            <span className="status-chip" style={{
                                                background: getCategoryColor(q.category).bg, 
                                                color: getCategoryColor(q.category).text,
                                                textTransform: 'capitalize'
                                            }}>
                                                {q.category || 'Non défini'}
                                            </span>
                                        </td>
                                        <td>{q.questions_count !== undefined ? q.questions_count : (q.questions ? q.questions.length : 0)} questions</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteQuiz(q.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'announcements' && (
                <div className="admin-card">
                    <div className="card-title-flex">
                        <h3>Gestion des Annonces</h3>
                        <button className="btn-action" onClick={() => {
                            setNewAnnouncementForm({ title: '', message: '', type: 'info' });
                            setEditingAnnouncementId(null);
                            setShowAnnouncementModal(true);
                        }} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                            <i className="fas fa-plus"></i> Nouvelle Annonce
                        </button>
                    </div>
                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead><tr><th>TYPE</th><th>TITRE</th><th>MESSAGE</th><th>DATE</th><th>ACTIONS</th></tr></thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id}>
                                        <td>
                                            <span className="status-chip" style={{
                                                background: ann.type === 'urgent' ? '#fee2e2' : ann.type === 'success' ? '#dcfce7' : ann.type === 'warning' ? '#fef3c7' : '#e0e7ff',
                                                color: ann.type === 'urgent' ? '#ef4444' : ann.type === 'success' ? '#22c55e' : ann.type === 'warning' ? '#f59e0b' : '#6366f1',
                                                textTransform: 'capitalize', fontWeight: 'bold'
                                            }}>
                                                {ann.type}
                                            </span>
                                        </td>
                                        <td style={{fontWeight: 'bold', color: '#1e293b'}}>{ann.title}</td>
                                        <td style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{ann.message}</td>
                                        <td>{new Date(ann.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button onClick={() => openEditAnnouncement(ann)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteAnnouncement(ann.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {announcements.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Aucune annonce.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Ajouter un utilisateur</h3>
                        <form onSubmit={handleAddUser}>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Prénom</label><input type="text" required value={newUserForm.prenom} onChange={e => setNewUserForm({...newUserForm, prenom: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Nom</label><input type="text" required value={newUserForm.nom} onChange={e => setNewUserForm({...newUserForm, nom: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Email</label><input type="email" required value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Mot de passe</label><input type="password" required minLength="8" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Rôle</label><select value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}><option value="user">Utilisateur</option><option value="admin">Administrateur</option></select></div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}><button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button><button type="submit" style={{ padding: '10px 15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Enregistrer</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showAnnouncementModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>
                            {editingAnnouncementId ? 'Modifier l\'annonce' : 'Diffuser une annonce globale'}
                        </h3>
                        <form onSubmit={handleAddAnnouncement}>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Titre</label><input type="text" required value={newAnnouncementForm.title} onChange={e => setNewAnnouncementForm({...newAnnouncementForm, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Message</label><textarea required value={newAnnouncementForm.message} onChange={e => setNewAnnouncementForm({...newAnnouncementForm, message: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px', resize: 'vertical' }}></textarea></div>
                            <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Type d'annonce</label>
                                <select value={newAnnouncementForm.type} onChange={e => setNewAnnouncementForm({...newAnnouncementForm, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                                    <option value="info">Information (Bleu)</option>
                                    <option value="success">Succès (Vert)</option>
                                    <option value="warning">Avertissement (Orange)</option>
                                    <option value="urgent">Urgent (Rouge)</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowAnnouncementModal(false)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button>
                                <button type="submit" style={{ padding: '10px 15px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    {editingAnnouncementId ? 'Mettre à jour' : 'Publier l\'annonce'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCourseModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '700px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Créer un cours complet</h3>
                        <form onSubmit={handleAddCourse}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1, marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Titre</label><input type="text" required value={newCourseForm.title} onChange={e => setNewCourseForm({...newCourseForm, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                                <div style={{ flex: 1, marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Catégorie</label><input type="text" required value={newCourseForm.category} onChange={e => setNewCourseForm({...newCourseForm, category: e.target.value})} placeholder="ex: Développement Web" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1, marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Niveau</label><select value={newCourseForm.level} onChange={e => setNewCourseForm({...newCourseForm, level: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}><option value="Débutant">Débutant</option><option value="Intermédiaire">Intermédiaire</option><option value="Avancé">Avancé</option></select></div>
                                <div style={{ flex: 1, marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Durée (ex: 2h 30m)</label><input type="text" required value={newCourseForm.duration} onChange={e => setNewCourseForm({...newCourseForm, duration: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            </div>

                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Description</label><textarea required value={newCourseForm.description} onChange={e => setNewCourseForm({...newCourseForm, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '60px' }}></textarea></div>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Tags (séparés par virgule)</label><input type="text" value={newCourseForm.tags} onChange={e => setNewCourseForm({...newCourseForm, tags: e.target.value})} placeholder="React, Frontend, Web" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                                <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Image de couverture</label><input type="file" accept="image/*" onChange={e => setNewCourseForm({...newCourseForm, thumbnail: e.target.files[0]})} style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            </div>
                            
                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }}/>
                            <h4 style={{ margin: '0 0 15px 0', color: '#475569' }}>Programme du cours ({newCourseForm.modules?.length || 0} Chapitres)</h4>
                            
                            {(newCourseForm.modules || []).map((module, mIndex) => (
                                <div key={mIndex} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #cbd5e1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Chapitre {mIndex + 1}</label>
                                    <input type="text" placeholder="Titre du chapitre" required value={module.title} onChange={e => updateModuleTitle(mIndex, e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '15px' }} />
                                    
                                    <div style={{ paddingLeft: '15px', borderLeft: '3px solid #3b82f6', marginBottom: '10px' }}>
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0', fontWeight: 'bold' }}>Leçons ({module.lessons.length})</p>
                                        {module.lessons.map((lesson, lIndex) => (
                                            <div key={lIndex} style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                    <input type="text" placeholder={`Titre de la leçon ${lIndex + 1}`} required value={lesson.title} onChange={e => updateLesson(mIndex, lIndex, 'title', e.target.value)} style={{ flex: 2, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                                                    <input type="text" placeholder="Durée (ex: 5 min)" required value={lesson.duration} onChange={e => updateLesson(mIndex, lIndex, 'duration', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                                                    <select value={lesson.type} onChange={e => updateLesson(mIndex, lIndex, 'type', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}>
                                                        <option value="video">Vidéo</option>
                                                        <option value="article">Article</option>
                                                        <option value="exercise">Exercice</option>
                                                    </select>
                                                </div>
                                                {lesson.type === 'video' && (
                                                    <div>
                                                        <input type="url" placeholder="Lien YouTube (URL)" value={lesson.video_url} onChange={e => updateLesson(mIndex, lIndex, 'video_url', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addLessonField(mIndex)} style={{ fontSize: '13px', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', fontWeight: '600' }}><i className="fas fa-plus-circle"></i> Ajouter une leçon</button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addModuleField} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#475569', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', marginBottom: '25px', fontWeight: 'bold' }}>+ Ajouter un chapitre</button>
                            
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}><button type="button" onClick={() => setShowCourseModal(false)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button><button type="submit" style={{ padding: '10px 15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Créer le cours</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showQuizModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Créer un quiz avec ses questions</h3>
                        <form onSubmit={handleAddQuiz}>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Titre du quiz</label><input type="text" required value={newQuizForm.title} onChange={e => setNewQuizForm({...newQuizForm, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '14px' }}>Technologie (Catégorie)</label><input type="text" required value={newQuizForm.category} onChange={e => setNewQuizForm({...newQuizForm, category: e.target.value})} placeholder="ex: SQL" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                            
                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }}/>
                            <h4 style={{ margin: '0 0 15px 0', color: '#475569' }}>Questions ({newQuizForm.questions.length})</h4>
                            
                            {newQuizForm.questions.map((q, qIndex) => (
                                <div key={qIndex} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Question {qIndex + 1}</label>
                                    <input type="text" placeholder="Entrez la question" required value={q.text} onChange={e => updateQuestionText(qIndex, e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px' }} />
                                    
                                    <div style={{ paddingLeft: '15px', borderLeft: '3px solid #cbd5e1' }}>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px 0' }}>Options (Cochez la bonne réponse)</p>
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                                                <input type="radio" name={`correct_${qIndex}`} checked={opt.is_correct} onChange={() => updateOption(qIndex, optIndex, 'is_correct', true)} style={{ cursor: 'pointer' }} />
                                                <input type="text" placeholder={`Option ${optIndex + 1}`} required value={opt.text} onChange={e => updateOption(qIndex, optIndex, 'text', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOptionField(qIndex)} style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0' }}>+ Ajouter option</button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addQuestionField} style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', marginBottom: '25px' }}>+ Ajouter une question</button>
                            
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}><button type="button" onClick={() => setShowQuizModal(false)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button><button type="submit" style={{ padding: '10px 15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Enregistrer le quiz</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
