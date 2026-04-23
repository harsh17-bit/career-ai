import ChatHistory from '../models/ChatHistory.js';
import chatWithMentor from '../ai/chains/chatChain.js';

// @desc    Send message to AI mentor
// @route   POST /api/chat/send
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ user: req.user._id });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({ user: req.user._id, messages: [] });
    }

    // Get AI response
    const aiResponse = await chatWithMentor(message, req.user, chatHistory.messages);

    // Save both messages
    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );

    // Keep only last 50 messages
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    await chatHistory.save();

    res.json({
      userMessage: { role: 'user', content: message },
      aiMessage: { role: 'assistant', content: aiResponse },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to get response. Please try again.' });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ user: req.user._id });
    res.json(chatHistory?.messages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
