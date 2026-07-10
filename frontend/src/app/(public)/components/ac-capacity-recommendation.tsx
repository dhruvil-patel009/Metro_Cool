"use client"

import { Home, Thermometer, Check, X } from "lucide-react"
import { useRoomSize, ROOM_OPTIONS, RoomOption } from "@/app/context/RoomSizeContext"

/**
 * Compact sidebar widget for room-size → AC capacity recommendation.
 * Uses shared RoomSizeContext so the selection persists across pages.
 */
export function ACCapacityRecommendation() {
  const { selectedRoom, setSelectedRoom, clearSelection } = useRoomSize()

  const handleSelect = (option: RoomOption) => {
    if (selectedRoom?.id === option.id) {
      clearSelection()
    } else {
      setSelectedRoom(option)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <Home className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Room Size Guide</h3>
      </div>

      {/* Room Options */}
      <div className="space-y-1.5">
        {ROOM_OPTIONS.map((option) => {
          const isSelected = selectedRoom?.id === option.id
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150 group ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Radio */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight ${
                    isSelected ? "text-blue-900" : "text-gray-700"
                  }`}>
                    {option.range}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{option.label}</p>
                </div>

                {/* Capacity badge */}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {option.capacity}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Recommendation result */}
      {selectedRoom && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              Recommended
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {selectedRoom.capacity} AC
          </p>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            {selectedRoom.description}
          </p>
        </div>
      )}

      {/* Clear */}
      {selectedRoom && (
        <button
          onClick={clearSelection}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 font-medium transition-colors"
        >
          <X className="w-3 h-3" />
          Clear room selection
        </button>
      )}
    </div>
  )
}
