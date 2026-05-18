import { isValidEmail, isValidOptionalPhone, isValidPhone } from './form-validators';

describe('form validators', () => {
  it('validates email addresses', () => {
    expect(isValidEmail('vasarlo@example.com')).toBe(true);
    expect(isValidEmail('vasarlo.nev+demo@example.co.hu')).toBe(true);
    expect(isValidEmail('hibas-email')).toBe(false);
    expect(isValidEmail('teszt@')).toBe(false);
    expect(isValidEmail('teszt@@example.com')).toBe(false);
    expect(isValidEmail('teszt@example')).toBe(false);
    expect(isValidEmail('teszt@example..hu')).toBe(false);
    expect(isValidEmail('teszt@-example.hu')).toBe(false);
  });

  it('validates phone numbers', () => {
    expect(isValidPhone('+36 30 123 4567')).toBe(true);
    expect(isValidPhone('06301234567')).toBe(true);
    expect(isValidPhone('+36 1 234 5678')).toBe(true);
    expect(isValidPhone('+36 62 123 456')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('+36 abc')).toBe(false);
    expect(isValidPhone('+36 30 123')).toBe(false);
    expect(isValidPhone('+36 30 abc 4567')).toBe(false);
    expect(isValidPhone('0630123456a')).toBe(false);
    expect(isValidPhone('+36 00 123 4567')).toBe(false);
    expect(isValidPhone('+36 71 123 456')).toBe(false);
  });

  it('allows empty optional phone numbers', () => {
    expect(isValidOptionalPhone('')).toBe(true);
    expect(isValidOptionalPhone('  ')).toBe(true);
    expect(isValidOptionalPhone('+36 20 123 4567')).toBe(true);
    expect(isValidOptionalPhone('rossz')).toBe(false);
  });
});
