import { normalizeErrorMessage } from './error-message';

describe('error-message utils', () => {
  it('maps firebase auth invalid credential code', () => {
    const text = normalizeErrorMessage({ code: 'auth/invalid-credential' }, 'fallback');
    expect(text).toContain('Hibás e-mail cím vagy jelszó');
  });

  it('maps permission denied code', () => {
    const text = normalizeErrorMessage({ code: 'permission-denied' }, 'fallback');
    expect(text).toContain('Nincs jogosultság');
  });

  it('returns fallback for unknown code', () => {
    const text = normalizeErrorMessage({ code: 'unknown-x' }, 'fallback');
    expect(text).toBe('fallback');
  });
});
