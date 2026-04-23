import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
