import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export function Header({ onLoginClick }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-xl md:text-2xl font-bold text-green-800">FreshLocal</span>
        </Link>
        <div className="hidden md:flex gap-4">
           <Link href="/help" className="text-gray-600 hover:text-green-600 my-auto text-sm font-medium">
            Help
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-green-600 my-auto text-sm font-medium">
            Contact
          </Link>
          {onLoginClick ? (
            <Button variant="outline" onClick={onLoginClick}>Login</Button>
          ) : (
            <Link href="/">
               <Button variant="outline">Home</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
