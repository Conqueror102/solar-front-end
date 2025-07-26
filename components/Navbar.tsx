"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartDrawer } from "@/components/CartDrawer"
import { useCart } from "@/hooks/useCart"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  // Simulate user login state
  const isLoggedIn = false // Replace with real auth logic

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span
                className={`font-bold transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"} text-primary`}
              >
                SolarTech
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/shop" className="text-gray-700 hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/brand" className="text-gray-700 hover:text-primary transition-colors">
                Brand
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/checkout" className="text-gray-700 hover:text-primary transition-colors">
                Checkout
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Login / Register
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white border-t`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Remove mobile search bar here */}
            <Link href="/shop" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              Shop
            </Link>
            <Link href="/brand" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              Brand
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
            <Link href="/checkout" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              Checkout
            </Link>
            {isLoggedIn ? (
              <Link href="/account" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Account
              </Link>
            ) : (
              <Link href="/login" className="block py-2 text-gray-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
