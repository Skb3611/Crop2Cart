import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Package, CheckCircle, Leaf, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const LandingPage = ({setCurrentView}) => (
  <main className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
    <Header onLoginClick={() => setCurrentView("login")} />

    <main className="flex-grow">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-6xl font-bold text-green-900 mb-6">
          Fresh Produce from
          <br />
          Local Farmers
        </h1>
        <p className="text-sm md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect directly with farmers in Maharashtra. Buy fresh fruits,
          vegetables, grains, and rice within 10 km of your location.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setCurrentView("register")}
            className="bg-green-600 hover:bg-green-700"
          >
            <User className="mr-2 h-5 w-5" />
            Register as Buyer
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setCurrentView("register")}
          >
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
                Pay via Cash on Delivery or Razorpay. Your choice, your
                convenience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>

    <Footer />
  </main>
);
