"use client"

import { createContext, useContext, useEffect, useState } from "react"

/* ─── Room Size → Capacity Mapping ─── */
export const ROOM_OPTIONS = [
  {
    id: "small",
    range: "90 – 120 sq ft",
    label: "Small Bedroom",
    capacity: "0.8 Ton",
    capacityNum: 0.8,
    description: "Ideal for compact bedrooms or small study rooms with limited sunlight.",
  },
  {
    id: "standard",
    range: "121 – 154 sq ft",
    label: "Standard Bedroom",
    capacity: "1.0 Ton",
    capacityNum: 1.0,
    description: "Best for standard bedrooms with moderate sunlight exposure.",
  },
  {
    id: "large-bedroom",
    range: "155 – 180 sq ft",
    label: "Large Bedroom",
    capacity: "1.5 Ton",
    capacityNum: 1.5,
    description: "Perfect for spacious bedrooms or medium-sized rooms with good ventilation.",
  },
  {
    id: "living",
    range: "181 – 250 sq ft",
    label: "Living Room",
    capacity: "2.0 Ton",
    capacityNum: 2.0,
    description: "Recommended for living rooms or open-plan spaces with higher cooling demand.",
  },
  {
    id: "hall",
    range: "251 – 350 sq ft",
    label: "Large Hall",
    capacity: "2.5 Ton",
    capacityNum: 2.5,
    description: "Designed for large halls, offices or commercial spaces needing powerful cooling.",
  },
] as const

export type RoomOption = (typeof ROOM_OPTIONS)[number]

interface RoomSizeContextType {
  selectedRoom: RoomOption | null
  recommendedCapacity: string | null
  setSelectedRoom: (room: RoomOption | null) => void
  clearSelection: () => void
}

const RoomSizeContext = createContext<RoomSizeContextType | null>(null)

export const useRoomSize = () => {
  const ctx = useContext(RoomSizeContext)
  if (!ctx) throw new Error("RoomSizeProvider missing")
  return ctx
}

export const RoomSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedRoom, setSelectedRoomState] = useState<RoomOption | null>(null)

  /* Load from localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem("metro_room_size")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const match = ROOM_OPTIONS.find((r) => r.id === parsed.id)
        if (match) setSelectedRoomState(match)
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  /* Save to localStorage on change */
  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem("metro_room_size", JSON.stringify({ id: selectedRoom.id }))
    } else {
      localStorage.removeItem("metro_room_size")
    }
  }, [selectedRoom])

  const setSelectedRoom = (room: RoomOption | null) => {
    setSelectedRoomState(room)
  }

  const clearSelection = () => {
    setSelectedRoomState(null)
  }

  return (
    <RoomSizeContext.Provider
      value={{
        selectedRoom,
        recommendedCapacity: selectedRoom?.capacity ?? null,
        setSelectedRoom,
        clearSelection,
      }}
    >
      {children}
    </RoomSizeContext.Provider>
  )
}
