import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Crop2Cart</h3>
            <p className="text-green-100 text-sm">
              Connecting farmers directly to consumers within 10 km for fresher food and fair prices.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/farmer-help" className="hover:text-white">Farmer Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/trust" className="hover:text-white">Trust & Safety</Link></li>
              <li><Link href="/community" className="hover:text-white">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 pt-8 text-center text-sm text-green-200">
          <p>© Crop2Cart — From farm to home, faster</p>
        </div>
      </div>
    </footer>
  );
}
