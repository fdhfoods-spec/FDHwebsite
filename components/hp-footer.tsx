'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function HpFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-primary text-primary-foreground">
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
              <li>
                <a 
                  href="#our-products" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#our-products';
                    } else {
                      document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const btn = document.querySelector('#our-products button[data-category="chicken"]') as HTMLElement;
                        if (btn) btn.click();
                      }, 150);
                    }
                  }} 
                  className="hover:text-secondary transition-colors cursor-pointer"
                >
                  Chicken
                </a>
              </li>
              <li>
                <a 
                  href="#our-products" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#our-products';
                    } else {
                      document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const btn = document.querySelector('#our-products button[data-category="mutton"]') as HTMLElement;
                        if (btn) btn.click();
                      }, 150);
                    }
                  }} 
                  className="hover:text-secondary transition-colors cursor-pointer"
                >
                  Mutton
                </a>
              </li>
              <li>
                <a 
                  href="#our-products" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#our-products';
                    } else {
                      document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const btn = document.querySelector('#our-products button[data-category="fish-and-sea-foods"]') as HTMLElement;
                        if (btn) btn.click();
                      }, 150);
                    }
                  }} 
                  className="hover:text-secondary transition-colors cursor-pointer"
                >
                  Fish & Sea Foods
                </a>
              </li>
              <li>
                <a 
                  href="#our-products" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#our-products';
                    } else {
                      document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const btn = document.querySelector('#our-products button[data-category="eggs"]') as HTMLElement;
                        if (btn) btn.click();
                      }, 150);
                    }
                  }} 
                  className="hover:text-secondary transition-colors cursor-pointer"
                >
                  Eggs
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-primary-foreground">About Us</span></li>
              <li><span className="text-primary-foreground">Our Suppliers</span></li>
              <li><span className="text-primary-foreground">Vendor</span></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-primary-foreground">Contact Us</span></li>
              <li><Link href="/how-it-works" className="hover:text-secondary transition-colors">How It Works</Link></li>
              <li><span className="text-primary-foreground">Track Order</span></li>
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
            <span className="hover:text-secondary transition-colors cursor-default">
              Privacy Policy
            </span>
            <span className="hover:text-secondary transition-colors cursor-default">
              Terms of Service
            </span>
            <span className="hover:text-secondary transition-colors cursor-default">
              Cookie Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
