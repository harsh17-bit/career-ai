import { PromptTemplate } from '@langchain/core/prompts';
import { chatMentorTemplate } from '../prompts/templates.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';

const chatWithMentor = async (userMessage, userProfile, chatHistory = []) => {
  // Format chat history (last 10 messages)
  const recentHistory = chatHistory.slice(-10);
  const formattedHistory = recentHistory
    .map(
      (msg) => `${msg.role === 'user' ? 'Student' : 'Mentor'}: ${msg.content}`
    )
    .join('\n');

  const prompt = PromptTemplate.fromTemplate(chatMentorTemplate);
  const formattedPrompt = await prompt.format({
    userName: userProfile.name || 'Student',
    educationLevel: userProfile.profile?.educationLevel || 'Not specified',
    stream: userProfile.profile?.stream || 'Not specified',
    interests: userProfile.profile?.interests?.join(', ') || 'Not specified',
    skills: userProfile.profile?.skills?.join(', ') || 'Not specified',
    chatHistory: formattedHistory || 'No previous conversation',
    userMessage,
  });

  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.8,
  });
  return response.content;
};

export default chatWithMentor;
