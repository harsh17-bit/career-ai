import { z } from 'zod';

export const careerSchema = z.object({
  careers: z.array(
    z.object({
      name: z.string(),
      matchPercentage: z.number().min(0).max(100),
      reason: z.string(),
      requiredSkills: z.array(z.string()),
      salaryRange: z.string(),
      futureScope: z.string(),
      difficulty: z.enum(['Easy', 'Moderate', 'Challenging', 'Expert']),
      nextStep: z.string(),
    })
  ).length(5),
});

export const roadmapSchema = z.object({
  career: z.string(),
  level: z.string(),
  totalDuration: z.string(),
  phases: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      difficulty: z.string(),
      topics: z.array(z.string()),
      resources: z.array(
        z.object({
          title: z.string(),
          type: z.enum(['course', 'book', 'video', 'doc']),
          url: z.string(),
        })
      ),
    })
  ),
});
