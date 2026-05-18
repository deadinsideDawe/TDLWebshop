export function isValidEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || /\s/.test(email)) {
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;
  if (
    !localPart ||
    !domain ||
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    domain.includes('..')
  ) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.length < 2 || labels.some(label => !label || label.startsWith('-') || label.endsWith('-'))) {
    return false;
  }

  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/.test(tld)) {
    return false;
  }

  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email);
}

const HUNGARIAN_LANDLINE_AREA_CODES = new Set([
  '22', '23', '24', '25', '26', '27', '28', '29',
  '32', '33', '34', '35', '36', '37',
  '42', '44', '45', '46', '47', '48', '49',
  '52', '53', '54', '56', '57', '59',
  '62', '63', '66', '68', '69',
  '72', '73', '74', '75', '76', '77', '78', '79',
  '82', '83', '84', '85', '87', '88', '89',
  '92', '93', '94', '95', '96', '99'
]);

function isValidHungarianNationalNumber(nationalNumber: string): boolean {
  if (/^(20|30|31|50|70)\d{7}$/.test(nationalNumber)) {
    return true;
  }

  if (/^1\d{7}$/.test(nationalNumber)) {
    return true;
  }

  const areaCode = nationalNumber.slice(0, 2);
  return HUNGARIAN_LANDLINE_AREA_CODES.has(areaCode) && /^\d{8}$/.test(nationalNumber);
}

export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!phone) {
    return false;
  }

  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    return false;
  }

  const compact = phone.replace(/[\s().-]/g, '');
  if (!/^\+?\d{8,15}$/.test(compact)) {
    return false;
  }

  const digits = compact.replace(/^\+/, '');
  if (digits.startsWith('36')) {
    return isValidHungarianNationalNumber(digits.slice(2));
  }

  if (digits.startsWith('06')) {
    return isValidHungarianNationalNumber(digits.slice(2));
  }

  return digits.length >= 8 && digits.length <= 15;
}

export function isValidOptionalPhone(value: string): boolean {
  return !value.trim() || isValidPhone(value);
}
