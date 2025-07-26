import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppShell from "@/components/AppShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolarTech - Premium Solar Energy Solutions",
  description:
    "Discover high-quality solar panels, inverters, batteries, and controllers for your renewable energy needs.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
