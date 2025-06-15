"use client"

import { useState } from "react"
import ReportMap from "@/components/report-map"
import ReportForm from "@/components/report-form"
import RecentReports from "@/components/recent-reports"
import { MapPin, Shield, Bell, Menu, X } from "lucide-react"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <header className="bg-[#ffffff] backdrop-blur-md bg-opacity-90 border-b border-[#e5e5e7] sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-[#1d1d1f] font-extralight">ICE Location Tracker</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                Map
              </a>
              <a href="/about" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                About
              </a>
              <a href="/contact" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#1d1d1f] hover:text-[#0066cc]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-[#e5e5e7] pt-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#" 
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Map
                </a>
                <a 
                  href="/about" 
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="/contact" 
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-b from-[#ffffff] to-[#f5f5f7] py-16">
        <div className="container mx-auto px-6 text-center font-extralight">
          <h2 className="text-4xl md:text-5xl text-[#1d1d1f] tracking-tight font-extralight">
            Community-Powered Awareness
          </h2>
          <p className="mt-4 text-xl text-[#86868b] max-w-2xl mx-auto">
            Report and track ICE presence in your community to help keep everyone informed and safe.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReportMap />
            </div>
            <div className="space-y-8">
              <ReportForm />
              <RecentReports />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extralight text-center text-[#1d1d1f] mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-[#0066cc]" />
              </div>
              <h3 className="text-xl font-extralight text-[#1d1d1f] mb-3">Report Locations</h3>
              <p className="text-[#86868b] font-extralight">Easily submit ICE sightings with precise location data and descriptions.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-[#0066cc]" />
              </div>
              <h3 className="text-xl font-extralight text-[#1d1d1f] mb-3">Stay Informed</h3>
              <p className="text-[#86868b] font-extralight">View real-time and historical data about ICE presence in your area.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-[#0066cc]" />
              </div>
              <h3 className="text-xl font-extralight text-[#1d1d1f] mb-3">Community Network</h3>
              <p className="text-[#86868b] font-extralight">Be part of a network that helps communities stay aware and prepared.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#f5f5f7] border-t border-[#e5e5e7] py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-sm text-[#86868b]">
              © {new Date().getFullYear()} ICE Location Tracker. All rights reserved.
              <br />
              <span className="text-xs">
                This tool is designed to help communities stay informed. Please use responsibly.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
