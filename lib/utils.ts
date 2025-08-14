import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const USDTOAVAXCONSTANT = 0.041;

export const USDTtoAVAX = (usd_value: number): number => {
  if (usd_value === 0) return 0;

  const avax_value = usd_value * USDTOAVAXCONSTANT;

  return avax_value
}