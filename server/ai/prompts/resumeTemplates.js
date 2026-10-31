export const resumeAnalysisTemplate = `You are an expert ATS resume reviewer.
Analyze the resume text below for clarity, relevance, measurable impact, ATS compatibility, and missing keywords.
Return only valid JSON matching this shape:
{
  "score": 0,
  "summary": " concise overall assessment ",
  "strengths": ["specific strength"],
  "missingKeywords": ["keyword"],
  "suggestions": ["specific actionable improvement"]
}
Rules:
- score must be an integer from 0 to 100.
- Return 3-5 items in each list.
- Ground every item in the supplied resume; never invent experience.
- Keep suggestions practical and concise.

Resume:
{resumeText}`;
