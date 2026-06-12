"use client"

/**
 * PageLoader — full-page centred spinner used while data loads.
 * Usage: if (loading) return <PageLoader />
 */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-400 font-medium">{label}</p>
    </div>
  )
}

/**
 * SkeletonLine — animated shimmer bar.
 * @param className — width / height / rounded tailwind classes
 */
export function SkeletonLine({ className = "w-full h-4" }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  )
}

/**
 * CardSkeleton — a placeholder card matching typical list-item layout.
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-1/2 h-4" />
          <SkeletonLine className="w-1/3 h-3" />
        </div>
        <SkeletonLine className="w-20 h-6 rounded-full" />
      </div>
      <SkeletonLine className="w-full h-3" />
      <SkeletonLine className="w-3/4 h-3" />
    </div>
  )
}

/**
 * OrdersSkeletonList — matches the order history page cards.
 */
export function OrdersSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * ProfileSkeleton — matches the profile page layout.
 */
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <SkeletonLine className="w-1/3 h-5" />
          <SkeletonLine className="w-1/4 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SkeletonLine className="h-12 rounded-lg" />
        <SkeletonLine className="h-12 rounded-lg" />
        <SkeletonLine className="col-span-2 h-12 rounded-lg" />
      </div>
    </div>
  )
}
