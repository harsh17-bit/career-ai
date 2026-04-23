import { PromptTemplate } from '@langchain/core/prompts';
import { roadmapTemplate } from '../prompts/templates.js';
import { roadmapSchema } from '../parsers/schemas.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';

const generateRoadmap = async (career, level = 'beginner') => {
  const prompt = PromptTemplate.fromTemplate(roadmapTemplate);
  const formattedPrompt = await prompt.format({ career, level });

  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.7,
  });
  const content = response.content;

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = roadmapSchema.parse(parsed);
  return validated;
};

export default generateRoadmap;
