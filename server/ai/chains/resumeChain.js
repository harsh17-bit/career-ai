import { PromptTemplate } from '@langchain/core/prompts';
import { resumeAnalysisTemplate } from '../prompts/resumeTemplates.js';
import { invokeGeminiWithFallback } from '../utils/geminiClient.js';
import { resumeAnalysisSchema } from '../parsers/schemas.js';

const analyzeResume = async (resumeText) => {
  const prompt = PromptTemplate.fromTemplate(resumeAnalysisTemplate);
  const formattedPrompt = await prompt.format({ resumeText });
  const response = await invokeGeminiWithFallback({
    prompt: formattedPrompt,
    temperature: 0.25,
  });
  const content =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI resume analysis');
  return resumeAnalysisSchema.parse(JSON.parse(jsonMatch[0]));
};

export default analyzeResume;
