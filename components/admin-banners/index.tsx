'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useStore, type Banner } from '@/lib/store'
import {
  ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Archive,
  RefreshCw,
  ExternalLink,
  Eye,
  Layers,
  Sparkles,
  ArrowUpRight,
  X,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const compressImage = (file: File, callback: (base64Str: string) => void) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 800
      const MAX_HEIGHT = 600
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      callback(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

export function BannerManagement() {
  const { banners: rawBanners = [], addBanner, updateBanner, archiveBanner, deleteBanner } = useStore()
  const banners = rawBanners || []

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newBadge, setNewBadge] = useState('')
  const [newButtonText, setNewButtonText] = useState('Explore Deals')
  const [newLink, setNewLink] = useState('#deals')
  const [newImageUrl, setNewImageUrl] = useState('')

  // Preview Modal State
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null)

  // Filter Active vs Archived
  const activeBanners = banners.filter(b => !b.archived)
  const archivedBanners = banners.filter(b => b.archived)

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return

    addBanner({
      title: newTitle,
      subtitle: newSubtitle || 'Premium fresh meat cuts delivered to your doorstep.',
      badge: newBadge || 'SPECIAL OFFER',
      buttonText: newButtonText || 'Order Now',
      link: newLink || '#deals',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1000'
    })

    alert('New promotional banner created and published successfully!')
    setIsCreateOpen(false)
    setNewTitle('')
    setNewSubtitle('')
    setNewBadge('')
    setNewImageUrl('')
  }

  return (
    <div className="space-y-8 animate-fadeIn font-sans selection:bg-secondary selection:text-white">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] uppercase font-black text-secondary tracking-widest">Storefront Marketing Terminal</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-secondary" /> Banner Promos Management
          </h1>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider py-5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/20"
        >
          <Plus className="w-4 h-4" /> Create New Promo Slide
        </Button>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Total Promo Slides</p>
            <h3 className="text-2xl font-black text-white">{banners.length}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border text-sky-400 bg-sky-500/10 border-sky-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Active Carousel Slides</p>
            <h3 className="text-2xl font-black text-emerald-400">{activeBanners.length}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Archived Campaigns</p>
            <h3 className="text-2xl font-black text-slate-400">{archivedBanners.length}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border text-amber-400 bg-amber-500/10 border-amber-500/20">
            <Archive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Banners Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" /> Active Homepage Carousel Banners ({activeBanners.length})
        </h2>

        {activeBanners.length === 0 ? (
          <div className="p-12 bg-slate-900/80 border border-slate-800 rounded-3xl text-center text-slate-400 space-y-3 shadow-lg">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-600 animate-bounce" />
            <p className="text-sm font-bold text-slate-300">No active promotional banners in storefront carousel.</p>
            <p className="text-xs text-slate-500">Create a new promo slide above to showcase deals to customer shoppers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBanners.map((banner) => (
              <div key={banner.id} className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all">
                {/* Banner Header & Image */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  {banner.imageUrl ? (
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary text-white font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                      {banner.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewBanner(banner)}
                      className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur-md border border-slate-700/60 transition-all shadow-md"
                      title="Live Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => archiveBanner(banner.id)}
                      className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl backdrop-blur-md border border-amber-500/30 transition-all shadow-md"
                      title="Archive Campaign"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to permanently delete this banner?')) {
                          deleteBanner(banner.id)
                        }
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl backdrop-blur-md border border-red-500/30 transition-all shadow-md"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <h3 className="text-lg font-black text-white tracking-tight leading-snug drop-shadow-md">{banner.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-1 font-medium">{banner.subtitle}</p>
                  </div>
                </div>

                {/* Inline Editing Controls */}
                <div className="p-5 space-y-4 bg-slate-900/60">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Title</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Badge Text</label>
                      <input
                        type="text"
                        value={banner.badge}
                        onChange={(e) => updateBanner(banner.id, { badge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-secondary text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400">Subtitle Description</label>
                    <input
                      type="text"
                      value={banner.subtitle}
                      onChange={(e) => updateBanner(banner.id, { subtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400">Banner Image Source</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={banner.imageUrl}
                        onChange={(e) => updateBanner(banner.id, { imageUrl: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 text-slate-400 text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-mono text-[10px]"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700/60 shrink-0">
                        <Upload className="w-3.5 h-3.5" /> Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              compressImage(file, (base64) => {
                                updateBanner(banner.id, { imageUrl: base64 })
                              })
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Button CTA</label>
                      <input
                        type="text"
                        value={banner.buttonText}
                        onChange={(e) => updateBanner(banner.id, { buttonText: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Link Target</label>
                      <input
                        type="text"
                        value={banner.link}
                        onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-sky-400 text-xs p-2.5 rounded-xl outline-none focus:border-secondary font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archived Banners Section */}
      {archivedBanners.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-500" /> Archived Campaign Slides ({archivedBanners.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedBanners.map((banner) => (
              <div key={banner.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    {banner.imageUrl ? (
                      <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{banner.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{banner.badge} • {banner.buttonText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateBanner(banner.id, { archived: false, active: true })}
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Restore Slide
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to permanently delete this banner?')) {
                        deleteBanner(banner.id)
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Create New Banner Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button onClick={() => setIsCreateOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-secondary tracking-wider">Storefront Promotion</span>
              <h3 className="text-xl font-black text-white mt-0.5">Create New Promo Slide</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Banner Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekend Fresh Mutton Deal"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. FLAT 20% OFF"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-secondary text-xs p-3 rounded-xl outline-none focus:border-secondary font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Subtitle Description</label>
                <textarea
                  placeholder="Catchy deal description for shoppers..."
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary h-20 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Banner Image Source</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload file..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                  <label className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700/60 shrink-0">
                    <Upload className="w-4 h-4" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          compressImage(file, (base64) => {
                            setNewImageUrl(base64)
                          })
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Button CTA Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Order Cut Now"
                    value={newButtonText}
                    onChange={(e) => setNewButtonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Target Category Link</label>
                  <input
                    type="text"
                    placeholder="e.g. #mutton or #deals"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-sky-400 text-xs p-3 rounded-xl outline-none focus:border-secondary font-mono"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl">
                Publish Promo Slide to Storefront
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Live Storefront Preview */}
      {previewBanner && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-6 shadow-2xl relative">
            <button onClick={() => setPreviewBanner(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Live Customer Experience Mockup</span>
              <h3 className="text-xl font-black text-white mt-0.5">Storefront Hero Preview</h3>
            </div>

            {/* Storefront Hero Slide Mockup */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex items-end p-6">
              {previewBanner.imageUrl && (
                <Image src={previewBanner.imageUrl} alt={previewBanner.title} fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              <div className="relative z-10 space-y-2 max-w-md">
                <span className="px-3 py-1 bg-secondary text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg inline-block">
                  {previewBanner.badge}
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{previewBanner.title}</h2>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{previewBanner.subtitle}</p>
                <div className="pt-2">
                  <button className="px-5 py-2.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-secondary/30 flex items-center gap-2">
                    {previewBanner.buttonText} <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <Button onClick={() => setPreviewBanner(null)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl">
              Close Live Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
