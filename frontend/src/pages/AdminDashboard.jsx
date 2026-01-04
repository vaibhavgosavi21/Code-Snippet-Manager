import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Code, Activity, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalSnippets: 0, recentActivities: [] });
  const [users, setUsers] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchStats();
    fetchUsers();
    fetchSnippets();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSnippets = async () => {
    try {
      const response = await axios.get('/api/admin/snippets');
      setSnippets(response.data);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}/activity`);
      setUserActivity(response.data);
      setSelectedUser(users.find(u => u._id === userId));
      setActiveTab('user-activity'); // Switch to activity view
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </a>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex space-x-8">
            {['overview', 'users', 'snippets', 'activity', ...(selectedUser ? ['user-activity'] : [])].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'user-activity' ? `${selectedUser?.username} Activity` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Snippets</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSnippets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activities</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.recentActivities.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all registered users</p>
              </div>
              <div className="h-96 overflow-auto p-4" style={{scrollBehavior: 'smooth'}}>
                <div className="space-y-3">
                  {users.map(user => {
                    const userSnippets = snippets.filter(s => s.userId?._id === user._id);
                    return (
                      <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              }`}>
                                {user.role}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {userSnippets.length} snippets
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                            <div>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</div>
                          </div>
                          <button
                            onClick={() => fetchUserActivity(user._id)}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            View Activity
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'snippets' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Snippets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {snippets.map(snippet => (
                    <tr key={snippet._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {snippet.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {snippet.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {snippet.userId?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(snippet.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Platform Activities</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest activities across all users</p>
            </div>
            <div className="p-6">
              {stats.recentActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No activities yet</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.action.includes('create') ? 'bg-green-100 text-green-600' :
                          activity.action.includes('update') ? 'bg-blue-100 text-blue-600' :
                          activity.action.includes('delete') ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.action.includes('create') && '+'}
                          {activity.action.includes('update') && '✎'}
                          {activity.action.includes('delete') && '×'}
                          {activity.action.includes('login') && '→'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            <span className="font-semibold">{activity.userId?.username || 'Unknown User'}</span>
                            {' '}{activity.action.replace('_', ' ').toLowerCase()}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                        <div>{new Date(activity.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(activity.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'user-activity' && selectedUser && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Activity Timeline for {selectedUser.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedUser.email} • {userActivity.length} activities
                  </p>
                </div>
                <button
                  onClick={() => {setSelectedUser(null); setUserActivity([]); setActiveTab('users');}}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {userActivity.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No activities found for this user</p>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {userActivity.map((activity, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== userActivity.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                activity.action.includes('create') ? 'bg-green-500' :
                                activity.action.includes('update') ? 'bg-blue-500' :
                                activity.action.includes('delete') ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}>
                                {activity.action.includes('create') && <span className="text-white text-xs font-bold">+</span>}
                                {activity.action.includes('update') && <span className="text-white text-xs">✎</span>}
                                {activity.action.includes('delete') && <span className="text-white text-xs font-bold">×</span>}
                                {activity.action.includes('login') && <span className="text-white text-xs">→</span>}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                  {activity.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                {activity.details && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {activity.details}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                <div className="font-medium">{new Date(activity.timestamp).toLocaleDateString()}</div>
                                <div className="text-xs">{new Date(activity.timestamp).toLocaleTimeString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;