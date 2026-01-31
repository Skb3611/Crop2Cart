import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2,  Leaf } from 'lucide-react';
export const LoginView = ({setCurrentView,loading,setLoading,setUser,setToken}) => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            ...(location && {
              latitude: location.latitude,
              longitude: location.longitude,
            }),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Login failed");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        toast.success("Login successful");

        if (data.user.role === "buyer") setCurrentView("buyer-dashboard");
        else if (data.user.role === "farmer")
          setCurrentView("farmer-dashboard");
        else if (data.user.role === "admin") setCurrentView("admin-dashboard");
      } catch (error) {
        toast.error("Login failed");
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
              <span className="text-2xl font-bold text-green-800">
                FreshLocal
              </span>
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
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
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="link" onClick={() => setCurrentView("register")}>
              Don't have an account? Register
            </Button>
            <Button variant="link" onClick={() => setCurrentView("landing")}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };