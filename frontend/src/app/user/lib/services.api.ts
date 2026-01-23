export type ServiceDTO = {
  badge: undefined
  badge_color: string
  rating: number
  short_description: any
  id: string
  title: string
  category: string
  price: number
  description: string
  image_url: string | null
}

export async function getServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch services")
  }

  return res.json()
}
