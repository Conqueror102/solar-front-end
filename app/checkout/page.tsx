"use client"

import { useCart } from "@/hooks/useCart"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { format } from 'date-fns'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// Add a mock for user authentication and pre-filled data
const mockUser = {
  isLoggedIn: false, // set to true to simulate logged-in user
  firstName: "IDOKO",
  lastName: "TOCHUKWU",
  email: "victorvector608@gmail.com",
  phone: "+2348025383208",
  address: "Ajegunle apapa lagos",
  address2: "No.59 ekundayo street ajeromi ifelodun L.G.A",
  city: "Ajegunle",
  state: "Lagos",
  country: "Nigeria",
  company: "",
}

const paymentMethods = [
  { value: "bank", label: "Direct bank transfer" },
  { value: "card", label: "Debit/Credit Cards" },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  // Billing fields
  const [billing, setBilling] = useState({
    firstName: mockUser.isLoggedIn ? mockUser.firstName : "",
    lastName: mockUser.isLoggedIn ? mockUser.lastName : "",
    company: mockUser.isLoggedIn ? mockUser.company : "",
    country: mockUser.isLoggedIn ? mockUser.country : "Nigeria",
    address: mockUser.isLoggedIn ? mockUser.address : "",
    address2: mockUser.isLoggedIn ? mockUser.address2 : "",
    city: mockUser.isLoggedIn ? mockUser.city : "",
    state: mockUser.isLoggedIn ? mockUser.state : "",
    phone: mockUser.isLoggedIn ? mockUser.phone : "",
    email: mockUser.isLoggedIn ? mockUser.email : "",
    notes: "",
  })
  const [createAccount, setCreateAccount] = useState(false)
  const [shipDiff, setShipDiff] = useState(false)
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "Nigeria",
    phone: "",
  })
  // Payment fields
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const [isPaying, setIsPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [success, setSuccess] = useState(false)

  // Copy shipping to billing if checkbox is checked
  useEffect(() => {
    if (shipDiff) {
      setShipping({ ...billing })
    }
  }, [shipDiff, billing])

  const shippingCost = total > 500 ? 0 : 49.99
  const tax = total * 0.08
  const finalTotal = total + shippingCost + tax

  // Validation helpers
  function isShippingValid() {
    return Object.values(shipping).every((v) => v.trim() !== "")
  }
  function isBillingValid() {
    return billing.firstName.trim() !== "" && billing.lastName.trim() !== "" && billing.address.trim() !== "" && billing.city.trim() !== "" && billing.state.trim() !== "" && billing.phone.trim() !== "" && billing.email.trim() !== ""
  }
  function isCardValid() {
    return (
      /^\d{16}$/.test(card.number.replace(/\s/g, "")) &&
      /^\d{2}\/\d{2}$/.test(card.expiry) &&
      /^\d{3,4}$/.test(card.cvc) &&
      card.name.trim() !== ""
    )
  }

  async function handlePay() {
    setError("")
    if (!isBillingValid()) {
      setError("Please fill out all billing fields.")
      return
    }
    if (shipDiff && !isShippingValid()) {
      setError("Please fill out all shipping fields.")
      return
    }
    if (!isCardValid()) {
      setError("Please enter valid payment details.")
      return
    }
    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }
    setIsPaying(true)
    // Prepare payload for backend
    const payload = {
      items,
      billing: billing,
      shipping: shipDiff ? shipping : billing,
      payment: card,
      total: finalTotal,
    }
    // TODO: Replace with real endpoint
    try {
      // await fetch("/api/checkout", { method: "POST", body: JSON.stringify(payload) })
      await new Promise((resolve) => setTimeout(resolve, 1200)) // Simulate
      setPaid(true)
      clearCart()
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase. Your order is being processed.",
      })
    } catch (e) {
      setError("Payment failed. Please try again.")
    } finally {
      setIsPaying(false)
    }
  }

  async function handlePayNow() {
    setShowPaymentModal(true)
    setIsProcessingPayment(true)
    // Simulate payment processing and email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessingPayment(false)
    setShowPaymentModal(false)
    setSuccess(true)
    // Simulate email sending (could add toast or log here)
  }
  function handleCloseSuccess() {
    setSuccess(false)
    setStep('form')
    setOrderNumber(null)
    clearCart()
  }

  function handlePlaceOrder() {
    // Generate a mock order number and go to confirmation step
    setOrderNumber((Math.floor(Math.random() * 90000) + 10000).toString())
    setStep('confirm')
  }
  function handleCancelOrder() {
    // Restore cart and go back to form
    setStep('form')
    setOrderNumber(null)
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-xl w-full text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="mb-4">Thank you for your order. A confirmation email has been sent to <span className="font-semibold">{billing.email}</span>.</p>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded text-base transition-colors"
            onClick={handleCloseSuccess}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (step === 'confirm' && orderNumber) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-xl w-full">
          <ul className="mb-6 text-gray-700 text-base">
            <li>Order number: <span className="font-bold">{orderNumber}</span></li>
            <li>Date: <span className="font-bold">{format(new Date(), 'PPP')}</span></li>
            <li>Total: <span className="font-bold text-yellow-600">₦{(total + 5000).toLocaleString()}</span></li>
            <li>Payment method: <span className="font-bold">{selectedPayment === 'card' ? 'Debit/Credit Cards' : 'Direct bank transfer'}</span></li>
          </ul>
          <div className="mb-6 text-gray-700">
            Thank you for your order, please click the button below to pay with {selectedPayment === 'card' ? 'Paystack' : 'bank transfer'}.
          </div>
          <div className="flex gap-4">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded text-base transition-colors"
              type="button"
              onClick={handlePayNow}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Pay Now'}
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded text-base transition-colors"
              type="button"
              onClick={handleCancelOrder}
              disabled={isProcessingPayment}
            >
              Cancel Order & Restore Cart
            </button>
          </div>
        </div>
        {/* Payment Modal (simulated) */}
        <Dialog open={showPaymentModal} onOpenChange={() => {}}>
          <DialogContent className="max-w-md w-full flex flex-col items-center">
            <div className="mb-4 text-2xl font-bold">Paystack Payment</div>
            <div className="mb-4 text-gray-700">Processing your payment...</div>
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // UI for states
  const states = ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna"]

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">First name <span className="text-red-500">*</span></label>
                <Input value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Last name <span className="text-red-500">*</span></label>
                <Input value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} required />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Company name <span className="text-gray-400">(optional)</span></label>
              <Input value={billing.company} onChange={e => setBilling(b => ({ ...b, company: e.target.value }))} />
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Country / Region <span className="text-red-500">*</span></label>
              <Input value={billing.country} readOnly className="bg-gray-100" />
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Street address <span className="text-red-500">*</span></label>
              <Input value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} placeholder="Street address" required />
              <Input value={billing.address2} onChange={e => setBilling(b => ({ ...b, address2: e.target.value }))} placeholder="Apartment, suite, unit, etc. (optional)" className="mt-2" />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Town / City <span className="text-red-500">*</span></label>
                <Input value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">State <span className="text-red-500">*</span></label>
                <select value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} className="w-full border rounded px-3 py-2">
                  <option value="">Select state</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Phone <span className="text-red-500">*</span></label>
                <Input value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email address <span className="text-red-500">*</span></label>
                <Input value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} required />
              </div>
            </div>
            {!mockUser.isLoggedIn && (
              <div className="mt-4 flex items-center">
                <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} className="mr-2" />
                <label className="font-medium">Create an account?</label>
              </div>
            )}
            <div className="mt-4 flex items-center">
              <input type="checkbox" checked={shipDiff} onChange={e => setShipDiff(e.target.checked)} className="mr-2" />
              <label className="font-medium">Ship to a different address?</label>
            </div>
            {shipDiff && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">First name <span className="text-red-500">*</span></label>
                    <Input value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Last name <span className="text-red-500">*</span></label>
                    <Input value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} required />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-1 font-medium">Country / Region <span className="text-red-500">*</span></label>
                  <Input value={shipping.country} readOnly className="bg-gray-100" />
                </div>
                <div className="mt-4">
                  <label className="block mb-1 font-medium">Street address <span className="text-red-500">*</span></label>
                  <Input value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} placeholder="Street address" required />
                  <Input value={shipping.address2} onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))} placeholder="Apartment, suite, unit, etc. (optional)" className="mt-2" />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Town / City <span className="text-red-500">*</span></label>
                    <Input value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">State <span className="text-red-500">*</span></label>
                    <select value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} className="w-full border rounded px-3 py-2">
                      <option value="">Select state</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-1 font-medium">Phone <span className="text-red-500">*</span></label>
                  <Input value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} required />
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="block mb-1 font-medium">Order notes <span className="text-gray-400">(optional)</span></label>
              <Input value={billing.notes} onChange={e => setBilling(b => ({ ...b, notes: e.target.value }))} placeholder="Notes about your order, e.g. special delivery instructions." />
            </div>
          </div>
        </div>
        {/* Order Summary + Payment */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
            <div className="mb-4">
              <div className="flex font-semibold border-b pb-2">
                <div className="flex-1">PRODUCT</div>
                <div className="w-32 text-right">SUBTOTAL</div>
              </div>
              {items.length === 0 ? (
                <div className="py-4 text-gray-500">Your cart is empty.</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center border-b py-2">
                    <div className="flex-1 flex items-center gap-2">
                      {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="w-32 text-right font-semibold">₦{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between py-2 border-b font-medium">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Shipping</span>
              <span>
                <label className="inline-flex items-center mr-2">
                  <input type="radio" name="shipping" defaultChecked className="mr-1" /> Delivery
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="shipping" className="mr-1" /> Local pickup
                </label>
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Flat rate:</span>
              <span className="font-medium">₦5,000.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>₦{(total + 5000).toLocaleString()}</span>
            </div>
          </div>
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
            <div className="mb-4">
              {paymentMethods.map(method => (
                <label key={method.value} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={selectedPayment === method.value}
                    onChange={() => setSelectedPayment(method.value)}
                    className="mr-2"
                  />
                  {method.label}
                  {method.value === "card" && selectedPayment === "card" && (
                    <span className="ml-4 flex items-center gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png" alt="Mastercard" className="h-5" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Verve_card_logo.png" alt="Verve" className="h-5" />
                    </span>
                  )}
                </label>
              ))}
              {selectedPayment === "card" && (
                <div className="bg-gray-50 rounded p-3 mt-2 text-gray-700 text-sm">
                  Make payment using your debit and credit cards
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="/privacy" className="underline font-medium">privacy policy</a>.
            </div>
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded text-lg transition-colors"
              type="button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 