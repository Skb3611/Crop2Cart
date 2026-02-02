"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Users, ArrowRight, Sprout, Home } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-50 py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Badge variant="outline" className="mb-4 border-green-600 text-green-700 bg-green-100 px-4 py-1">Our Vision</Badge>
            <h1 className="text-4xl font-bold text-green-900 mb-6">Bridging the Gap Between <br/>Farmers and You</h1>
            <p className="text-xl text-gray-600">
              Crop2Cart was born from a simple idea: Local food should stay local.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-12 bg-green-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-serif italic leading-relaxed">
              "Connecting farmers directly to consumers within 10 km for fresher food and fair prices."
            </h2>
          </div>
        </section>

        {/* Why Crop2Cart */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why We Built This</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-red-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">The Middleman Problem</h3>
                <p className="text-gray-600">Farmers get low prices while you pay high rates due to multiple intermediaries.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-green-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Freshness Issues</h3>
                <p className="text-gray-600">Produce travels hundreds of kilometers, losing nutrition and taste before reaching you.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-blue-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Supporting Farmers</h3>
                <p className="text-gray-600">We empower local farmers to earn what they truly deserve for their hard work.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Illustration Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">The Crop2Cart Way</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <Sprout className="h-10 w-10 text-green-700" />
                </div>
                <h3 className="font-bold text-lg">Local Farmer</h3>
                <p className="text-sm text-gray-500">Harvests fresh</p>
              </div>

              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="h-1 w-full bg-green-200 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-green-600 font-bold text-sm">
                    &lt; 10 km &gt;
                  </div>
                  <ArrowRight className="absolute -top-2.5 right-0 text-green-400 h-6 w-6" />
                </div>
              </div>
              <div className="md:hidden">
                 <ArrowRight className="h-8 w-8 text-green-400 rotate-90 my-2" />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <Home className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg">Your Home</h3>
                <p className="text-sm text-gray-500">Receives quickly</p>
              </div>

            </div>
          </div>
        </section>

        {/* Builder Credibility */}
        <section className="py-12 container mx-auto px-4 text-center">
          <div className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">
            Built by students / innovators for farmers 🎓🌾
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
