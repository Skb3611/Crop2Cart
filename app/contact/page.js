"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Clock, Send, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4  py-28">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Contact Us</h1>
        <div className=" gap-8 max-w-5xl mx-auto">
          {/* Section A: Contact Cards */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                  <p className="text-sm text-gray-600">Maharashtra, India</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-sm text-gray-600">support@crop2cart.com</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Phone / WhatsApp</h3>
                  <p className="text-sm text-gray-600">+91 XXXXXXXX</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Support Hours</h3>
                  <p className="text-sm text-gray-600">9 AM – 6 PM (Mon–Sat)</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section B: Contact Form */}

        </div>
      </main>

      <Footer />
    </div>
  );
}
