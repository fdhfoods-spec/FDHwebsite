import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function HpFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-2">FDH</div>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Fresh Delivery Hub - Premium meat delivery service.
            </p>
            <div className="flex gap-4">
              <a href="mailto:hello@fdh.com" className="hover:text-secondary transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+1-555-0123" className="hover:text-secondary transition-colors" title="Phone">
                <Phone className="w-5 h-5" />
              </a>
              <a href="/about" className="hover:text-secondary transition-colors" title="Location">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/beef" className="hover:text-secondary transition-colors">Beef</Link></li>
              <li><Link href="/category/chicken" className="hover:text-secondary transition-colors">Chicken</Link></li>
              <li><Link href="/category/pork" className="hover:text-secondary transition-colors">Pork</Link></li>
              <li><Link href="/category/seafood" className="hover:text-secondary transition-colors">Seafood</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors">Our Suppliers</Link></li>
              <li><Link href="/vendor" className="hover:text-secondary transition-colors">Vendor</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-secondary transition-colors">How It Works</Link></li>
              <li><Link href="/track" className="hover:text-secondary transition-colors">Track Order</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Orders</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-primary-foreground/10 p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Get exclusive deals and fresh product updates delivered to your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded bg-primary-foreground text-primary placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded font-medium text-sm hover:bg-secondary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
          <p>&copy; {currentYear} Fresh Delivery Hub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-secondary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
