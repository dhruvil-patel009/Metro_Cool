// Shared installation charges data — stored in localStorage so admin edits
// are instantly reflected on the product page (same browser session).
// In production you'd persist this in Supabase instead.

export interface InstallationPlan {
  id: string
  label: string          // e.g. "Standard Installation"
  badge?: string         // e.g. "EXPRESS"
  badgeColor?: string    // tailwind bg class, e.g. "bg-green-500"
  price: number
  description: string    // short sub-line
  isRecommended?: boolean
}

export interface InstallationChargesConfig {
  heading: string
  trustLine: string      // "95% of buyers chose professional installation"
  includes: string[]
  excludes: string[]
  plans: InstallationPlan[]
  footnote: string
}

export const DEFAULT_CONFIG: InstallationChargesConfig = {
  heading: "Personalize Installation",
  trustLine: "95% of buyers chose professional installation",
  includes: [
    "Drill & mount unit",
    "Connect 3m pipe",
    "Gas pressure check",
    "Demo & handover",
  ],
  excludes: [
    "Copper pipe > 3m",
    "Wall core cutting",
    "Stabilizer / Bracket",
  ],
  plans: [
    {
      id: "standard",
      label: "Standard Installation",
      price: 999,
      description: "Basic setup by verified technician",
      isRecommended: false,
    },
    {
      id: "premium",
      label: "Authorized Premium Setup",
      badge: "EXPRESS",
      badgeColor: "bg-green-500",
      price: 1499,
      description: "Brand authorized + 1-year service warranty",
      isRecommended: true,
    },
  ],
  footnote: "* Charges apply per unit. Final price confirmed at booking.",
}

const STORAGE_KEY = "mc_installation_config"

export function getInstallationConfig(): InstallationChargesConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return JSON.parse(raw) as InstallationChargesConfig
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveInstallationConfig(config: InstallationChargesConfig): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function resetInstallationConfig(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
