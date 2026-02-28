import { Router } from "express"

const router = Router()

// TEMP storage (later you can save DB)
export let subscriptions: any[] = []

router.post("/subscribe", (req, res) => {
  console.log("SUBSCRIBED USER 🔔")
  console.log(req.body)
  subscriptions.push(req.body)
  res.json({ success: true })
})

export default router