// Telefoonnummers: enkel cijfers, met eventueel een "+" vooraan voor een buitenlands nummer.
export function cleanPhone(value) {
  const plus = value.trim().startsWith("+") ? "+" : "";
  return plus + value.replace(/\D/g, "").slice(0, 15);
}

export function isValidPhone(value) {
  return /^\+?\d{8,15}$/.test(value);
}
