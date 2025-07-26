"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name || !email || !password || !confirm) {
      setError("All fields are required.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 1000))
      // Redirect or set auth state here
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-green-700">Create Your SolarTech Account</h1>
          <p className="text-gray-500 mt-2 text-center">Sign up to start shopping and managing your orders.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="flex justify-between text-sm mt-2">
              <Link href="/login" className="text-green-700 hover:underline">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 