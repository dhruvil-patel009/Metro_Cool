import { Router } from "express"
import { sendPush } from "../utils/push.js"
import { currentSubscription } from "../pushStore.js"

const router = Router()

let subscription = currentSubscription  // memory only

// Subscribe
router.post("/subscribe", (req, res) => {
  subscription = req.body
  console.log("User subscribed 🔔")
  res.json({ success: true })
})

// Test Push
router.post("/send", async (req, res) => {
  if (!subscription) {
    return res.status(400).json({ message: "No subscription found" })
  }

  const payload = {
    title: "Metro Cool 🔧",
    body: "Your service update is here!",
    url: "https://metro-cool.com"
  }

  await sendPush(subscription, payload)

  res.json({ success: true })
})

export default router