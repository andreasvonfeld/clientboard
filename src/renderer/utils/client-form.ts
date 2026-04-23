export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = { name?: string; email?: string };

export function validateForm(name: string, email: string): FieldErrors {
  const errors: FieldErrors = {};
  const n = name.trim();
  const em = email.trim();
  if (!n) errors.name = 'Le nom est requis.';
  if (!em) errors.email = "L'adresse e-mail est requise.";
  else if (!EMAIL_RE.test(em)) errors.email = 'Format e-mail invalide.';
  return errors;
}

export function isFormValid(name: string, email: string): boolean {
  return name.trim().length > 0 && email.trim().length > 0 && EMAIL_RE.test(email.trim());
}
