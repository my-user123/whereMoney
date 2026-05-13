export function formatAmount(amount: string | number, currency?: string) {
  const numeric = Number(amount);
  const value = Number.isFinite(numeric) ? numeric.toFixed(2) : String(amount);
  return currency ? `${currency} ${value}` : value;
}

export function toIsoLocalInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
