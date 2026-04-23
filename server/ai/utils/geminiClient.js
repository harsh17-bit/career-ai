import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
];

const DEFAULT_API_VERSIONS = ['v1', 'v1beta'];

const parseCsvEnv = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const unique = (items) => [...new Set(items.filter(Boolean))];

const getCandidateModels = () => {
  const primaryModel = process.env.GEMINI_MODEL?.trim();
  const extraModels = parseCsvEnv(process.env.GEMINI_MODELS);
  return unique([primaryModel, ...extraModels, ...DEFAULT_MODELS]);
};

const getCandidateApiVersions = () => {
  const pinnedVersion = process.env.GEMINI_API_VERSION?.trim();
  if (pinnedVersion) {
    return [pinnedVersion];
  }

  const versionList = parseCsvEnv(process.env.GEMINI_API_VERSIONS);
  return unique([...versionList, ...DEFAULT_API_VERSIONS]);
};

const isNotFoundModelError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    error?.status === 404 ||
    message.includes('is not found for api version') ||
    message.includes('not supported for generatecontent') ||
    message.includes('404 not found')
  );
};

const isAvailabilityError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    error?.status === 429 ||
    error?.status === 500 ||
    error?.status === 503 ||
    message.includes('high demand') ||
    message.includes('service unavailable') ||
    message.includes('resource exhausted') ||
    message.includes('rate limit') ||
    message.includes('temporarily unavailable')
  );
};

const getMaxRetries = () => {
  const parsed = Number.parseInt(process.env.GEMINI_MAX_RETRIES || '1', 10);
  return Number.isNaN(parsed) ? 1 : Math.max(0, parsed);
};

export const invokeGeminiWithFallback = async ({
  prompt,
  temperature = 0.7,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables.');
  }

  const models = getCandidateModels();
  const apiVersions = getCandidateApiVersions();
  const maxRetries = getMaxRetries();

  let lastError;
  const attempts = [];

  for (const apiVersion of apiVersions) {
    for (const modelName of models) {
      try {
        const model = new ChatGoogleGenerativeAI({
          model: modelName,
          temperature,
          apiKey: process.env.GEMINI_API_KEY,
          apiVersion,
          maxRetries,
        });

        return await model.invoke(prompt);
      } catch (error) {
        lastError = error;
        attempts.push(`${modelName}@${apiVersion}`);

        if (!isNotFoundModelError(error) && !isAvailabilityError(error)) {
          throw error;
        }
      }
    }
  }

  const attemptedText = attempts.join(', ');
  if (lastError && isAvailabilityError(lastError)) {
    throw new Error(
      `Gemini is busy across all configured models right now. Tried: ${attemptedText}. ` +
        'Please retry in a few seconds.'
    );
  }

  throw new Error(
    `No supported Gemini model was found. Tried: ${attemptedText}. ` +
      'Set GEMINI_MODEL or GEMINI_MODELS to models available for your key.'
  );
};
