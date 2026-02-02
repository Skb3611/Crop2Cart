"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, UserPlus, ShoppingBag, Quote } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 my-10">
        <h1 className="text-3xl font-bold text-green-900 mb-2 text-center">Community & Reviews</h1>
        <p className="text-center text-gray-600 mb-12">See what our users are saying.</p>

        {/* Reviews Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              id: 1,
              name: "Rajesh K.",
              role: "Buyer",
              text: "I got fresh spinach and tomatoes delivered within 2 hours. The quality is amazing compared to the supermarket!",
              rating: 5,
            },
            {
              id: 2,
              name: "Suresh P.",
              role: "Farmer",
              text: "Crop2Cart helped me sell my excess okra directly to neighbors. No middlemen, better profits.",
              rating: 5,
            },
            {
              id: 3,
              name: "Anita D.",
              role: "Buyer",
              text: "Love knowing exactly who grew my food. The connection with local farmers is special.",
              rating: 4,
            },
          ].map((review) => (
            <Card key={review.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 text-center">
                <Quote className="h-8 w-8 text-green-200 mx-auto mb-4" />
                <p className="italic text-gray-600 mb-6 min-h-[80px]">"{review.text}"</p>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide">{review.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Join Community Section */}
        <section className="bg-green-900 text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Be a part of the revolution in local food. Whether you grow food or eat it, there is a place for you here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 w-full sm:w-auto">
                <UserPlus className="mr-2 h-5 w-5" />
                Become a Farmer
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="bg-white text-green-900 hover:bg-green-50 w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Buying Fresh
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
