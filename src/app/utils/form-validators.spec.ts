import { isValidEmail, isValidOptionalPhone, isValidPhone } from './form-validators';

describe('form validators', () => {
  it('validates email addresses', () => {
    expect(isValidEmail('vasarlo@example.com')).toBe(true);
    expect(isValidEmail('vasarlo.nev+demo@example.co.hu')).toBe(true);
    expect(isValidEmail('hibas-email')).toBe(false);
    expect(isValidEmail('teszt@')).toBe(false);
  });

  it('validates phone numbers', () => {
    expect(isValidPhone('+36 30 123 4567')).toBe(true);
    expect(isValidPhone('06301234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('+36 abc')).toBe(false);
  });

  it('allows empty optional phone numbers', () => {
    expect(isValidOptionalPhone('')).toBe(true);
    expect(isValidOptionalPhone('  ')).toBe(true);
    expect(isValidOptionalPhone('+36 20 123 4567')).toBe(true);
    expect(isValidOptionalPhone('rossz')).toBe(false);
  });
});
