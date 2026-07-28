"use client"

import { useEffect, useState } from "react"
import { Check, X, Users, Wrench, ShieldCheck, Wrench as WrenchIcon } from "lucide-react"
import {
  getInstallationConfig,
  InstallationChargesConfig,
  InstallationPlan,
} from "@/app/lib/installationCharges"
import { formatINR } from "@/app/lib/currency"

interface Props {
  productPrice: number
  onPlanChange?: (plan: InstallationPlan | null) => void
}

export function InstallationCharges({ productPrice, onPlanChange }: Props) {
  const [config, setConfig] = useState<InstallationChargesConfig | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

  // Always coerce to number to avoid string concatenation in bundleTotal
  const safeProductPrice = Number(productPrice) || 0

  useEffect(() => {
    const cfg = getInstallationConfig()
    setConfig(cfg)
    const recommended = cfg.plans.find((p) => p.isRecommended) ?? cfg.plans[0]
    if (recommended) {
      setSelectedPlanId(recommended.id)
      onPlanChange?.(recommended)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!config || config.plans.length === 0) return null

  const selectedPlan = config.plans.find((p) => p.id === selectedPlanId) ?? config.plans[0]
  // Explicit Number() coercion on both sides prevents string concatenation
  const bundleTotal = safeProductPrice + Number(selectedPlan.price)

  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-blue-600" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                {config.heading}
              </h2>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
              MOST TRUSTED
            </span>
          </div>

          {/* Trust line */}
          <div className="mt-2.5 flex items-center gap-2 bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-2">
            <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-blue-700">
              {config.trustLine}
            </p>
          </div>
        </div>

        {/* ── Plans ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2.5">
          {config.plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId
            return (
              <button
                key={plan.id}
                onClick={() => {
                  setSelectedPlanId(plan.id)
                  onPlanChange?.(plan)
                }}
                className={`w-full text-left rounded-xl border-2 px-3 sm:px-4 py-3 transition-all duration-150 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 shadow-sm"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/20"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Radio dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Label + badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                        {plan.label}
                      </span>
                      {plan.badge && (
                        <span className={`text-[9px] sm:text-[10px] font-bold text-white px-1.5 sm:px-2 py-0.5 rounded-md ${plan.badgeColor ?? "bg-green-500"}`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 truncate">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <span className={`text-xs sm:text-sm font-bold shrink-0 ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                    {formatINR(Number(plan.price))}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Includes / Excludes ── */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Includes */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Includes
              </p>
              <ul className="space-y-1.5">
                {config.includes.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-gray-700">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excludes */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Excludes
              </p>
              <ul className="space-y-1.5">
                {config.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-gray-500">
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bundle total footer ── */}
        <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 rounded-2xl bg-[#0f172a] px-4 sm:px-5 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300 truncate">
                  Total Peace of Mind Bundle
                </p>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                AC + {selectedPlan.label}
              </p>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white shrink-0">
              {formatINR(bundleTotal)}
            </span>
          </div>
        </div>

        {/* Footnote */}
        <p className="px-4 sm:px-6 pb-3 sm:pb-4 text-[10px] text-gray-400 text-center">
          {config.footnote}
        </p>
      </div>
    </div>
  )
}
