"use client"

import { useEffect, useState } from "react"
import {
  Plus, Trash2, Save, RotateCcw, GripVertical,
  Wrench, CheckCircle2, AlertCircle, Pencil, X, Check,
} from "lucide-react"
import {
  getInstallationConfig,
  saveInstallationConfig,
  resetInstallationConfig,
  DEFAULT_CONFIG,
  InstallationChargesConfig,
  InstallationPlan,
} from "@/app/lib/installationCharges"

/* ─── tiny helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 9)

const BADGE_COLORS = [
  { label: "Green",  value: "bg-green-500"  },
  { label: "Blue",   value: "bg-blue-500"   },
  { label: "Red",    value: "bg-red-500"    },
  { label: "Amber",  value: "bg-amber-500"  },
  { label: "Purple", value: "bg-purple-500" },
]

export default function InstallationChargesAdminPage() {
  const [config, setConfig] = useState<InstallationChargesConfig>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [draftPlan, setDraftPlan] = useState<InstallationPlan | null>(null)
  const [newInclude, setNewInclude] = useState("")
  const [newExclude, setNewExclude] = useState("")

  useEffect(() => {
    setConfig(getInstallationConfig())
  }, [])

  /* ── persist ── */
  const handleSave = () => {
    saveInstallationConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    if (!confirm("Reset to default values?")) return
    resetInstallationConfig()
    setConfig(DEFAULT_CONFIG)
    setEditingPlanId(null)
    setDraftPlan(null)
  }

  /* ── plans ── */
  const startEditPlan = (plan: InstallationPlan) => {
    setEditingPlanId(plan.id)
    setDraftPlan({ ...plan })
  }

  const cancelEditPlan = () => {
    setEditingPlanId(null)
    setDraftPlan(null)
  }

  const saveEditPlan = () => {
    if (!draftPlan) return
    setConfig((c) => ({
      ...c,
      plans: c.plans.map((p) => (p.id === draftPlan.id ? draftPlan : p)),
    }))
    setEditingPlanId(null)
    setDraftPlan(null)
  }

  const addPlan = () => {
    const newPlan: InstallationPlan = {
      id: uid(),
      label: "New Plan",
      price: 0,
      description: "Description here",
      isRecommended: false,
    }
    setConfig((c) => ({ ...c, plans: [...c.plans, newPlan] }))
    startEditPlan(newPlan)
  }

  const deletePlan = (id: string) => {
    setConfig((c) => ({ ...c, plans: c.plans.filter((p) => p.id !== id) }))
    if (editingPlanId === id) cancelEditPlan()
  }

  const setRecommended = (id: string) => {
    setConfig((c) => ({
      ...c,
      plans: c.plans.map((p) => ({ ...p, isRecommended: p.id === id })),
    }))
  }

  /* ── includes / excludes ── */
  const addListItem = (key: "includes" | "excludes", value: string) => {
    const v = value.trim()
    if (!v) return
    setConfig((c) => ({ ...c, [key]: [...c[key], v] }))
    key === "includes" ? setNewInclude("") : setNewExclude("")
  }

  const removeListItem = (key: "includes" | "excludes", idx: number) => {
    setConfig((c) => ({ ...c, [key]: c[key].filter((_, i) => i !== idx) }))
  }

  /* ─────────── UI ─────────── */
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Installation Charges</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage plans displayed on the product page</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
            }`}
          >
            {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Section 1: Header text ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">1</span>
          Section Text
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Heading</label>
            <input
              value={config.heading}
              onChange={(e) => setConfig((c) => ({ ...c, heading: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Trust Line</label>
            <input
              value={config.trustLine}
              onChange={(e) => setConfig((c) => ({ ...c, trustLine: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Footnote</label>
            <input
              value={config.footnote}
              onChange={(e) => setConfig((c) => ({ ...c, footnote: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Plans ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">2</span>
            Installation Plans
          </h2>
          <button
            onClick={addPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Plan
          </button>
        </div>

        <div className="space-y-3">
          {config.plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`rounded-xl border-2 transition-all ${
                editingPlanId === plan.id
                  ? "border-blue-400 bg-blue-50/30"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              {/* View row */}
              {editingPlanId !== plan.id ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-800">{plan.label}</span>
                      {plan.badge && (
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${plan.badgeColor ?? "bg-green-500"}`}>
                          {plan.badge}
                        </span>
                      )}
                      {plan.isRecommended && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEditPlan(plan)}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={config.plans.length <= 1}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Edit form */
                draftPlan && (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Plan Label</label>
                        <input
                          value={draftPlan.label}
                          onChange={(e) => setDraftPlan((d) => d && ({ ...d, label: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={draftPlan.price}
                          onChange={(e) => setDraftPlan((d) => d && ({ ...d, price: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Description</label>
                        <input
                          value={draftPlan.description}
                          onChange={(e) => setDraftPlan((d) => d && ({ ...d, description: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Badge Text (optional)</label>
                        <input
                          value={draftPlan.badge ?? ""}
                          onChange={(e) => setDraftPlan((d) => d && ({ ...d, badge: e.target.value || undefined }))}
                          placeholder="e.g. EXPRESS"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Badge Color</label>
                        <select
                          value={draftPlan.badgeColor ?? "bg-green-500"}
                          onChange={(e) => setDraftPlan((d) => d && ({ ...d, badgeColor: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
                        >
                          {BADGE_COLORS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Recommended toggle */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                      <div
                        onClick={() => setDraftPlan((d) => d && ({ ...d, isRecommended: !d.isRecommended }))}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          draftPlan.isRecommended ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          draftPlan.isRecommended ? "left-[22px]" : "left-0.5"
                        }`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        Mark as Recommended (pre-selected for users)
                      </span>
                    </label>

                    {/* Action row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={saveEditPlan}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Apply
                      </button>
                      <button
                        onClick={cancelEditPlan}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {config.plans.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">
            No plans yet — click "Add Plan" above.
          </div>
        )}
      </div>

      {/* ── Section 3: Includes & Excludes ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">3</span>
          Includes &amp; Excludes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Includes */}
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-2.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> What's Included
            </p>
            <ul className="space-y-1.5 mb-3">
              {config.includes.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-800">
                  <span className="flex-1">{item}</span>
                  <button
                    onClick={() => removeListItem("includes", i)}
                    className="text-emerald-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addListItem("includes", newInclude)}
                placeholder="Add item…"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
              <button
                onClick={() => addListItem("includes", newInclude)}
                className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Excludes */}
          <div>
            <p className="text-xs font-bold text-red-600 mb-2.5 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> What's Excluded
            </p>
            <ul className="space-y-1.5 mb-3">
              {config.excludes.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-700">
                  <span className="flex-1">{item}</span>
                  <button
                    onClick={() => removeListItem("excludes", i)}
                    className="text-red-300 hover:text-red-600 transition-colors shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                value={newExclude}
                onChange={(e) => setNewExclude(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addListItem("excludes", newExclude)}
                placeholder="Add item…"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
              <button
                onClick={() => addListItem("excludes", newExclude)}
                className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live preview hint ── */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 font-medium">
          Click <strong>Save Changes</strong> above, then open any product page in the same browser to see your updates live.
        </p>
      </div>
    </div>
  )
}
