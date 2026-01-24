const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getBookedDates(serviceId: string, month: string) {
  const res = await fetch(
    `${API_URL}/api/bookings/dates?serviceId=${serviceId}&month=${month}`
  )
  return res.json()
}

export async function createBooking(payload: {
  serviceId: string
  bookingDate: string
  timeSlot: string
}) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error("Booking failed")
  return res.json()
}
