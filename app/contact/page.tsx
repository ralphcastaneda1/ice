'use client'

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from "next/link"
import { Menu, X } from "lucide-react"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting to connect to Firestore...');
      console.log('Database instance:', db);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'contact-submissions'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: serverTimestamp(),
        status: 'new'
      });
      
      console.log('Form submitted successfully to Firebase with ID:', docRef.id);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Detailed error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error submitting form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
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
                <Link href="/about" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                  About
                </Link>
                <Link href="/contact" className="text-[#0066cc] text-sm font-extralight">
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
                    className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-[#0066cc] text-sm font-extralight py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </header>
        <div className="container mx-auto px-6 max-w-2xl py-16">
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <h1 className="text-4xl font-extralight text-[#1d1d1f] mb-4">Thank You!</h1>
            <p className="text-lg text-[#86868b] mb-6">
              Your message has been sent successfully. We'll get back to you soon.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-[#0066cc] text-white py-3 px-6 rounded-lg hover:bg-[#0052a3] transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </main>
    );
  }

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
              <Link href="/about" className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight">
                About
              </Link>
              <Link href="/contact" className="text-[#0066cc] text-sm font-extralight">
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
                  className="text-[#1d1d1f] hover:text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-[#0066cc] text-sm font-extralight py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      <div className="container mx-auto px-6 max-w-2xl py-16">
        <h1 className="text-4xl font-extralight text-[#1d1d1f] mb-8">Contact Us</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-extralight text-[#1d1d1f] mb-2">
                Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                className="w-full px-4 py-3 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-sm font-extralight text-[#1d1d1f] mb-2">
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full px-4 py-3 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-sm font-extralight text-[#1d1d1f] mb-2">
                Message
              </label>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required 
                rows={5}
                className="w-full px-4 py-3 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] resize-vertical"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0066cc] text-white py-3 px-6 rounded-lg hover:bg-[#0052a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact; 