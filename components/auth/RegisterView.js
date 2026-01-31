import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Leaf } from "lucide-react";
export const RegisterView = ({
  setCurrentView,
  loading,
  setLoading,
  requestLocation,
  location,
  setToken,
  setUser,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "buyer",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  useEffect(() => {
    if (location) {
      setFormData({
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(response.status,response.status!==201,data.error);

      if (response.status!==201) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      if (formData.role === "farmer" && !data.user.approved) {
        toast.success("Registration successful! Awaiting admin approval.");
        setCurrentView("landing");
      } else {
        toast.success("Registration successful");
        if (data.user.role === "buyer") setCurrentView("buyer-dashboard");
        else if (data.user.role === "farmer")
          setCurrentView("farmer-dashboard");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Registration failed");
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
            <span className="text-2xl font-bold text-green-800">
              FreshLocal
            </span>
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join our marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone[0]}</p>
                )}
              </div>
            </div>

            {formData.role === "buyer" && (
              <>
                <div>
                  <Label htmlFor="address">Address / Locality</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address[0]}</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      required
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-500 mt-1">{errors.pincode[0]}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {formData.role === "farmer" && (
              <>
                <div className="bg-yellow-50 p-4 rounded-md space-y-1 flex flex-col justify-center items-center">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Enter your farm's GPS coordinates.
                    You can find them using Google Maps.
                  </p>
                <p className="text-sm text-yellow-800 w-full text-center">
                  <strong>OR</strong>
                </p>
                <Button
                  onClick={requestLocation}
                  variant={"default"}
                  >
                  Fetch Coordinates Automatically
                </Button>
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
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      required
                    />
                    {errors.latitude && (
                      <p className="text-sm text-red-500 mt-1">{errors.latitude[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 72.8777"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: e.target.value,
                        })
                      }
                      required
                    />
                    {errors.longitude && (
                      <p className="text-sm text-red-500 mt-1">{errors.longitude[0]}</p>
                    )}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-800">
                    Your account will require admin approval before you can
                    start selling.
                  </p>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button variant="link" onClick={() => setCurrentView("login")}>
            Already have an account? Login
          </Button>
          <Button variant="link" onClick={() => setCurrentView("landing")}>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
