import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  LogOut,
  X,
  Leaf,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export const BuyerDashboard = ({
  user,
  logout,
  loading,
  setLoading,
  requestLocation,
  token,
  location,
}) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if(activeTab==="orders"){
      fetchOrders();
      return;
    }
    if (activeTab !== "products") return;
    if (!location) return;

    fetchProducts();
  }, [activeTab, selectedCategory, location?.latitude, location?.longitude]);

  useEffect(() => {
    if (user?.role === "buyer" && !location) {
      requestLocation();
    }
  }, [user?.role]);

  const fetchProducts = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const url =
        selectedCategory === "all"
          ? `/api/products?latitude=${location.latitude}&longitude=${location.longitude}`
          : `/api/products?latitude=${location.latitude}&longitude=${location.longitude}&category=${selectedCategory}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders/buyer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
    toast.success("Added to cart");
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.cartQuantity + delta;
            return newQty > 0 ? { ...item, cartQuantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.cartQuantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast.success("Removed from cart");
  };

  const checkout = async (paymentMode) => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.cartQuantity,
          })),
          paymentMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Order failed");
        setLoading(false);
        return;
      }

      if (paymentMode === "razorpay") {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.totalAmount * 100,
          currency: "INR",
          name: "FreshLocal",
          description: "Order Payment",
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            // Verify payment
            const verifyResponse = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
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
              toast.success("Order placed successfully!");
              setCart([]);
              setShowCheckout(false);
              setActiveTab("orders");
            } else {
              toast.error("Payment verification failed");
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
        toast.success("Order placed successfully!");
        setCart([]);
        setShowCheckout(false);
        setActiveTab("orders");
      }
    } catch (error) {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">
                FreshLocal
              </span>
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
              <div className="text-right hidden sm:block">
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

      <div className="container mx-auto px-4 py-20">
        {!location && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Location Required
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Enable GPS to see products near you
                  </p>
                </div>
                <Button
                  onClick={requestLocation}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Enable Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {location && (
              <>
                <div className="mb-6 flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    className={selectedCategory === "all" ? "bg-green-600" : ""}
                  >
                    All
                  </Button>
                  {["Fruit", "Vegetable", "Grain", "Rice"].map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat ? "bg-green-600" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="w-full h-48 rounded-md mb-2" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <Card className="py-20 text-center">
                    <p className="text-gray-600">
                      No products available in your area
                    </p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products &&products?.map((product) => (
                      <Card key={product.id}>
                        <CardHeader>
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-md mb-2"
                            />
                          )}
                          <CardTitle className="text-lg">
                            {product.name}
                          </CardTitle>
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="border-t pt-2 flex justify-between">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card className="py-20 text-center">
                <p className="text-gray-600">No orders yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
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
                          <Badge
                            variant={
                              order.orderStatus === "new"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.orderStatus}
                          </Badge>
                          <Badge
                            variant={
                              order.paymentStatus === "paid"
                                ? "default"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.product.name} × {item.quantity} kg
                            </span>
                            <span className="font-semibold">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Payment:{" "}
                          {order.paymentMode === "cod"
                            ? "Cash on Delivery"
                            : "Razorpay"}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCheckout(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{item.price}/kg
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.cartQuantity}
                          </span>
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
                      <span className="text-green-600">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => checkout("cod")}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Cash on Delivery
                    </Button>
                    <Button
                      onClick={() => checkout("razorpay")}
                      className="w-full"
                      variant="outline"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Pay with Razorpay
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </section>
  );
};
