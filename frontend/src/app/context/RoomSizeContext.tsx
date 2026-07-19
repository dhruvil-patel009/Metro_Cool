"use client"

import { createContext, useContext, useEffect, useState } from "react"

/* ─── Room Size → Capacity Mapping ─── */
export const ROOM_OPTIONS = [
  {
    id: "upto-110",
    range: "Up to 110 Sq. Ft",
    label: "Small Room",
    capacity: "1.0 TR",
    capacityNum: 1.0,
    description: "Ideal for compact bedrooms, study rooms or small spaces.",
  },
  {
    id: "110-150",
    range: "110 – 150 Sq. Ft",
    label: "Standard Bedroom",
    capacity: "1.5 TR",
    capacityNum: 1.5,
    description: "Best for standard bedrooms with moderate sunlight exposure.",
  },
  {
    id: "150-200",
    range: "150 – 200 Sq. Ft",
    label: "Large Bedroom",
    capacity: "1.9 TR",
    capacityNum: 1.9,
    description: "Perfect for spacious bedrooms or medium-sized rooms.",
  },
  {
    id: "200-240",
    range: "200 – 240 Sq. Ft",
    label: "Master Bedroom",
    capacity: "2.2 TR",
    capacityNum: 2.2,
    description: "Suitable for master bedrooms or rooms with higher heat load.",
  },
  {
    id: "240-270",
    range: "240 – 270 Sq. Ft",
    label: "Large Room",
    capacity: "2.5 TR",
    capacityNum: 2.5,
    description: "Recommended for large rooms or open-plan spaces.",
  },
  {
    id: "270-300",
    range: "270 – 300 Sq. Ft",
    label: "Living Room",
    capacity: "3.0 TR",
    capacityNum: 3.0,
    description: "Ideal for spacious living rooms with good airflow demand.",
  },
  {
    id: "300-350",
    range: "300 – 350 Sq. Ft",
    label: "Large Hall",
    capacity: "3.5 TR",
    capacityNum: 3.5,
    description: "Designed for large halls or semi-commercial spaces.",
  },
  {
    id: "350-400",
    range: "350 – 400 Sq. Ft",
    label: "Commercial / Hall",
    capacity: "4.0 TR",
    capacityNum: 4.0,
    description: "Best suited for large commercial areas or big halls needing powerful cooling.",
  },
] as const

/* ─── Extract numeric tonnage from any capacity string ─── */
function extractTon(capacity: string): number {
  const match = capacity.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

/* ─── Find the closest capacity in a list to a target number ─── */
function findClosestCapacity(capacities: string[], targetNum: number): string | null {
  if (!capacities.length) return null
  return capacities.reduce((best, cur) => {
    const bestDiff = Math.abs(extractTon(best) - targetNum)
    const curDiff = Math.abs(extractTon(cur) - targetNum)
    return curDiff < bestDiff ? cur : best
  })
}

export type RoomOption = (typeof ROOM_OPTIONS)[number]
export { extractTon, findClosestCapacity }

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
