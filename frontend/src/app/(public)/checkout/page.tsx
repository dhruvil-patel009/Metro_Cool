"use client"

import { useCart } from "@/app/context/CartContext"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {

  const router = useRouter()

  const { cart, total } = useCart()

  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [apt, setApt] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | null>(null)

  const razorpayOpened = useRef(false)

  /* TAX */

  const tax = total * 0.18
  const finalAmount = total + tax

  /* LOAD ADDRESSES */

  const applyAddress = (addr: any) => {

    setSelectedAddressId(addr.id)

    setFullName(addr.full_name)
    setPhone(addr.phone)
    setStreet(addr.street)
    setApt(addr.apartment)
    setCity(addr.city)
    setZip(addr.postal_code)

  }

  useEffect(() => {

    const token = localStorage.getItem("accessToken")

    fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {

        setSavedAddresses(data.addresses)

        const defaultAddress = data.addresses.find((a: any) => a.is_default)

        if (defaultAddress) {
          applyAddress(defaultAddress)
        }

      })

  }, [])

  /* CREATE ORDER */

  const createOrder = async () => {

    const token = localStorage.getItem("accessToken")

    const res = await fetch(`${API_URL}/orders`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        items: cart,
        customer_name: fullName,
        phone,
        address: { street, city, zip },
        total_amount: finalAmount
      })

    })

    const data = await res.json()

    return data.order.id

  }

  /* LOAD RAZORPAY */

  const loadRazorpay = () => {

    return new Promise<void>((resolve, reject) => {

      if (window.Razorpay) {
        resolve()
        return
      }

      const script = document.createElement("script")

      script.src = "https://checkout.razorpay.com/v1/checkout.js"

      script.onload = () => resolve()

      script.onerror = () => reject()

      document.body.appendChild(script)

    })

  }

  /* ONLINE PAYMENT */

  const handleRazorpay = async () => {

    if (razorpayOpened.current) return
    razorpayOpened.current = true

    await loadRazorpay()

    const orderId = await createOrder()

    const token = localStorage.getItem("accessToken")

    const orderRes = await fetch(`${API_URL}/payments/razorpay-order`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        booking_id: orderId,
        amount: finalAmount
      })

    })

    const orderData = await orderRes.json()

    const options = {

      key: orderData.key,
      order_id: orderData.orderId,
      amount: Math.round(finalAmount * 100),
      currency: "INR",

      name: "Metro Cool",

      handler: async function (response: any) {

        await fetch(`${API_URL}/payments/verify`, {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            booking_id: orderId,
            ...response
          })

        })

        router.push("/checkout/order-success")

      }

    }

    const rzp = new window.Razorpay(options)

    rzp.open()

  }

  /* COD */

  const handleCOD = async () => {

    await createOrder()

    router.push("/checkout/order-success")

  }

  /* CHECKOUT */

  const handleCheckout = () => {

    if (!paymentMethod) {
      toast.error("Select payment method")
      return
    }

    if (paymentMethod === "upi") handleRazorpay()
    if (paymentMethod === "cod") handleCOD()

  }

  return (

    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* ADDRESS CARDS */}

          <div className="bg-white rounded-xl border p-6">

            <h2 className="font-bold mb-4">Service Location</h2>

            {savedAddresses.map(addr => {

              const formatted =
                `${addr.street}, ${addr.apartment ?? ""}, ${addr.city}, ${addr.state} ${addr.postal_code}`

              return (

                <button
                  key={addr.id}
                  onClick={() => applyAddress(addr)}
                  className={`w-full text-left border rounded-lg p-4 mb-3 ${selectedAddressId === addr.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                    }`}
                >

                  <p className="font-semibold">
                    {addr.label}

                    {addr.is_default && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}

                  </p>

                  <p className="text-sm">{addr.full_name}</p>
                  <p className="text-xs text-gray-500">{formatted}</p>
                  <p className="text-xs text-gray-500">{addr.phone}</p>

                </button>

              )

            })}

          </div>

          {/* ADDRESS FORM */}

          <div className="bg-white rounded-xl border p-6">

            <div className="grid grid-cols-2 gap-4">

              <input value={fullName} onChange={e => setFullName(e.target.value)} className="border p-3 rounded-lg" />

              <input value={phone} onChange={e => setPhone(e.target.value)} className="border p-3 rounded-lg" />

            </div>

            <input value={street} onChange={e => setStreet(e.target.value)} className="border p-3 rounded-lg w-full mt-4" />

            <div className="grid grid-cols-2 gap-4 mt-4">

              <input value={apt} onChange={e => setApt(e.target.value)} className="border p-3 rounded-lg" />

              <input value={city} onChange={e => setCity(e.target.value)} className="border p-3 rounded-lg" />

            </div>

            <input value={zip} onChange={e => setZip(e.target.value)} className="border p-3 rounded-lg w-full mt-4" />

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-xl border p-6 h-fit">

          <h2 className="font-bold mb-4">Order Summary</h2>

          {cart.map(item => (
            <div key={item.id} className="flex gap-3 border-b pb-3 mb-3">

              <img src={item.image} className="w-16 h-16 rounded-md" />

              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.capacity}</p>
                <p className="text-blue-600 font-semibold">
                  ₹{item.price} × {item.qty}
                </p>
              </div>

            </div>
          ))}

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between">
              <span>GST 18%</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>

          </div>

          {/* PAYMENT */}

          <div className="mt-6 space-y-3">

            <label className={`flex justify-between border p-3 rounded-lg cursor-pointer ${paymentMethod === "upi" ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}>
              <span>Online Payment</span>

              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
            </label>

            <label className={`flex justify-between border p-3 rounded-lg cursor-pointer ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}>
              <span>Cash on Delivery</span>

              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
            </label>

          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
          >

            Place Order

          </button>

        </div>

      </div>

    </div>

  )

}
