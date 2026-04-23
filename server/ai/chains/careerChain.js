import { PromptTemplate } from '@langchain/core/prompts';
import { careerRecommendationTemplate } from '../prompts/templates.js';
import { careerSchema } from '../parsers/schemas.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';

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
  });

  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.7,
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
