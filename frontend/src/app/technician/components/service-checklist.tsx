"use client"

import { CheckSquare, Square } from "lucide-react"
import { useState } from "react"
import { cn } from "@/app/lib/utils"

export function ServiceChecklist() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Inspect outdoor condenser unit", completed: true },
    { id: 2, text: "Check refrigerant levels", completed: true },
    { id: 3, text: "Clean evaporator coils", completed: false },
    { id: 4, text: "Test thermostat functionality", completed: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Service Checklist</h3>
        <div className="bg-cyan-50 text-[#0891b2] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-cyan-100">
          {completedCount}/{tasks.length} Completed
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
              task.completed
                ? "bg-slate-50/50 border-slate-100 text-slate-400"
                : "bg-white border-slate-100 text-slate-600 hover:border-[#0891b2]/30 hover:shadow-sm",
            )}
          >
            <div
              className={cn(
                "shrink-0 transition-colors",
                task.completed ? "text-[#0891b2]" : "text-slate-200 group-hover:text-slate-300",
              )}
            >
              {task.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
            </div>
            <span className={cn("font-bold text-sm", task.completed && "line-through")}>{task.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
