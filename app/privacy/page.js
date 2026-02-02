"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Privacy Policy</h1>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                At Crop2Cart, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
              </p>
              
              <h3 className="font-semibold text-lg text-gray-800">Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Personal details (Name, Email, Phone Number) for account creation.</li>
                <li>Location data (Latitude, Longitude) to connect you with nearby farmers/buyers (within 10 km).</li>
                <li>Order history and transaction details.</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-800">How We Use Your Data</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>To facilitate local transactions between farmers and buyers.</li>
                <li>To verify identities and ensure trust in our community.</li>
                <li>To improve our services and user experience.</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-800">Data Sharing</h3>
              <p className="text-gray-600">
                We do not sell your personal data. Your contact information is shared only with the counterparty (farmer/buyer) when an order is placed to facilitate delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
