"use client"

import { useState } from "react"

export default function CheckoutPage() {
  const [selectedDate, setSelectedDate] = useState("Oct 25")
  const [paymentMethod, setPaymentMethod] = useState("upi")

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">
              1. Shipping Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border rounded-md p-3 w-full"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border rounded-md p-3 w-full"
              />
            </div>

            <input
              type="text"
              placeholder="Street Address"
              className="border rounded-md p-3 w-full mt-4"
            />

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City"
                className="border rounded-md p-3 w-full"
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="border rounded-md p-3 w-full"
              />
            </div>
          </div>

          {/* Delivery Date */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">
              2. Delivery & Installation Date
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Oct 25", "Oct 26", "Oct 27", "Oct 28"].map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-lg border p-4 text-center transition ${
                    selectedDate === date
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "hover:border-blue-400"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">
              3. Payment Method
            </h2>

            <div className="space-y-4">
              {[
                { id: "upi", label: "UPI (Google Pay, PhonePe etc.)" },
                { id: "card", label: "Credit / Debit Card" },
                { id: "netbanking", label: "Net Banking" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === method.id
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <span>{method.label}</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="bg-white rounded-xl p-6 shadow-sm border h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex gap-4 border-b pb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="product"
              className="w-20 h-20 rounded-md border"
            />
            <div>
              <h4 className="font-medium">
                Metro Cool Inverter Split AC - 1.5 Ton
              </h4>
              <p className="text-blue-600 font-semibold">
                $450.00
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm mt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$450.00</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Installation</span>
              <span>$50.00</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>$12.50</span>
            </div>

            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total</span>
              <span className="text-blue-600">$512.50</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Complete Purchase →
          </button>
        </div>
      </div>
    </div>
  )
}