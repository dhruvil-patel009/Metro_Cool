// lib/currency.ts

export const formatINR = (amount: number | string) => {
  const value = typeof amount === "string" ? Number(amount) : amount

  if (isNaN(value)) return "₹0"

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return `₹${formatted}`
}
