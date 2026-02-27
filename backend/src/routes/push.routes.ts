import { Router } from "express"

const router = Router()

// TEMP storage (later you can save DB)
export let subscriptions: any[] = []

router.post("/subscribe", (req, res) => {
  const subscription = req.body
  subscriptions.push(subscription)
  res.json({ success: true })
})

export default router