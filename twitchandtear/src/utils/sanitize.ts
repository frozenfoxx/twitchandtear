const MAX_MESSAGE_LENGTH = 128;

// Strip characters that could be used for command injection in the Zandronum console
const DANGEROUS_CHARS = /[`;\n\r\\]/g;

export function sanitizeMessage(input: string): string {
  return input
    .replace(DANGEROUS_CHARS, '')
    .substring(0, MAX_MESSAGE_LENGTH)
    .trim();
}

export function isValidMessage(input: string): boolean {
  const sanitized = sanitizeMessage(input);
  return sanitized.length > 0;
}
