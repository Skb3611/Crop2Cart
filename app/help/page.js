"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Leaf, UserPlus, ListPlus, Truck, HelpCircle, AlertCircle, CreditCard, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Help & Support</h1>

        {/* Section A: How Crop2Cart Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">How Crop2Cart Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <Card className="border-green-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <ShoppingCart className="h-6 w-6" />
                  For Buyers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><Search className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">Find Nearby Farmers</h4>
                    <p className="text-sm text-gray-600">Discover fresh produce within 10 km of your location.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><ShoppingCart className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">Place Order</h4>
                    <p className="text-sm text-gray-600">Pay via Cash on Delivery or Online.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><Leaf className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">Get Fresh Produce</h4>
                    <p className="text-sm text-gray-600">Farm-fresh quality delivered locally.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Farmers */}
            <Card className="border-green-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <UserPlus className="h-6 w-6" />
                  For Farmers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><UserPlus className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">Register & Get Approved</h4>
                    <p className="text-sm text-gray-600">Join our community of verified farmers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><ListPlus className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">List Products</h4>
                    <p className="text-sm text-gray-600">Easily add your crops and set prices.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><Truck className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <h4 className="font-medium">Deliver Locally</h4>
                    <p className="text-sm text-gray-600">Connect directly with nearby buyers.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section B: FAQs */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I register as a farmer?</AccordionTrigger>
              <AccordionContent>
                Click on "Register" on the home page, select "Farmer", fill in your details including your location. Your account will be reviewed by an admin for approval.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is the 10 km radius rule?</AccordionTrigger>
              <AccordionContent>
                To ensure maximum freshness and minimal travel time, buyers can only see and order from farmers located within a 10 km radius of their current location.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is freshness ensured?</AccordionTrigger>
              <AccordionContent>
                By connecting you with local farmers, travel time is drastically reduced. Farmers harvest and pack orders specifically for local delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I cancel an order?</AccordionTrigger>
              <AccordionContent>
                Currently, please contact support or the farmer directly if you need to cancel an order immediately after placing it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section C: Quick Help Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Need Immediate Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full h-32 flex flex-col gap-3 text-lg border-2 hover:border-green-500 hover:bg-green-50">
                <HelpCircle className="h-8 w-8 text-green-600" />
                Facing Login Issue?
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full h-32 flex flex-col gap-3 text-lg border-2 hover:border-green-500 hover:bg-green-50">
                <AlertCircle className="h-8 w-8 text-orange-500" />
                Order Not Delivered?
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full h-32 flex flex-col gap-3 text-lg border-2 hover:border-green-500 hover:bg-green-50">
                <CreditCard className="h-8 w-8 text-blue-500" />
                Payment Problem?
              </Button>
            </Link>
          </div>
        </section>

        {/* Section D: Future Feature Placeholder */}
        <section className="max-w-md mx-auto">
          <Card className="bg-gray-100 border-dashed border-2 border-gray-300 opacity-75">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-gray-500">
                <MessageSquare className="h-6 w-6" />
                Chat with us
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 font-medium">Coming Soon</p>
              <p className="text-sm text-gray-400 mt-2">We are building a live chat support system to help you better.</p>
            </CardContent>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}
