import type { CurrencyCode, Money } from "../types";

// Mock exchange rates: value of 1 unit expressed in MYR.
const RATE_MYR: Record<CurrencyCode, number> = {
  MYR: 1,
  JPY: 0.031,
  USD: 4.72,
  EUR: 5.12,
  CNY: 0.65,
  GBP: 5.98,
};

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "CNY", label: "Chinese Yuan", symbol: "CN¥" },
  { code: "GBP", label: "British Pound", symbol: "£" },
];

const SYMBOL: Record<CurrencyCode, string> = {
  MYR: "RM",
  JPY: "¥",
  USD: "$",
  EUR: "€",
  CNY: "CN¥",
  GBP: "£",
};

const NO_DECIMALS: CurrencyCode[] = ["JPY", "CNY"];

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  return (amount * RATE_MYR[from]) / RATE_MYR[to];
}

export function fmt(amount: number, currency: CurrencyCode): string {
  const decimals = NO_DECIMALS.includes(currency) ? 0 : amount % 1 === 0 ? 0 : 2;
  const n = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${SYMBOL[currency]}${n}`;
}

/** Format money in its original currency, plus converted display value when they differ. */
export function fmtMoney(money: Money, display: CurrencyCode): { original: string; converted: string | null } {
  const original = fmt(money.amount, money.currency);
  if (money.currency === display) return { original, converted: null };
  const conv = convert(money.amount, money.currency, display);
  return { original, converted: `≈ ${fmt(Math.round(conv), display)}` };
}

/** A money value converted to the display currency as a rounded number. */
export function toDisplay(money: Money, display: CurrencyCode): number {
  return convert(money.amount, money.currency, display);
}
