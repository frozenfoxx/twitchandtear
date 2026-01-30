import { sanitizeMessage, isValidMessage } from '../utils/sanitize';

describe('sanitizeMessage', () => {
  it('strips backticks', () => {
    expect(sanitizeMessage('hello`world')).toBe('helloworld');
  });

  it('strips semicolons', () => {
    expect(sanitizeMessage('hello;world')).toBe('helloworld');
  });

  it('strips newlines', () => {
    expect(sanitizeMessage('hello\nworld')).toBe('helloworld');
  });

  it('strips backslashes', () => {
    expect(sanitizeMessage('hello\\world')).toBe('helloworld');
  });

  it('truncates to 128 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeMessage(long)).toHaveLength(128);
  });

  it('trims whitespace', () => {
    expect(sanitizeMessage('  hello  ')).toBe('hello');
  });

  it('passes through normal text unchanged', () => {
    expect(sanitizeMessage('GG nice shot')).toBe('GG nice shot');
  });
});

describe('isValidMessage', () => {
  it('returns true for normal text', () => {
    expect(isValidMessage('hello')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidMessage('')).toBe(false);
  });

  it('returns false for only dangerous characters', () => {
    expect(isValidMessage('`;\n')).toBe(false);
  });

  it('returns false for only whitespace', () => {
    expect(isValidMessage('   ')).toBe(false);
  });
});
