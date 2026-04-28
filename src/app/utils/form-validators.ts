export function isValidEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email);
}

export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!phone) {
    return false;
  }

  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function isValidOptionalPhone(value: string): boolean {
  return !value.trim() || isValidPhone(value);
}
