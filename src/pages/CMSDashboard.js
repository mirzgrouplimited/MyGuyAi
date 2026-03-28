import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, FileText, Settings, LogOut, Edit, 
  BarChart2, Shield, Search, ChevronRight 
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Role badge colors
const ROLE_COLORS = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  seo_manager: 'bg-green-100 text-green-700',
  editor: 'bg-orange-100 text-orange-700'
};

const ROLE_NAMES = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  seo_manager: 'SEO Manager',
  editor: 'Editor'
};

export default function CMSDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('cms_user');
    const token = localStorage.getItem('cms_token');
    
    if (!storedUser || !token) {
      navigate('/cms/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    loadData(token);
  }, [navigate]);

  const loadData = async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      // Load tools
      const toolsRes = await axios.get(`${API_URL}/api/cms/tools`, { headers });
      setTools(toolsRes.data.tools || []);
      
      // Load stats (for admins)
      try {
        const statsRes = await axios.get(`${API_URL}/api/admin/stats`, { headers });
        setStats(statsRes.data);
      } catch (e) {
        // Non-admin users won't have access
      }
      
      // Load users (for super admin)
      try {
        const usersRes = await axios.get(`${API_URL}/api/cms/users`, { headers });
        setUsers(usersRes.data.users || []);
      } catch (e) {
        // Non super-admin users won't have access
      }
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const canEditSEO = ['super_admin', 'admin', 'seo_manager'].includes(user?.role);
  const canEditContent = ['super_admin', 'admin', 'editor'].includes(user?.role);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-slate-900">MyGuyAI</Link>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">CMS</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user?.role]}`}>
                {ROLE_NAMES[user?.role]}
              </span>
              <span className="text-sm text-slate-600">{user?.name}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            <BarChart2 size={18} /> Overview
          </TabButton>
          {canEditContent && (
            <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')}>
              <FileText size={18} /> Content
            </TabButton>
          )}
          {canEditSEO && (
            <TabButton active={activeTab === 'seo'} onClick={() => setActiveTab('seo')}>
              <Search size={18} /> SEO
            </TabButton>
          )}
          {isSuperAdmin && (
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
              <Users size={18} /> Users
            </TabButton>
          )}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} tools={tools} />
        )}
        {activeTab === 'content' && canEditContent && (
          <ContentTab tools={tools} onUpdate={() => loadData(localStorage.getItem('cms_token'))} />
        )}
        {activeTab === 'seo' && canEditSEO && (
          <SEOTab tools={tools} onUpdate={() => loadData(localStorage.getItem('cms_token'))} />
        )}
        {activeTab === 'users' && isSuperAdmin && (
          <UsersTab users={users} onUpdate={() => loadData(localStorage.getItem('cms_token'))} />
        )}
      </div>
    </div>
  );
}

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-white text-slate-600 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

const OverviewTab = ({ stats, tools }) => (
  <div className="space-y-6">
    {stats && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Today's Usage" value={stats.today} />
        <StatCard label="This Week" value={stats.week} />
        <StatCard label="Total Usage" value={stats.total} />
      </div>
    )}
    
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Tools ({tools.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => (
          <div key={tool.id} className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900">{tool.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{tool.category}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl p-6">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value?.toLocaleString() || 0}</p>
  </div>
);

const ContentTab = ({ tools, onUpdate }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelect = (tool) => {
    setSelectedTool(tool);
    setDescription(tool.description || '');
  };

  const handleSave = async () => {
    if (!selectedTool) return;
    setSaving(true);
    
    try {
      await axios.put(
        `${API_URL}/api/cms/content`,
        { tool_id: selectedTool.id, field: 'description', value: description },
        { headers: { Authorization: `Bearer ${localStorage.getItem('cms_token')}` }}
      );
      onUpdate();
      alert('Saved!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-4">
        <h2 className="font-semibold text-slate-900 mb-4">Select Tool</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleSelect(tool)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedTool?.id === tool.id ? 'bg-blue-50 border-blue-300 border' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className="font-medium text-slate-900">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-xl p-6">
        {selectedTool ? (
          <>
            <h2 className="font-semibold text-slate-900 mb-4">Edit: {selectedTool.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg h-32"
                  placeholder="Tool description..."
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-slate-500">Select a tool to edit</p>
        )}
      </div>
    </div>
  );
};

const SEOTab = ({ tools, onUpdate }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelect = (tool) => {
    setSelectedTool(tool);
    setSeoTitle(tool.seo_title || '');
    setSeoDesc(tool.seo_description || '');
  };

  const handleSave = async () => {
    if (!selectedTool) return;
    setSaving(true);
    
    try {
      const token = localStorage.getItem('cms_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.put(`${API_URL}/api/cms/content`, 
        { tool_id: selectedTool.id, field: 'seo_title', value: seoTitle }, { headers });
      await axios.put(`${API_URL}/api/cms/content`, 
        { tool_id: selectedTool.id, field: 'seo_description', value: seoDesc }, { headers });
      
      onUpdate();
      alert('SEO settings saved!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-4">
        <h2 className="font-semibold text-slate-900 mb-4">Select Tool</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleSelect(tool)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedTool?.id === tool.id ? 'bg-blue-50 border-blue-300 border' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className="font-medium text-slate-900">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-xl p-6">
        {selectedTool ? (
          <>
            <h2 className="font-semibold text-slate-900 mb-4">SEO: {selectedTool.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SEO Title</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-slate-400 mt-1">{seoTitle.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SEO Description</label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg h-24"
                  placeholder="Meta description for search results"
                />
                <p className="text-xs text-slate-400 mt-1">{seoDesc.length}/160 characters</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-slate-500">Select a tool to edit SEO</p>
        )}
      </div>
    </div>
  );
};

const UsersTab = ({ users, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: 'editor' });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/cms/users`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cms_token')}` }
      });
      setShowForm(false);
      setNewUser({ email: '', name: '', password: '', role: 'editor' });
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (email, currentActive) => {
    try {
      await axios.put(`${API_URL}/api/cms/users/${email}`, 
        { active: !currentActive },
        { headers: { Authorization: `Bearer ${localStorage.getItem('cms_token')}` }}
      );
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await axios.delete(`${API_URL}/api/cms/users/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cms_token')}` }
      });
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Users ({users.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold mb-4">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="p-3 border border-slate-300 rounded-lg"
            />
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="p-3 border border-slate-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="p-3 border border-slate-300 rounded-lg"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="p-3 border border-slate-300 rounded-lg"
            >
              <option value="editor">Editor</option>
              <option value="seo_manager">SEO Manager</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Role</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
              <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} className="border-b border-slate-100 last:border-0">
                <td className="p-4">
                  <p className="font-medium text-slate-900">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                    {ROLE_NAMES[u.role]}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleActive(u.email, u.active)}
                    className="text-sm text-blue-600 hover:underline mr-3"
                  >
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(u.email)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
