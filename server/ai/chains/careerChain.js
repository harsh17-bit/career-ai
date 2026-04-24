import { PromptTemplate } from '@langchain/core/prompts';
import { careerRecommendationTemplate } from '../prompts/templates.js';
import { careerSchema } from '../parsers/schemas.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';

const buildProfileSignature = (profileData) => {
  const raw = [
    profileData.educationLevel,
    profileData.stream,
    profileData.marks,
    ...(profileData.subjects || []),
    ...(profileData.interests || []),
    ...(profileData.skills || []),
    profileData.goals,
  ].join('|');

  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) | 0;
  }
  return `P-${Math.abs(hash)}`;
};

const getCareerRecommendations = async (profileData) => {
  const prompt = PromptTemplate.fromTemplate(careerRecommendationTemplate);

  const formattedPrompt = await prompt.format({
    educationLevel: profileData.educationLevel,
    stream: profileData.stream,
    marks: profileData.marks,
    subjects: profileData.subjects.join(', '),
    interests: profileData.interests.join(', '),
    skills: profileData.skills.join(', '),
    goals: profileData.goals,
    profileSignature: buildProfileSignature(profileData),
  });

  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.9,
  });
  const content = response.content;

  // Extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = careerSchema.parse(parsed);
  return validated.careers;
};

export default getCareerRecommendations;
