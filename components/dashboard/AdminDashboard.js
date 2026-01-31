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
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  CheckCircle,
  Leaf,
  User,
  LogOut,
  X,
} from "lucide-react";
export const AdminDashboard = ({ user, token, logout }) => {
  const [loading, setLoading] = useState(false);
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("approvals");

  // Fetch stats once
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch tab-specific data
  useEffect(() => {
    if (activeTab === "approvals") {
      fetchPendingFarmers();
    }
    if (activeTab === "users") {
      fetchAllUsers();
    }
    if (activeTab === "products") {
      fetchAllProducts();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load stats");
    }
  };

  const fetchPendingFarmers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/farmers/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPendingFarmers(data);
    } catch (error) {
      toast.error("Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFarmer = async (userId, approved) => {
    setLoading(true);
    try {
      await fetch(`/api/admin/farmers/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      });
      toast.success(approved ? "Farmer approved" : "Farmer rejected");
      fetchPendingFarmers();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update farmer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;

    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchAllUsers();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Delete this product?")) return;

    setLoading(true);
    try {
      await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchAllProducts();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete product");
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
              <span className="text-2xl font-bold text-green-800">
                FreshLocal Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
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
                <CardTitle className="text-3xl">
                  {stats.totalProducts}
                </CardTitle>
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
                <CardTitle className="text-3xl text-yellow-600">
                  {stats.pendingApprovals}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
            <TabsTrigger value="approvals" className="flex-1">
              Pending Approvals
              {stats?.pendingApprovals > 0 && (
                <Badge className="ml-2 bg-yellow-600">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">All Users</TabsTrigger>
            <TabsTrigger value="products" className="flex-1">All Products</TabsTrigger>
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
                {pendingFarmers.map((farmer) => (
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
                          <strong>Phone:</strong>{" "}
                          {farmer.farmerProfile?.phone || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Location:</strong>{" "}
                          {farmer.farmerProfile?.latitude},{" "}
                          {farmer.farmerProfile?.longitude}
                        </p>
                        <p className="text-sm text-gray-600">
                          Registered:{" "}
                          {new Date(farmer.createdAt).toLocaleDateString()}
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
                {allUsers.map((user) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex gap-5 justify-between items-start w-full">
                        <div>
                          <CardTitle>{user.name}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                          {user.role === "farmer" && (
                            <Badge
                              variant={user.approved ? "default" : "secondary"}
                            >
                              {user.approved ? "Approved" : "Pending"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Registered:{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                    {user.role !== "admin" && (
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

          <TabsContent value="products">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : allProducts.length === 0 ? (
              <Card className="py-20 text-center">
                <p className="text-gray-600">No products found</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.map((product) => (
                  <Card key={product.id}>
                    {product.image && (
                      <div className="h-48 w-full relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </div>
                        <Badge variant="secondary">
                          Qty: {product.quantity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Farmer: {product.farmer?.name}</p>
                        <p>
                          Location: {product.farmer?.farmerProfile?.latitude},{" "}
                          {product.farmer?.farmerProfile?.longitude}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Product
                      </Button>
                    </CardFooter>
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
