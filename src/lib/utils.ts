import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely formats a currency value to Indian Rupees
 * Handles strings, numbers, null, undefined
 */
export function formatCurrency(value: any): string {
  if (value === null || value === undefined) {
    return "₹0.00";
  }
  
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(numValue)) {
    return "₹0.00";
  }
  
  return `₹${numValue.toFixed(2)}`;
}

/**
 * Safely converts any value to a number
 * Returns 0 if conversion fails
 */
export function safeNumber(value: any): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  
  const converted = parseFloat(value);
  return isNaN(converted) ? 0 : converted;
}