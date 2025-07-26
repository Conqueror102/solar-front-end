"use client"
import { useState } from "react"
import Link from "next/link"
import { User, Package, MapPin, CreditCard, Heart, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payment", label: "Payment methods", icon: CreditCard },
  { key: "account", label: "Account details", icon: User },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "logout", label: "Logout", icon: LogOut },
]

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
}

export default function AccountPage() {
  const [active, setActive] = useState("dashboard")
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { toast } = useToast()

  function handleNav(key: string) {
    if (key === "logout") {
      setShowLogoutModal(true)
      return
    }
    setActive(key)
  }
  function confirmLogout() {
    setShowLogoutModal(false)
    // TODO: Call logout API
    toast({ title: "Logged out", description: "You have been logged out." })
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <ul className="bg-white rounded-xl shadow p-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <li key={item.key}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium ${
                      active === item.key ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleNav(item.key)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <section className="flex-1">
            {active === "dashboard" && (
              <div>
                <h1 className="text-2xl font-bold mb-2">Hello <span className="text-green-700">{mockUser.name}</span></h1>
                <p className="text-gray-600 mb-6">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AccountCard icon={Package} label="Orders" onClick={() => setActive("orders")} />
                  <AccountCard icon={MapPin} label="Addresses" onClick={() => setActive("addresses")} />
                  <AccountCard icon={CreditCard} label="Payment methods" onClick={() => setActive("payment")} />
                  <AccountCard icon={User} label="Account details" onClick={() => setActive("account")} />
                  <AccountCard icon={Heart} label="Wishlist" onClick={() => setActive("wishlist")} />
                  <AccountCard icon={LogOut} label="Logout" onClick={() => handleNav("logout")} />
                </div>
              </div>
            )}
            {active === "orders" && <OrdersScreen />}
            {active === "addresses" && <AddressesScreen />}
            {active === "payment" && <PaymentScreen />}
            {active === "account" && <AccountDetailsScreen user={mockUser} />}
            {active === "wishlist" && <WishlistScreen />}
          </section>
        </div>
      </div>
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log out</DialogTitle></DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmLogout}>Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AccountCard({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
      onClick={onClick}
    >
      <Icon className="w-8 h-8 mb-2 text-gray-400" />
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  )
}

function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const orders = [
    { id: "ORD-001", date: "2024-01-15", status: "delivered", total: 1299, items: [
      { name: "SolarMax Pro 400W Solar Panel", quantity: 2, price: 299 },
      { name: "PowerTech 3000W Inverter", quantity: 1, price: 599 },
    ] },
    { id: "ORD-002", date: "2024-01-10", status: "shipped", total: 899, items: [
      { name: "EcoSolar 200Ah Lithium Battery", quantity: 1, price: 899 },
    ] },
    { id: "ORD-003", date: "2024-01-05", status: "processing", total: 199, items: [
      { name: "GreenEnergy MPPT 60A Controller", quantity: 1, price: 199 },
    ] },
  ]
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-gray-500">You have no orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toLocaleString()}</p>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}>
                      <span className="mr-2">{selectedOrder === order.id ? "Hide" : "View"} Details</span>
                    </Button>
                  </div>
                </div>
                {selectedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-3">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddressesScreen() {
  const [addresses, setAddresses] = useState([
    { id: "1", name: "John Doe", street: "123 Solar Street", city: "Green City", state: "CA", zip: "90210", isDefault: true },
    { id: "2", name: "John Doe", street: "456 Business Ave", city: "Tech Valley", state: "CA", zip: "90211", isDefault: false },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editAddress, setEditAddress] = useState<any>(null)
  function handleEdit(address: any) { setEditAddress(address); setShowModal(true) }
  function handleAdd() { setEditAddress(null); setShowModal(true) }
  function handleSave(address: any) {
    if (address.id) {
      setAddresses(addr => addr.map(a => a.id === address.id ? address : a))
    } else {
      setAddresses(addr => [...addr, { ...address, id: Date.now().toString() }])
    }
    setShowModal(false)
  }
  function handleDelete(id: string) {
    setAddresses(addr => addr.filter(a => a.id !== id))
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
        <CardDescription>Manage your delivery addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div key={address.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{address.name}</h3>
                {address.isDefault && <Badge variant="outline">Default</Badge>}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>Delete</Button>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setAddresses(addr => addr.map(a => a.id === address.id ? { ...a, isDefault: true } : { ...a, isDefault: false }))}>Set Default</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleAdd}>Add New Address</Button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editAddress ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader>
            <AddressForm address={editAddress} onSave={handleSave} onCancel={() => setShowModal(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
function AddressForm({ address, onSave, onCancel }: { address: any, onSave: (a: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(address || { name: "", street: "", city: "", state: "", zip: "" })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div>
        <Label>Street Address</Label>
        <Input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label>City</Label>
          <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
        </div>
        <div className="flex-1">
          <Label>State</Label>
          <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
        </div>
      </div>
      <div>
        <Label>Zip Code</Label>
        <Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} required />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </DialogFooter>
    </form>
  )
}

function PaymentScreen() {
  const [methods, setMethods] = useState([
    { id: "1", type: "Visa", last4: "1234", exp: "12/26", isDefault: true },
    { id: "2", type: "Mastercard", last4: "5678", exp: "09/25", isDefault: false },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editMethod, setEditMethod] = useState<any>(null)
  function handleEdit(method: any) { setEditMethod(method); setShowModal(true) }
  function handleAdd() { setEditMethod(null); setShowModal(true) }
  function handleSave(method: any) {
    if (method.id) {
      setMethods(m => m.map(a => a.id === method.id ? method : a))
    } else {
      setMethods(m => [...m, { ...method, id: Date.now().toString() }])
    }
    setShowModal(false)
  }
  function handleDelete(id: string) {
    setMethods(m => m.filter(a => a.id !== id))
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your saved payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {methods.map(method => (
            <div key={method.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{method.type} ending in {method.last4}</h3>
                {method.isDefault && <Badge variant="outline">Default</Badge>}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Expires {method.exp}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(method)}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(method.id)}>Delete</Button>
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setMethods(m => m.map(a => a.id === method.id ? { ...a, isDefault: true } : { ...a, isDefault: false }))}>Set Default</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleAdd}>Add New Payment Method</Button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle></DialogHeader>
            <PaymentForm method={editMethod} onSave={handleSave} onCancel={() => setShowModal(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
function PaymentForm({ method, onSave, onCancel }: { method: any, onSave: (a: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(method || { type: "Visa", last4: "", exp: "" })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <Label>Card Type</Label>
        <Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
      </div>
      <div>
        <Label>Last 4 Digits</Label>
        <Input value={form.last4} onChange={e => setForm(f => ({ ...f, last4: e.target.value }))} required maxLength={4} />
      </div>
      <div>
        <Label>Expiry</Label>
        <Input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} required placeholder="MM/YY" />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </DialogFooter>
    </form>
  )
}

function AccountDetailsScreen({ user }: { user: any }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>View and update your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setIsEditing(false) }}>
          <div>
            <Label>Full Name</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!isEditing} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!isEditing} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!isEditing} />
          </div>
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </form>
        <Separator className="my-6" />
        <Button variant="outline" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
        <ChangePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />
      </CardContent>
    </Card>
  )
}
function ChangePasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  function handleChange(e: any) {
    e.preventDefault()
    setError("")
    if (!current || !next || !confirm) {
      setError("All fields are required.")
      return
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.")
      return
    }
    if (next !== confirm) {
      setError("New passwords do not match.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
        {success ? (
          <div className="text-green-600 text-sm mb-4">Password changed successfully!</div>
        ) : (
          <form className="space-y-4" onSubmit={handleChange}>
            <div>
              <Label>Current Password</Label>
              <Input type="password" value={current} onChange={e => setCurrent(e.target.value)} required autoFocus />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" value={next} onChange={e => setNext(e.target.value)} required />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Changing..." : "Change Password"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
function WishlistScreen() {
  const [wishlist, setWishlist] = useState([
    { id: "1", name: "SolarMax Pro 400W Solar Panel", price: 299, image: "/placeholder.jpg" },
    { id: "2", name: "EcoSolar 200Ah Lithium Battery", price: 899, image: "/placeholder.jpg" },
  ])
  function handleRemove(id: string) { setWishlist(w => w.filter(i => i.id !== id)) }
  function handleAddToCart(id: string) { alert("Added to cart!") }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
        <CardDescription>Your saved products</CardDescription>
      </CardHeader>
      <CardContent>
        {wishlist.length === 0 ? (
          <div className="text-gray-500">Your wishlist is empty.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Image src={item.image} alt={item.name} width={64} height={64} className="rounded object-cover" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-600">${item.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddToCart(item.id)}>Add to Cart</Button>
                  <Button variant="outline" size="sm" onClick={() => handleRemove(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
