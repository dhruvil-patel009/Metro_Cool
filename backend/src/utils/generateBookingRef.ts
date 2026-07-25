import { supabase } from "./supabase.js"

/**
 * Generates a human-readable booking reference.
 *
 * Format: AHM{YY}{MM}{DD}{NNNN}
 * Example: AHM260721001
 *
 *   AHM  = Ahmedabad city prefix
 *   YY   = last 2 digits of year  (26 → 2026)
 *   MM   = zero-padded month      (07 → July)
 *   DD   = zero-padded date       (21 → 21st)
 *   NNNN = 4-digit sequence for that day, starting at 0001
 */
export async function generateBookingRef(): Promise<string> {
  const now = new Date()

  const yy = String(now.getFullYear()).slice(-2)          // "26"
  const mm = String(now.getMonth() + 1).padStart(2, "0") // "07"
  const dd = String(now.getDate()).padStart(2, "0")       // "21"
  const prefix = `AHM${yy}${mm}${dd}`                    // "AHM260721"

  // Count bookings already created today with this prefix to get next sequence
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .like("booking_ref", `${prefix}%`)

  const seq = String((count ?? 0) + 1).padStart(4, "0")  // "0001", "0002" …
  return `${prefix}${seq}`                                // "AHM26072100001"
}
