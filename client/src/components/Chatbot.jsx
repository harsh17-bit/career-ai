import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiMessageSquare,
  FiUser,
  FiStar,
} from 'react-icons/fi';
import { chatAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isAuthenticated } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && isAuthenticated && !historyLoaded) {
      loadHistory();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      const res = await chatAPI.getHistory();
      if (res.data && res.data.length > 0) {
        setMessages(res.data.slice(-20));
      }
      setHistoryLoaded(true);
    } catch (err) {
      console.error('Failed to load chat history');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to chat with AI mentor');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({ message: userMessage });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.aiMessage.content },
      ]);
    } catch (err) {
      toast.error('Failed to get response');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-trigger fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'rotate-0' : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiX className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FiMessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="chatbot-panel fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] glass-card rounded-3xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <FiStar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  AI Career Mentor
                </h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <FiMessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-sm">
                    Hi! I'm your AI career mentor. Ask me anything about
                    careers, skills, or learning paths!
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center mt-1">
                      <FiMessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'gradient-bg text-white rounded-br-md'
                        : 'bg-white/5 text-white/80 border border-white/[0.06] rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <FiUser className="w-3.5 h-3.5 text-white/60" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center">
                    <FiMessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/[0.06]">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-2 h-2 bg-white/40 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isAuthenticated ? 'Ask anything...' : 'Sign in to chat...'
                  }
                  disabled={!isAuthenticated || loading}
                  className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!input.trim() || loading || !isAuthenticated}
                  className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                  <FiSend className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
