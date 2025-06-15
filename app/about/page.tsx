"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <header className="bg-[#ffffff] backdrop-blur-md bg-opacity-90 border-b border-[#e5e5e7] sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl text-[#1d1d1f] font-extralight hover:text-[#0066cc]">
                ICE Location Tracker
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                Home
              </Link>
              <Link href="/about" className="text-[#0066cc] text-sm font-extralight">
                About
              </Link>
              <Link href="/contact" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                Contact
              </Link>
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
                <Link 
                  href="/" 
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-b from-[#ffffff] to-[#f5f5f7] py-16">
        <div className="container mx-auto px-6 text-center font-extralight">
          <h1 className="text-4xl md:text-5xl text-[#1d1d1f] tracking-tight font-extralight">
            About ICE Location Tracker
          </h1>
          <p className="mt-4 text-xl text-[#86868b] max-w-2xl mx-auto">
            Building stronger, more informed communities through transparency and awareness.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-extralight text-[#1d1d1f] mb-8">Our Mission</h2>
            <p className="text-[#1d1d1f] text-lg leading-relaxed mb-8 font-extralight">
              The ICE Location Tracker is a community-driven platform designed to help people stay informed about 
              Immigration and Customs Enforcement (ICE) activities in their neighborhoods. Our mission is to provide 
              transparency and real-time information that helps communities prepare and protect their members.
            </p>

            <h2 className="text-3xl font-extralight text-[#1d1d1f] mb-8 mt-12">How It Works</h2>
            <p className="text-[#1d1d1f] text-lg leading-relaxed mb-6 font-extralight">
              Community members can report ICE sightings through our secure platform. All reports are verified 
              and displayed on an interactive map, providing real-time awareness of ICE presence in different areas.
            </p>
            <ul className="text-[#1d1d1f] text-lg leading-relaxed mb-8 space-y-3 font-extralight">
              <li>• <strong>Report:</strong> Submit verified ICE sightings with location and details</li>
              <li>• <strong>View:</strong> Access real-time and historical data on our interactive map</li>
              <li>• <strong>Stay Informed:</strong> Receive updates about activities in your area</li>
              <li>• <strong>Community Support:</strong> Connect with local resources and support networks</li>
            </ul>

            <h2 className="text-3xl font-extralight text-[#1d1d1f] mb-8 mt-12">Privacy & Safety</h2>
            <p className="text-[#1d1d1f] text-lg leading-relaxed mb-6 font-extralight">
              We take privacy and safety seriously. All reports are submitted anonymously, and we do not collect 
              personal identifying information. Our platform is designed to protect both the reporters and the 
              communities we serve.
            </p>
            <ul className="text-[#1d1d1f] text-lg leading-relaxed mb-8 space-y-3 font-extralight">
              <li>• Anonymous reporting system</li>
              <li>• No personal data collection</li>
              <li>• Secure, encrypted communications</li>
              <li>• Community-verified information</li>
            </ul>

            <h2 className="text-3xl font-extralight text-[#1d1d1f] mb-8 mt-12">Community Guidelines</h2>
            <p className="text-[#1d1d1f] text-lg leading-relaxed mb-6 font-extralight">
              To maintain the integrity and usefulness of our platform, we ask all users to:
            </p>
            <ul className="text-[#1d1d1f] text-lg leading-relaxed mb-8 space-y-3 font-extralight">
              <li>• Report only verified ICE sightings</li>
              <li>• Provide accurate location and time information</li>
              <li>• Respect privacy and safety of all community members</li>
              <li>• Use the platform responsibly and ethically</li>
            </ul>

            <h2 className="text-3xl font-extralight text-[#1d1d1f] mb-8 mt-12">Get Involved</h2>
            <p className="text-[#1d1d1f] text-lg leading-relaxed mb-8 font-extralight">
              This platform is stronger with community participation. Whether you're reporting sightings, 
              spreading awareness, or supporting affected community members, every action helps build a 
              more informed and prepared community.
            </p>
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