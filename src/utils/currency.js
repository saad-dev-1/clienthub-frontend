const CURRENCY_SYMBOLS = {
  USD: '$',
  PKR: 'Rs',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  INR: '₹',
};

export function getCurrencySymbol(code) {
  if (!code) return '$';
  return CURRENCY_SYMBOLS[code] || '$';
}

export function getUserCurrency() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.currency || 'USD';
  } catch {
    return 'USD';
  }
}

export function formatMoney(amount, code) {
  const currency = code || getUserCurrency();
  const symbol = getCurrencySymbol(currency);
  const num = parseFloat(amount || 0).toFixed(2);
  return `${symbol} ${num}`;
}