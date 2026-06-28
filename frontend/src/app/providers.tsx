"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { CartProvider } from "./context/CartContext"

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,  // avoid spam refetch on tab switch
            refetchOnMount: false,        // don't refetch if data is fresh
            staleTime: 60 * 1000,         // 1min — data stays fresh longer
            gcTime: 10 * 60 * 1000,       // 10min cache before GC
            retry: 1,
            retryDelay: 1000,
          },
          mutations: {
            retry: 0,                     // don't retry mutations
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {children}
      </CartProvider>
    </QueryClientProvider>
  )
}
