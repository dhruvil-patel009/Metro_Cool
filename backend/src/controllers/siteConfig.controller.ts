import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

const VALID_WITHIN_VALUES = [
  "24 hours", "1 day", "2 days", "3 days",
  "4 days",   "5 days", "6 days", "7 days",
]

/* ── GET /api/products/config ─────────────────────────────
   Public — returns the current site-wide installation_within
   value. Called by the product page on every load.
──────────────────────────────────────────────────────────── */
export const getSiteConfig = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["installation_within"])

  if (error) {
    console.error("[siteConfig] fetch error:", error)
    // Return safe defaults so the product page never breaks
    return res.json({ installation_within: "24 hours" })
  }

  const config: Record<string, string> = {}
  for (const row of data ?? []) {
    config[row.key] = row.value
  }

  // Fill any missing keys with defaults
  if (!config.installation_within) config.installation_within = "24 hours"

  return res.json(config)
}

/* ── PUT /api/products/config ────────────────────────────
   Admin only — upserts key-value pairs in site_config.
   Body: { installation_within: "7 days" }
──────────────────────────────────────────────────────────── */
export const updateSiteConfig = async (req: Request, res: Response) => {
  const { installation_within } = req.body

  if (installation_within !== undefined) {
    if (!VALID_WITHIN_VALUES.includes(installation_within)) {
      return res.status(400).json({
        error: `Invalid value. Must be one of: ${VALID_WITHIN_VALUES.join(", ")}`,
      })
    }

    const { error } = await supabase
      .from("site_config")
      .upsert(
        { key: "installation_within", value: installation_within, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )

    if (error) {
      console.error("[siteConfig] upsert error:", error)
      return res.status(500).json({ error: "Failed to save config" })
    }
  }

  return res.json({ success: true, installation_within })
}
