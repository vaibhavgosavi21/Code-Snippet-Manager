import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Edit, Trash2, Calendar, Tag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SnippetCard = ({ snippet, onEdit, onDelete, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const isOwner = user && snippet.userId && (snippet.userId._id === user._id || snippet.userId === user._id);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
  };

  const languageColors = {
    javascript: 'from-yellow-400 to-orange-500',
    python: 'from-blue-400 to-green-500',
    java: 'from-red-400 to-orange-500',
    cpp: 'from-blue-500 to-purple-600',
    html: 'from-orange-400 to-red-500',
    css: 'from-blue-400 to-purple-500',
    sql: 'from-gray-400 to-blue-500',
    bash: 'from-gray-600 to-gray-800'
  };

  const getLanguageColor = (lang) => languageColors[lang] || 'from-gray-400 to-gray-600';

  if (viewMode === 'list') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {snippet.title}
              </h3>
              <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${getLanguageColor(snippet.language)}`}>
                {snippet.language.toUpperCase()}
              </span>
            </div>
            
            {snippet.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {snippet.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User size={12} />
                {snippet.userId?.username || 'Unknown User'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag size={12} />
                  {snippet.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                  {snippet.tags.length > 2 && (
                    <span className="text-gray-400">+{snippet.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => onEdit(snippet)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                  title="Edit snippet"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(snippet._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Delete snippet"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {snippet.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${getLanguageColor(snippet.language)} shadow-sm`}>
                {snippet.language.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <User size={12} />
                {snippet.userId?.username || 'Unknown User'}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => onEdit(snippet)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Edit snippet"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(snippet._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Delete snippet"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {snippet.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {snippet.description}
          </p>
        )}
      </div>

      {/* Code Block */}
      <div className="px-6 pb-4">
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              maxHeight: '200px',
              overflow: 'auto'
            }}
            showLineNumbers={true}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Footer */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-200"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetCard;