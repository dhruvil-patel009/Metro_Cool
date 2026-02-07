"use client";

import { Check, Truck, Settings } from "lucide-react";
import { cn } from "@/app/lib/utils";

export function JobStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { icon: Check, label: "Accepted", time: "08:00 AM", status: "completed" },
    { icon: Truck, label: "On The Way", time: "08:30 AM", status: "completed" },
    {
      icon: Settings,
      label: "Working",
      status: "active",
      subLabel: "In Progress",
    },
    { icon: "4", label: "Completed", status: "upcoming" },
  ];

  return (
    <div className="flex items-center justify-between relative w-full overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
      {steps.map((step, index) => {
        const isActive = step.status === "active";
        const isCompleted = step.status === "completed";

        return (
          <div
            key={step.label}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-3 relative z-10 min-w-[100px]">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4",
                  isCompleted &&
                    "bg-blue-600 border-white text-white shadow-lg shadow-cyan-100",
                  isActive &&
                    "bg-white border-[#0891b2] text-blue-500 shadow-xl shadow-cyan-50 ring-4 ring-cyan-50",
                  !isActive &&
                    !isCompleted &&
                    "bg-slate-50 border-white text-slate-200",
                )}
              >
                {typeof step.icon === "string" ? (
                  <span className="font-black text-xl">{step.icon}</span>
                ) : (
                  <step.icon
                    className={cn("w-6 h-6", isActive && "animate-spin-slow")}
                  />
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-black tracking-tight",
                    isActive || isCompleted
                      ? "text-slate-900"
                      : "text-slate-300",
                  )}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-[10px] font-bold text-slate-400">
                    {step.time}
                  </p>
                )}
                {step.subLabel && (
                  <p className="bg-blue-600/10 text-blue-500 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase mt-1">
                    {step.subLabel}
                  </p>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-[6px] bg-slate-100 rounded-full mx-2 -translate-y-6 relative overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 bg-blue-600 transition-all duration-700",
                    isCompleted ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
