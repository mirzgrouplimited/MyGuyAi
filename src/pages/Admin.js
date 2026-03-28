import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Settings, BarChart3, Bell, Lock, LogOut, FileText, Image, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState({
    flash_message: { enabled: false, message: '', link: '', link_text: '' },
    homepage_title: '',
    homepage_description: ''
  });
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0, top_tools: [] });
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, statsRes, toolsRes] = await Promise.all([
        axios.get(`${API}/settings`),
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/tools`)
      ]);
      setSettings(settingsRes.data);
      setStats(statsRes.data);
      setTools(toolsRes.data.tools || []);
    } catch (error) {
      console.error('Failed to fetch data');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, { password });
      if (response.data.success) {
        localStorage.setItem('admin_token', response.data.token);
        setIsLoggedIn(true);
        fetchData();
        toast.success('Welcome to Admin Panel!');
      }
    } catch (error) {
      toast.error('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setPassword('');
  };

  const updateSettings = async () => {
    try {
      const formData = new FormData();
      formData.append('flash_enabled', settings.flash_message?.enabled || false);
      formData.append('flash_message', settings.flash_message?.message || '');
      formData.append('flash_link', settings.flash_message?.link || '');
      formData.append('flash_link_text', settings.flash_message?.link_text || '');
      formData.append('homepage_title', settings.homepage_title || '');
      formData.append('homepage_description', settings.homepage_description || '');
      
      await axios.put(`${API}/admin/settings`, formData);
      toast.success('Settings updated!');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <SEO title="Admin Login - MyGuyAI" description="Admin login" path="/admin" />
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Lock size={32} className="text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                <p className="text-slate-600 mt-2">MyGuyAI Control Panel</p>
              </div>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  data-testid="admin-password-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  data-testid="admin-login-btn"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Admin Panel - MyGuyAI" description="Admin panel" path="/admin" />
      <div className="min-h-screen bg-slate-100">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">MyGuyAI</h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('flash')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'flash' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={18} />
              Flash Message
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'seo' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe size={18} />
              SEO Settings
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'tools' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText size={18} />
              Tools
            </button>
          </nav>
          
          <button
            onClick={handleLogout}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-600 mb-1">Today's Usage</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.today}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-600 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.week}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-600 mb-1">Total Usage</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Top Tools</h3>
                {stats.top_tools?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.top_tools.map((tool, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-700">{tool._id}</span>
                        <span className="font-semibold text-slate-900">{tool.count} uses</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No usage data yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'flash' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Flash Message</h2>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-900">Enable Flash Message</h3>
                    <p className="text-sm text-slate-600">Show announcement banner on the website</p>
                  </div>
                  <Switch
                    checked={settings.flash_message?.enabled || false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      flash_message: { ...settings.flash_message, enabled: checked }
                    })}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <input
                      type="text"
                      value={settings.flash_message?.message || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        flash_message: { ...settings.flash_message, message: e.target.value }
                      })}
                      placeholder="Your announcement message..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Link URL (optional)</label>
                      <input
                        type="text"
                        value={settings.flash_message?.link || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          flash_message: { ...settings.flash_message, link: e.target.value }
                        })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Link Text</label>
                      <input
                        type="text"
                        value={settings.flash_message?.link_text || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          flash_message: { ...settings.flash_message, link_text: e.target.value }
                        })}
                        placeholder="Learn more"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={updateSettings}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">SEO Settings</h2>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Homepage Title</label>
                    <input
                      type="text"
                      value={settings.homepage_title || ''}
                      onChange={(e) => setSettings({ ...settings, homepage_title: e.target.value })}
                      placeholder="Free Online Tools – Compress Images..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Homepage Description</label>
                    <textarea
                      value={settings.homepage_description || ''}
                      onChange={(e) => setSettings({ ...settings, homepage_description: e.target.value })}
                      rows={3}
                      placeholder="MyGuyAI offers free online tools..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={updateSettings}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tools Management</h2>
              
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Tool</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Category</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{tool.name}</p>
                          <p className="text-sm text-slate-500">/{tool.slug}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{tool.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tool.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {tool.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
