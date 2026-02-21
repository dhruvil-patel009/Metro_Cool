// lib/currency.ts

export const formatINR = (amount: number | string) => {
  const value = typeof amount === "string" ? Number(amount) : amount

  if (isNaN(value)) return "₹0"

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // no paise
  }).format(value)
}