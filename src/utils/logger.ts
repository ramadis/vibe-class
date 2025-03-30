/**
 * Logger utility for vibe-class
 */

// Check for verbose mode via environment variable
const isVerbose = process.env.VIBE_CLASS_VERBOSE === 'true';

/**
 * Log a message if verbose mode is enabled
 * @param message - The message to log
 * @param data - Optional data to log
 */
export const verboseLog = (message: string, data?: unknown): void => {
  if (!isVerbose) return;

  console.log(`[vibe-class] ${message}`);
  if (data !== undefined) {
    console.log(data);
  }
};

/**
 * Check if verbose mode is enabled
 * @returns True if verbose mode is enabled
 */
export const isVerboseMode = (): boolean => {
  return isVerbose;
};
