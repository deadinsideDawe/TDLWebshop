export function getErrorCode(error: unknown): string {
  return (error as { code?: string })?.code || '';
}

export function normalizeErrorMessage(error: unknown, fallback = 'Valami hiba történt. Próbáld újra.'): string {
  const code = getErrorCode(error);

  switch (code) {
    case 'auth/invalid-email':
      return 'Az e-mail cím formátuma hibás.';
    case 'auth/user-disabled':
      return 'Ez a felhasználó le van tiltva az admin által.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Hibás e-mail cím vagy jelszó.';
    case 'auth/email-already-in-use':
      return 'Ez az e-mail cím már használatban van.';
    case 'auth/weak-password':
      return 'A jelszó legyen legalább 6 karakter.';
    case 'auth/missing-password':
      return 'A jelszó megadása kötelező.';
    case 'permission-denied':
      return 'Nincs jogosultság ehhez a művelethez.';
    case 'unavailable':
      return 'A szolgáltatás átmenetileg nem érhető el.';
    case 'deadline-exceeded':
      return 'A művelet túl sokáig tartott, próbáld újra.';
    default:
      return fallback;
  }
}

