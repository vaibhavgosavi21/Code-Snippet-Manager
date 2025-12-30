import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, LogOut, Shield, Code2, Sparkles, Filter, Grid, List, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SnippetCard from '../components/SnippetCard';
import SnippetForm from '../components/SnippetForm';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMySnippets, setShowMySnippets] = useState(false);
  const { user, logout } = useAuth();

  const languages = ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'bash'];

  useEffect(() => {
    fetchSnippets();
  }, [showMySnippets]);

  useEffect(() => {
    let filtered = snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedLanguage) {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage);
    }
    
    setFilteredSnippets(filtered);
  }, [snippets, searchTerm, selectedLanguage]);

  const fetchSnippets = async () => {
    try {
      const endpoint = showMySnippets ? '/api/snippets/my-snippets' : '/api/snippets';
      const response = await axios.get(endpoint);
      setSnippets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching snippets:', error);
      setLoading(false);
    }
  };

  const handleSaveSnippet = async (snippetData) => {
    try {
      if (editingSnippet) {
        await axios.put(`/api/snippets/${editingSnippet._id}`, snippetData);
      } else {
        await axios.post('/api/snippets', snippetData);
      }
      fetchSnippets();
      setShowForm(false);
      setEditingSnippet(null);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  };

  const handleEditSnippet = (snippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleDeleteSnippet = async (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await axios.delete(`/api/snippets/${id}`);
        fetchSnippets();
      } catch (error) {
        console.error('Error deleting snippet:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Code Snippet Manager
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {snippets.length} {showMySnippets ? 'my snippets' : 'public snippets'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user.username}</span>
              </div>
              
              {user.role === 'admin' && (
                <a
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Shield size={16} />
                  <span className="hidden sm:inline">Admin</span>
                </a>
              )}
              
              <a
                href="/about"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Info size={16} />
                <span className="hidden sm:inline">About</span>
              </a>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 shadow-xl">
          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setShowMySnippets(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !showMySnippets 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                All Snippets
              </button>
              <button
                onClick={() => setShowMySnippets(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showMySnippets 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                My Snippets
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search snippets, tags, or code..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-500 shadow-sm text-gray-900 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-500 shadow-sm text-gray-900 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'}`}
                >
                  <List size={16} />
                </button>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Snippet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Snippets Grid/List */}
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {filteredSnippets.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || selectedLanguage ? 'No snippets found' : showMySnippets ? 'No snippets yet' : 'No public snippets yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm || selectedLanguage 
                    ? 'Try adjusting your search or filters' 
                    : showMySnippets 
                      ? 'Create your first code snippet to get started'
                      : 'Be the first to share a code snippet with the community!'}
                </p>
                {!searchTerm && !selectedLanguage && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                  >
                    <Plus size={20} />
                    {showMySnippets ? 'Create First Snippet' : 'Share First Snippet'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredSnippets.map(snippet => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onEdit={handleEditSnippet}
                onDelete={handleDeleteSnippet}
                viewMode={viewMode}
              />
            ))
          )}
        </div>
      </main>

      {showForm && (
        <SnippetForm
          snippet={editingSnippet}
          onSave={handleSaveSnippet}
          onClose={() => {
            setShowForm(false);
            setEditingSnippet(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;