const fs = require('fs')

let code = fs.readFileSync('app/profile/page.tsx', 'utf8')

// Replace dark classes with light classes
code = code
  .replace(/bg-slate-950/g, 'bg-gray-50')
  .replace(/bg-slate-900\/80/g, 'bg-white/95')
  .replace(/bg-slate-900/g, 'bg-white')
  .replace(/bg-slate-850/g, 'bg-gray-100')
  .replace(/border-slate-800/g, 'border-gray-100')
  .replace(/border-slate-850/g, 'border-gray-200')
  .replace(/text-slate-100/g, 'text-foreground')
  .replace(/text-slate-400/g, 'text-foreground/60')
  .replace(/text-slate-500/g, 'text-foreground/40')
  .replace(/text-slate-600/g, 'text-foreground/30')

// Specifically replace text-white for text elements, but preserve for buttons that use bg-secondary, bg-gradient, or emerald
code = code
  .replace(/text-xl font-black text-white/g, 'text-xl font-black text-foreground')
  .replace(/hover:text-white/g, 'hover:text-foreground')
  .replace(/text-sm font-black text-white/g, 'text-sm font-black text-foreground')
  .replace(/font-bold text-white/g, 'font-bold text-foreground')
  .replace(/font-mono font-bold text-white/g, 'font-mono font-bold text-foreground')
  .replace(/text-base font-bold text-white/g, 'text-base font-bold text-foreground')

// Add Save Address and Change Address buttons
const oldAddressesSection = `<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Central Hub Delivery Address</p>
                  <p className="text-foreground/60 text-[11px]">Sector C, Vasant Kunj, New Delhi - 110070</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded-lg">Default</span>
            </div>`

const newAddressesSection = `<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Central Hub Delivery Address</p>
                  <p className="text-foreground/60 text-[11px]">Sector C, Vasant Kunj, New Delhi - 110070</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded-lg">Default</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button className="px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20">
                Save Address
              </button>
              <button className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-foreground rounded-xl text-xs font-bold transition-all">
                Change Address
              </button>
            </div>`

code = code.replace(oldAddressesSection, newAddressesSection)

fs.writeFileSync('app/profile/page.tsx', code)
console.log('Profile page updated!')
