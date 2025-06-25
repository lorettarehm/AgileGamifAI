/**
 * Environment utilities for cross-environment compatibility
 */

export function getEnvironmentVariable(key: string): string | undefined {
  // In Node.js/test environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // For browser environment, this will be handled by components directly
  return undefined;
}