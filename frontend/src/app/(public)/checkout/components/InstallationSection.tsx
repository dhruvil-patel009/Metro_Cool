"use client"

import { useEffect, useState } from "react"
import { Check, X, Wrench, Users, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react"
import {
  getInstallationConfig,
  InstallationChargesConfig,
  InstallationPlan,
} from "@/app/lib/installationCharges"
import { formatINR } from "@/app/lib/currency"
import { CartItem } from "@/app/context/CartContext"

interface ItemInstallState {
  /** null = no installation chosen for this item */
  planId: string | null
}

interface Props {
  cartItems: CartItem[]
  /** called whenever any item's installation plan changes */
  onChange: (installMap: Record<string, number | null>) => void
}

export function InstallationSection({ cartItems, onChange }: Props) {
  const [config, setConfig] = useState<InstallationChargesConfig | null>(null)
  // map of "itemId+capacity" → selected planId | null
  const [selections, setSelections] = useState<Record<string, string | null>>({})
  // which item cards are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const cfg = getInstallationConfig()
    setConfig(cfg)
  }, [])

  // Notify parent whenever selections change
  useEffect(() => {
    if (!config) return
    const installMap: Record<string, number | null> = {}
    cartItems.forEach(item => {
      const key = item.id + item.capacity
      const planId = selections[key] ?? null
      const plan = planId ? config.plans.find(p => p.id === planId) : null
      installMap[key] = plan ? Number(plan.price) : null
    })
    onChange(installMap)
  }, [selections, config]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!config || config.plans.length === 0) return null

  const handlePlanClick = (itemKey: string, planId: string) => {
    setSelections(prev => ({
      ...prev,
      // clicking the already-selected plan deselects it
      [itemKey]: prev[itemKey] === planId ? null : planId,
    }))
  }

  const toggleExpand = (itemKey: string) => {
    setExpanded(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
              {config.heading}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Optional — choose per product</p>
          </div>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
          MOST TRUSTED
        </span>
      </div>

      {/* Trust line */}
      <div className="px-5 py-2.5 bg-blue-50/40 border-b border-blue-100 flex items-center gap-2">
        <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <p className="text-[11px] sm:text-xs font-medium text-blue-700">{config.trustLine}</p>
      </div>

      {/* One card per cart item */}
      <div className="divide-y divide-gray-50">
        {cartItems.map(item => {
          const key = item.id + item.capacity
          const selectedPlanId = selections[key] ?? null
          const selectedPlan = selectedPlanId
            ? config.plans.find(p => p.id === selectedPlanId) ?? null
            : null
          const isOpen = expanded[key] ?? false

          return (
            <div key={key} className="px-4 sm:px-5 py-4">
              {/* Item header row */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-gray-400">{item.capacity}</p>
                </div>
                {/* Selected plan badge or "not added" */}
                <div className="shrink-0 text-right">
                  {selectedPlan ? (
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Added
                      </span>
                      <span className="text-xs font-bold text-blue-700">{formatINR(Number(selectedPlan.price))}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium">No installation</span>
                  )}
                </div>
              </div>

              {/* Plan picker — always visible on mobile, collapsible hint */}
              <div className="space-y-2">
                {config.plans.map(plan => {
                  const isSelected = selectedPlanId === plan.id
                  return (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanClick(key, plan.id)}
                      className={`w-full text-left rounded-xl border-2 px-3 py-2.5 transition-all duration-150 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Radio / deselect indicator */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        {/* Label + badge */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                              {plan.label}
                            </span>
                            {plan.badge && (
                              <span className={`text-[9px] sm:text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md ${plan.badgeColor ?? "bg-green-500"}`}>
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <span className={`text-xs sm:text-sm font-bold shrink-0 ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                          {formatINR(Number(plan.price))}
                        </span>
                      </div>

                      {/* Click-again hint when selected */}
                      {isSelected && (
                        <p className="mt-1.5 text-[10px] text-blue-500/70 pl-6">
                          Tap again to remove
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Includes / Excludes — collapsed by default, toggle */}
              <button
                onClick={() => toggleExpand(key)}
                className="mt-2.5 flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {isOpen ? "Hide" : "What's included?"}
              </button>

              {isOpen && (
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Includes</p>
                    <ul className="space-y-1.5">
                      {config.includes.map(inc => (
                        <li key={inc} className="flex items-start gap-1.5 text-[11px] font-medium text-gray-700">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Excludes</p>
                    <ul className="space-y-1.5">
                      {config.excludes.map(exc => (
                        <li key={exc} className="flex items-start gap-1.5 text-[11px] font-medium text-gray-500">
                          <X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footnote */}
      <p className="px-5 pb-3 text-[10px] text-gray-400 text-center border-t border-gray-50 pt-2.5">
        {config.footnote}
      </p>
    </div>
  )
}
