'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Navigation, AlertTriangle, CheckCircle, X, Compass } from 'lucide-react'

// Fixed Store Location (Delhi Hub Default: Lat 28.5355, Lng 77.2410)
export const STORE_LOCATION = {
  lat: 28.5355,
  lng: 77.2410,
  address: 'FDH Central Hub, Pocket C-2, Vasant Kunj, New Delhi - 110070'
}

export const MAX_DELIVERY_RADIUS_KM = 30

// Haversine Formula for accurate spherical distance calculation in km
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

// Popular locations for quick demo selection
const DEMO_LOCATIONS = [
  { name: 'Vasant Kunj (Near Store)', lat: 28.5390, lng: 77.2450, address: 'Sector C, Vasant Kunj, New Delhi - 110070' },
  { name: 'Saket District Centre', lat: 28.5245, lng: 77.2185, address: 'Press Enclave Marg, Saket, New Delhi - 110017' },
  { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, address: 'Inner Circle, Connaught Place, New Delhi - 110001' },
  { name: 'DLF Cyber City (Gurgaon)', lat: 28.4950, lng: 77.0895, address: 'Cyber City, Phase 2, Gurugram, Haryana - 122002' },
  { name: 'Faridabad Sector 15 (Far / >30km)', lat: 28.3850, lng: 77.3150, address: 'Sector 15 Main Market, Faridabad, Haryana - 121007' }
]

interface MapPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAddress: (location: {
    address: string
    latitude: number
    longitude: number
    distanceKm: number
  }) => void
  initialAddress?: string
}

export function MapPickerModal({ isOpen, onClose, onSelectAddress, initialAddress }: MapPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLat, setSelectedLat] = useState<number>(28.5390)
  const [selectedLng, setSelectedLng] = useState<number>(77.2450)
  const [addressString, setAddressString] = useState<string>(initialAddress || 'Sector C, Vasant Kunj, New Delhi')
  const [isLocating, setIsLocating] = useState(false)

  // Calculate live distance from store
  const distanceKm = calculateHaversineDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, selectedLat, selectedLng)
  const isWithinRadius = distanceKm <= MAX_DELIVERY_RADIUS_KM

  if (!isOpen) return null

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(4))
        const lng = Number(position.coords.longitude.toFixed(4))
        setSelectedLat(lat)
        setSelectedLng(lng)
        setAddressString(`GPS Detected Location (${lat}, ${lng})`)
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        alert('Could not retrieve your current location. Please pick a location from the search list.')
      }
    )
  }

  const handleSelectPreset = (preset: typeof DEMO_LOCATIONS[0]) => {
    setSelectedLat(preset.lat)
    setSelectedLng(preset.lng)
    setAddressString(preset.address)
  }

  const handleConfirm = () => {
    if (!isWithinRadius) return
    onSelectAddress({
      address: addressString,
      latitude: selectedLat,
      longitude: selectedLng,
      distanceKm
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Select Delivery Location</h3>
              <p className="text-xs text-slate-400">Pin your address for accurate delivery calculations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box & GPS Button */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search address or landmark..."
              value={searchQuery || addressString}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setAddressString(e.target.value)
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-3 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
            />
          </div>

          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-secondary flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Locating via GPS...' : 'Use Current GPS Location'}
          </button>
        </div>

        {/* Preset Address Suggestions */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Locations</label>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                  selectedLat === preset.lat
                    ? 'bg-secondary/20 border-secondary text-secondary font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Simulated Map Box */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden min-h-[160px] flex flex-col justify-between">
          {/* Background Grid Pattern simulating map */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              STORE HUB: {STORE_LOCATION.lat}, {STORE_LOCATION.lng}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isWithinRadius ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              CUSTOMER: {selectedLat}, {selectedLng}
            </span>
          </div>

          {/* Map Pin Route Visualiser */}
          <div className="relative z-10 my-4 flex items-center justify-between px-6">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center mx-auto mb-1">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 block">FDH Store</span>
            </div>

            <div className="flex-1 mx-4 border-t-2 border-dashed border-slate-700 relative text-center">
              <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border border-slate-800 inline-block -translate-y-3">
                {distanceKm} km
              </span>
            </div>

            <div className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                isWithinRadius ? 'bg-secondary/20 border border-secondary text-secondary' : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 block">Your Location</span>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-300 font-medium truncate bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-bold">Selected Address:</span> {addressString}
          </div>
        </div>

        {/* Validation Error Banner */}
        {!isWithinRadius && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-extrabold">Out of Delivery Coverage</p>
              <p className="text-[11px] opacity-90">Sorry, we currently deliver only within 30 km of our store.</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isWithinRadius}
            className="flex-1 py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Confirm Address & Save
          </button>
        </div>

      </div>
    </div>
  )
}
