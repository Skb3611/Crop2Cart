"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, IndianRupee, Truck, Star, TrendingUp, CheckCircle2 } from "lucide-react";

export default function FarmerHelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50/50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2 text-center">Farmer Guide</h1>
        <p className="text-center text-gray-600 mb-10">Simple steps to grow your business with Crop2Cart</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Upload Products */}
          <Card className="border-t-4 border-t-green-600 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-green-600" />
                How to Upload Products
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm space-y-2">
              <p>1. Go to your Dashboard.</p>
              <p>2. Click on the <strong>"Products"</strong> tab.</p>
              <p>3. Click <strong>"Add Product"</strong> button.</p>
              <p>4. Enter crop name, category (e.g., Vegetable), price, and quantity available.</p>
              <p>5. Click <strong>Save</strong>. Your product is now visible to buyers!</p>
            </CardContent>
          </Card>

          {/* Pricing Tips */}
          <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IndianRupee className="h-5 w-5 text-blue-500" />
                Pricing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm space-y-2">
              <p>• Set competitive prices. Check local market rates.</p>
              <p>• Since there are no middlemen, you can offer better rates than the market and still earn more.</p>
              <p>• Lower prices often lead to more orders and loyal customers.</p>
            </CardContent>
          </Card>

          {/* Delivery Guidelines */}
          <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-orange-500" />
                Delivery Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm space-y-2">
              <p>• You only receive orders from within <strong>10 km</strong>.</p>
              <p>• Pack the items securely.</p>
              <p>• Deliver the order yourself or arrange a local delivery.</p>
              <p>• Mark the order as <strong>"Delivered"</strong> in your dashboard once done.</p>
            </CardContent>
          </Card>

          {/* Quality Rules */}
          <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-purple-500" />
                Quality & Freshness
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm space-y-2">
              <p>• Only list items that are ready to harvest or already harvested.</p>
              <p>• Do not sell spoiled or old produce.</p>
              <p>• Buyers trust you for freshness. Good quality means repeat orders.</p>
            </CardContent>
          </Card>

          {/* How to Earn More */}
          <Card className="border-t-4 border-t-yellow-500 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                How to Earn More
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Build Trust</h4>
                <p>Deliver on time and provide exactly what you promised in the listing.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Update Stock</h4>
                <p>Keep your inventory updated. Remove items that are out of stock immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Good Photos</h4>
                <p>If possible, upload clear photos of your produce (feature coming soon).</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Be Responsive</h4>
                <p>Check your dashboard daily for new orders.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
