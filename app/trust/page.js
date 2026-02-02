"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, CheckCircle, Eye, Users } from "lucide-react";

export default function TrustPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Trust & Safety</h1>
          <p className="text-gray-600">Your security is our top priority.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Lock className="h-5 w-5 text-green-600" />
                Data Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your personal data is encrypted and never shared with third parties without your consent. We value your privacy.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Shield className="h-5 w-5 text-green-600" />
                Secure Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We support safe Cash on Delivery (COD) and secure online payments via Razorpay (Test Mode) to ensure your money is safe.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Quality Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Farmers are encouraged to list only fresh, high-quality produce. We have strict policies against selling spoiled goods.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Eye className="h-5 w-5 text-green-600" />
                Admin Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our admins verify every farmer registration and monitor platform activity to prevent fraud and fake accounts.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Users className="h-5 w-5 text-green-600" />
                Community Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We foster a respectful community. Harassment, dishonest behavior, or misuse of the platform will lead to an immediate ban.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
