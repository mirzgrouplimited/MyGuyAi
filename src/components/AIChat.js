import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ROBOT_AVATAR = "https://customer-assets.emergentagent.com/job_utility-zone/artifacts/gl5poxiw_4EDA5521-A42C-49AC-9353-168AA2691ABC.png";

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.heic', '.heif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AIChat = ({ sessionId, onFileUploaded, minimized, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm My Guy, your AI assistant. How can I help you today? You can ask me questions or upload a file to get started with our tools!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setUploadedFile(file);

    // Upload file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    try {
      const response = await axios.post(`${API}/upload`, formData);
      onFileUploaded?.(response.data);
      toast.success('File uploaded successfully!');
      
      // Add file message
      setMessages(prev => [...prev, {
        role: 'user',
        content: `Uploaded: ${file.name}`,
        isFile: true,
        timestamp: new Date()
      }]);

      // Ask what they want to do
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! I see you've uploaded "${file.name}". What would you like to do with it? For example, I can help you compress it, convert it, or resize it.`,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error('Failed to upload file');
      setUploadedFile(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: sessionId
      });

      const { response: aiResponse, intent, tool_redirect, file_ready } = response.data;

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        intent,
        tool_redirect,
        file_ready,
        timestamp: new Date()
      }]);

      // If there's an intent, set pending action
      if (intent && tool_redirect) {
        setPendingAction({ intent, tool_redirect, file_ready });
      }

    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "You've reached the rate limit. Please wait a bit before sending more messages, or explore our tools directly!",
          timestamp: new Date()
        }]);
      } else if (error.response?.status === 503) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm currently unavailable, but you can still use all our tools! Check out the tools section below.",
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm having trouble right now. Please try our tools directly!",
          timestamp: new Date()
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('tool', pendingAction.intent);

      const response = await axios.post(`${API}/chat/confirm-action`, formData);
      
      // Navigate to tool with file info
      navigate(pendingAction.tool_redirect, { 
        state: { 
          fileId: response.data.file_id,
          filename: response.data.filename,
          compatible: response.data.compatible
        }
      });
    } catch (error) {
      navigate(pendingAction.tool_redirect);
    }

    setPendingAction(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (minimized) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
        data-testid="chat-toggle-minimized"
      >
        <Bot className="text-white" size={28} />
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden" data-testid="ai-chat">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <img src={ROBOT_AVATAR} alt="My Guy" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="text-white font-bold">My Guy</h3>
            <p className="text-blue-100 text-sm">Your AI Assistant</p>
          </div>
        </div>
        {onToggle && (
          <button 
            onClick={onToggle}
            className="text-white/80 hover:text-white transition-colors"
            data-testid="chat-minimize"
          >
            <ChevronDown size={24} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-orange-500' : 'bg-blue-600'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
              } ${msg.isFile ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}`}>
                {msg.content}
              </div>
              
              {/* Action buttons for tool redirect */}
              {msg.tool_redirect && msg.role === 'assistant' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                    data-testid="confirm-action-btn"
                  >
                    Yes, let's go!
                  </button>
                  <button
                    onClick={() => setPendingAction(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-300 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {uploadedFile && (
        <div className="px-4 py-2 bg-blue-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-blue-700 truncate">{uploadedFile.name}</span>
          <button onClick={removeFile} className="text-blue-600 hover:text-blue-800">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={ALLOWED_EXTENSIONS.join(',')}
            className="hidden"
            data-testid="chat-file-input"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            data-testid="attach-file-btn"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask My Guy anything..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            data-testid="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !uploadedFile)}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="send-message-btn"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Attach: PDF, Word, PNG, JPG, HEIC (max 10MB)
        </p>
      </div>
    </div>
  );
};
