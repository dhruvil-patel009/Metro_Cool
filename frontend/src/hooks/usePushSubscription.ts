"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/store/auth.store"
import { apiFetch } from "@/app/lib/api"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

/* ── Convert VAPID base64 string → Uint8Array (required by pushManager) ── */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw     = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

/**
 * usePushSubscription
 *
 * Registers the service worker, requests notification permission,
 * subscribes the browser to web-push, and saves the subscription
 * to the backend — all automatically when the user is logged in.
 *
 * Also listens for PLAY_NOTIFICATION_SOUND messages from the SW
 * and plays the notification sound in the page context (where
 * AudioContext is available).
 *
 * Safe to call multiple times — skips if already subscribed.
 */
export function usePushSubscription() {
  const token = useAuthStore((s) => s.token)
  const user  = useAuthStore((s) => s.user)

  /* Track whether we already ran this session to avoid re-registering */
  const didSubscribe = useRef(false)

  /* ── Sound player ── */
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PLAY_NOTIFICATION_SOUND") return
      playNotificationSound()
    }

    navigator.serviceWorker?.addEventListener("message", handleMessage)
    return () => navigator.serviceWorker?.removeEventListener("message", handleMessage)
  }, [])

  /* ── SW registration + push subscription ── */
  useEffect(() => {
    // Only run when logged in as a technician (or any role that needs push)
    if (!token || !user) return
    if (didSubscribe.current) return
    if (typeof window === "undefined") return

    // Browser support check
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[push] Web Push not supported in this browser")
      return
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set")
      return
    }

    let cancelled = false

    const register = async () => {
      try {
        /* 1. Register (or get existing) service worker */
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        /* Wait for SW to be active before subscribing */
        await navigator.serviceWorker.ready

        /* 2. Check current permission */
        const permission = await Notification.requestPermission()
        if (permission !== "granted") {
          console.warn("[push] Notification permission denied")
          return
        }

        /* 3. Check if already subscribed */
        const existing = await registration.pushManager.getSubscription()
        if (existing) {
          /* Already subscribed — just make sure backend has it */
          await saveToBackend(existing)
          didSubscribe.current = true
          return
        }

        /* 4. Subscribe */
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly:      true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })

        if (cancelled) return

        /* 5. Save to backend */
        await saveToBackend(subscription)
        didSubscribe.current = true
        console.log("[push] Subscribed and saved ✅")
      } catch (err) {
        console.error("[push] Subscription error:", err)
      }
    }

    register()
    return () => { cancelled = true }
  }, [token, user])
}

/**
 * playNotificationSound
 *
 * Synthesises a two-tone notification chime using Web Audio API.
 * No mp3 file required — works in every modern browser.
 * Falls back silently if AudioContext is blocked.
 *
 * Sound design: short high beep (880 Hz) → lower follow (660 Hz)
 * giving a classic "ding-dong" alert feel.
 */
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

    const playTone = (freq: number, startAt: number, duration: number, gain: number) => {
      const osc     = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.type      = "sine"
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt)

      // Smooth fade-in and fade-out to avoid clicking artefacts
      gainNode.gain.setValueAtTime(0, ctx.currentTime + startAt)
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startAt + 0.02)
      gainNode.gain.linearRampToValueAtTime(0,    ctx.currentTime + startAt + duration)

      osc.start(ctx.currentTime + startAt)
      osc.stop(ctx.currentTime + startAt + duration)
    }

    playTone(880, 0.0, 0.18, 0.6)   // high ding
    playTone(660, 0.2, 0.22, 0.45)  // lower dong

    // Close AudioContext after tones finish to free resources
    setTimeout(() => ctx.close(), 600)
  } catch {
    /* AudioContext unavailable or blocked — silent fail */
  }
}

/* ── POST subscription to backend ── */
async function saveToBackend(subscription: PushSubscription) {
  const json = subscription.toJSON()
  try {
    await apiFetch("/push/subscribe", {
      method:  "POST",
      body: JSON.stringify({
        endpoint: json.endpoint,
        keys: {
          p256dh: json.keys?.p256dh,
          auth:   json.keys?.auth,
        },
      }),
    })
  } catch (err) {
    console.error("[push] Failed to save subscription to backend:", err)
  }
}

