export type TechnicianDTO = {
  services: any
  id: string
  name: string
  role: string
  photo_url: string
}

export async function getTechnicians(): Promise<TechnicianDTO[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch technicians")

  return res.json()
}