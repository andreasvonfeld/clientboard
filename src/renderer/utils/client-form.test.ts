import { describe, expect, it } from 'vitest';
import { isFormValid, validateForm } from './client-form';

describe('client-form utils', () => {
  it('detecte les champs requis manquants', () => {
    const errors = validateForm(' ', '');
    expect(errors).toEqual({
      name: 'Le nom est requis.',
      email: "L'adresse e-mail est requise.",
    });
  });

  it('rejette un email invalide', () => {
    const errors = validateForm('Alice', 'alice@invalid');
    expect(errors.email).toBe('Format e-mail invalide.');
  });

  it('accepte un formulaire valide', () => {
    expect(isFormValid('Alice', 'alice@mail.com')).toBe(true);
    expect(validateForm('Alice', 'alice@mail.com')).toEqual({});
  });
});
