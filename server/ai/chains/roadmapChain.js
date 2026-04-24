import { PromptTemplate } from '@langchain/core/prompts';
import { roadmapTemplate } from '../prompts/templates.js';
import { roadmapSchema } from '../parsers/schemas.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';

const buildRoadmapSignature = (career, level, profileContext) => {
  const raw = [career, level, profileContext].join('|');
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 33 + raw.charCodeAt(index)) | 0;
  }
  return `R-${Math.abs(hash)}`;
};

const generateRoadmap = async (
  career,
  level = 'beginner',
  profileContext = 'No profile context provided.'
) => {
  const prompt = PromptTemplate.fromTemplate(roadmapTemplate);
  const formattedPrompt = await prompt.format({
    career,
    level,
    profileContext,
    profileSignature: buildRoadmapSignature(career, level, profileContext),
  });

  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.85,
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
