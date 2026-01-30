'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, MapPin, ShoppingCart, Plus, Minus, Trash2, Package, CheckCircle, Leaf, User, LogOut, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, login, register, buyer-dashboard, farmer-dashboard, admin-dashboard
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Location state
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Check for existing session
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      const role = JSON.parse(savedUser).role;
      if (role === 'buyer') setCurrentView('buyer-dashboard');
      else if (role === 'farmer') setCurrentView('farmer-dashboard');
      else if (role === 'admin') setCurrentView('admin-dashboard');
    }
  }, []);

  // Request location for buyers
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          setLocationError(null);
          toast.success('Location detected successfully');
        },
        (error) => {
          setLocationError('Unable to get location. Please enable GPS.');
          toast.error('Location access denied');
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      toast.error('Geolocation not supported');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentView('landing');
    setLocation(null);
    toast.success('Logged out successfully');
  };

  // Landing Page
  const LandingPage = () => (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">FreshLocal</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentView('login')}>
              Login
            </Button>
            <Button onClick={() => setCurrentView('register')} className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
          Fresh Produce from<br />Local Farmers
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect directly with farmers in Maharashtra. Buy fresh fruits, vegetables, grains, and rice within 10 km of your location.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => setCurrentView('register')} className="bg-green-600 hover:bg-green-700">
            <User className="mr-2 h-5 w-5" />
            Register as Buyer
          </Button>
          <Button size="lg" variant="outline" onClick={() => setCurrentView('register')}>
            <Leaf className="mr-2 h-5 w-5" />
            Register as Farmer
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <MapPin className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>10 KM Radius</CardTitle>
              <CardDescription>
                Buy from farmers within 10 km using GPS-based distance filtering
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Package className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Fresh Products</CardTitle>
              <CardDescription>
                Direct from farm to your doorstep. No middlemen, no delays
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Secure Payments</CardTitle>
              <CardDescription>
                Pay via Cash on Delivery or Razorpay. Your choice, your convenience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 FreshLocal. Connecting Maharashtra's farmers with local buyers.</p>
        </div>
      </footer>
    </main>
  );

  // Login Component
  const LoginView = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            ...(location && { latitude: location.latitude, longitude: location.longitude }),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        toast.success('Login successful');
        
        if (data.user.role === 'buyer') setCurrentView('buyer-dashboard');
        else if (data.user.role === 'farmer') setCurrentView('farmer-dashboard');
        else if (data.user.role === 'admin') setCurrentView('admin-dashboard');
      } catch (error) {
        toast.error('Login failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">FreshLocal</span>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="link" onClick={() => setCurrentView('register')}>
              Don't have an account? Register
            </Button>
            <Button variant="link" onClick={() => setCurrentView('landing')}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Register Component
  const RegisterView = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      role: 'buyer',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      latitude: '',
      longitude: '',
    });

    const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Registration failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        if (formData.role === 'farmer' && !data.user.approved) {
          toast.success('Registration successful! Awaiting admin approval.');
          setCurrentView('landing');
        } else {
          toast.success('Registration successful');
          if (data.user.role === 'buyer') setCurrentView('buyer-dashboard');
          else if (data.user.role === 'farmer') setCurrentView('farmer-dashboard');
        }
      } catch (error) {
        toast.error('Registration failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">FreshLocal</span>
            </div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join our marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="role">I am a</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="farmer">Farmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {formData.role === 'buyer' && (
                <>
                  <div>
                    <Label htmlFor="address">Address / Locality</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.role === 'farmer' && (
                <>
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Enter your farm's GPS coordinates. You can find them using Google Maps.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 19.0760"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 72.8777"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm text-green-800">
                      Your account will require admin approval before you can start selling.
                    </p>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="link" onClick={() => setCurrentView('login')}>
              Already have an account? Login
            </Button>
            <Button variant="link" onClick={() => setCurrentView('landing')}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Buyer Dashboard
  const BuyerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
      if (activeTab === 'products' && location) {
        fetchProducts();
      } else if (activeTab === 'orders') {
        fetchOrders();
      }
    }, [activeTab, location, selectedCategory]);

    useEffect(() => {
      if (!location && user?.role === 'buyer') {
        requestLocation();
      }
    }, []);

    const fetchProducts = async () => {
      if (!location) return;
      
      setLoading(true);
      try {
        const url = selectedCategory === 'all' 
          ? `/api/products?latitude=${location.latitude}&longitude=${location.longitude}`
          : `/api/products?latitude=${location.latitude}&longitude=${location.longitude}&category=${selectedCategory}`;
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders/buyer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    const addToCart = (product) => {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        ));
      } else {
        setCart([...cart, { ...product, cartQuantity: 1 }]);
      }
      toast.success('Added to cart');
    };

    const updateCartQuantity = (productId, delta) => {
      setCart(cart.map(item => {
        if (item.id === productId) {
          const newQty = item.cartQuantity + delta;
          return newQty > 0 ? { ...item, cartQuantity: newQty } : item;
        }
        return item;
      }).filter(item => item.cartQuantity > 0));
    };

    const removeFromCart = (productId) => {
      setCart(cart.filter(item => item.id !== productId));
      toast.success('Removed from cart');
    };

    const checkout = async (paymentMode) => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map(item => ({ productId: item.id, quantity: item.cartQuantity })),
            paymentMode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Order failed');
          setLoading(false);
          return;
        }

        if (paymentMode === 'razorpay') {
          // Initialize Razorpay
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.totalAmount * 100,
            currency: 'INR',
            name: 'FreshLocal',
            description: 'Order Payment',
            order_id: data.razorpayOrderId,
            handler: async function (response) {
              // Verify payment
              const verifyResponse = await fetch('/api/orders/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  orderId: data.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                toast.success('Order placed successfully!');
                setCart([]);
                setShowCheckout(false);
                setActiveTab('orders');
              } else {
                toast.error('Payment verification failed');
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          toast.success('Order placed successfully!');
          setCart([]);
          setShowCheckout(false);
          setActiveTab('orders');
        }
      } catch (error) {
        toast.error('Order failed');
      } finally {
        setLoading(false);
      }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-800">FreshLocal</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowCheckout(true)}
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-600">Buyer</p>
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {!location && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-yellow-900">Location Required</h3>
                    <p className="text-sm text-yellow-800">Enable GPS to see products near you</p>
                  </div>
                  <Button onClick={requestLocation} className="bg-yellow-600 hover:bg-yellow-700">
                    <MapPin className="mr-2 h-4 w-4" />
                    Enable Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              {location && (
                <>
                  <div className="mb-6 flex gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'bg-green-600' : ''}
                    >
                      All
                    </Button>
                    {['Fruit', 'Vegetable', 'Grain', 'Rice'].map(cat => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? 'bg-green-600' : ''}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                  ) : products.length === 0 ? (
                    <Card className="py-20 text-center">
                      <p className="text-gray-600">No products available in your area</p>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map(product => (
                        <Card key={product.id}>
                          <CardHeader>
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md mb-2"
                              />
                            )}
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription>
                              <Badge variant="outline">{product.category}</Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-2xl font-bold text-green-600">
                                ₹{product.price}/kg
                              </p>
                              <p className="text-sm text-gray-600">
                                Available: {product.quantity} kg
                              </p>
                              <p className="text-xs text-gray-500">
                                From: {product.farmer.name}
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => addToCart(product)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={product.quantity === 0}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : orders.length === 0 ? (
                <Card className="py-20 text-center">
                  <p className="text-gray-600">No orders yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                            <CardDescription>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge variant={order.orderStatus === 'new' ? 'default' : 'secondary'}>
                              {order.orderStatus}
                            </Badge>
                            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'} className="ml-2">
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.orderItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.product.name} × {item.quantity} kg</span>
                              <span className="font-semibold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Payment: {order.paymentMode === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Cart</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">₹{item.price}/kg</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.cartQuantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, 1)}
                              disabled={item.cartQuantity >= item.quantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => checkout('cod')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Cash on Delivery
                      </Button>
                      <Button
                        onClick={() => checkout('razorpay')}
                        className="w-full"
                        variant="outline"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Pay with Razorpay
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Farmer Dashboard
  const FarmerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      category: 'Vegetable',
      price: '',
      quantity: '',
      image: '',
    });

    useEffect(() => {
      if (activeTab === 'products') {
        fetchProducts();
      } else if (activeTab === 'orders') {
        fetchOrders();
      }
    }, [activeTab]);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders/farmer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    const handleSubmitProduct = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
        const method = editingProduct ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          toast.error('Failed to save product');
          setLoading(false);
          return;
        }

        toast.success(editingProduct ? 'Product updated' : 'Product added');
        setShowAddProduct(false);
        setEditingProduct(null);
        setFormData({ name: '', category: 'Vegetable', price: '', quantity: '', image: '' });
        fetchProducts();
      } catch (error) {
        toast.error('Failed to save product');
      } finally {
        setLoading(false);
      }
    };

    const handleEditProduct = (product) => {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        image: product.image || '',
      });
      setShowAddProduct(true);
    };

    const handleDeleteProduct = async (productId) => {
      if (!confirm('Delete this product?')) return;

      setLoading(true);
      try {
        await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      } finally {
        setLoading(false);
      }
    };

    const updateOrderStatus = async (orderId, status) => {
      setLoading(true);
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderStatus: status }),
        });
        toast.success('Order status updated');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to update status');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-800">FreshLocal</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-600">Farmer</p>
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="orders">Orders Received</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="mb-6">
                <Button onClick={() => { setShowAddProduct(true); setEditingProduct(null); }} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : products.length === 0 ? (
                <Card className="py-20 text-center">
                  <p className="text-gray-600">No products yet. Add your first product!</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {products.map(product => (
                    <Card key={product.id}>
                      <CardHeader>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-2"
                          />
                        )}
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline">{product.category}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{product.price}/kg
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.quantity} kg
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          variant="outline"
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : orders.length === 0 ? (
                <Card className="py-20 text-center">
                  <p className="text-gray-600">No orders yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                            <CardDescription>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant={order.orderStatus === 'new' ? 'default' : 'secondary'}>
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="font-semibold">Buyer: {order.buyer?.name}</p>
                          <p className="text-sm text-gray-600">Phone: {order.buyer?.buyerProfile?.phone}</p>
                          <p className="text-sm text-gray-600">
                            Address: {order.buyer?.buyerProfile?.address}, {order.buyer?.buyerProfile?.city}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.product.name} × {item.quantity} kg</span>
                              <span className="font-semibold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        {order.orderStatus === 'new' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'packed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Packed
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fruit">Fruit</SelectItem>
                        <SelectItem value="Vegetable">Vegetable</SelectItem>
                        <SelectItem value="Grain">Grain</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹/kg)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity (kg)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    const [pendingFarmers, setPendingFarmers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('approvals');

    useEffect(() => {
      fetchStats();
      if (activeTab === 'approvals') {
        fetchPendingFarmers();
      } else if (activeTab === 'users') {
        fetchAllUsers();
      }
    }, [activeTab]);

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load stats');
      }
    };

    const fetchPendingFarmers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/farmers/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPendingFarmers(data);
      } catch (error) {
        toast.error('Failed to load farmers');
      } finally {
        setLoading(false);
      }
    };

    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    const handleApproveFarmer = async (userId, approved) => {
      setLoading(true);
      try {
        await fetch(`/api/admin/farmers/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approved }),
        });
        toast.success(approved ? 'Farmer approved' : 'Farmer rejected');
        fetchPendingFarmers();
        fetchStats();
      } catch (error) {
        toast.error('Failed to update farmer');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteUser = async (userId) => {
      if (!confirm('Delete this user?')) return;

      setLoading(true);
      try {
        await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User deleted');
        fetchAllUsers();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete user');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-800">FreshLocal Admin</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-600">Admin</p>
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          {stats && (
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Farmers</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalFarmers}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Buyers</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalBuyers}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Products</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalProducts}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Orders</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalOrders}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardDescription>Pending Approvals</CardDescription>
                  <CardTitle className="text-3xl text-yellow-600">{stats.pendingApprovals}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="approvals">
                Pending Approvals
                {stats?.pendingApprovals > 0 && (
                  <Badge className="ml-2 bg-yellow-600">{stats.pendingApprovals}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="users">All Users</TabsTrigger>
            </TabsList>

            <TabsContent value="approvals">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : pendingFarmers.length === 0 ? (
                <Card className="py-20 text-center">
                  <p className="text-gray-600">No pending approvals</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingFarmers.map(farmer => (
                    <Card key={farmer.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{farmer.name}</CardTitle>
                            <CardDescription>{farmer.email}</CardDescription>
                          </div>
                          <Badge>Farmer</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Phone:</strong> {farmer.farmerProfile?.phone || 'N/A'}
                          </p>
                          <p className="text-sm">
                            <strong>Location:</strong> {farmer.farmerProfile?.latitude}, {farmer.farmerProfile?.longitude}
                          </p>
                          <p className="text-sm text-gray-600">
                            Registered: {new Date(farmer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button
                          onClick={() => handleApproveFarmer(farmer.id, true)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApproveFarmer(farmer.id, false)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {allUsers.map(user => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                              {user.role}
                            </Badge>
                            {user.role === 'farmer' && (
                              <Badge variant={user.approved ? 'default' : 'secondary'}>
                                {user.approved ? 'Approved' : 'Pending'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                      {user.role !== 'admin' && (
                        <CardFooter>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete User
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  // Render based on current view
  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      {currentView === 'landing' && <LandingPage />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'register' && <RegisterView />}
      {currentView === 'buyer-dashboard' && <BuyerDashboard />}
      {currentView === 'farmer-dashboard' && <FarmerDashboard />}
      {currentView === 'admin-dashboard' && <AdminDashboard />}
    </>
  );
}
