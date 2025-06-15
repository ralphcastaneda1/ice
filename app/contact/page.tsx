'use client'

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      alert(`Error: ${error.code} - ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] py-16">
        <div className="container mx-auto px-6 max-w-2xl">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-16">
      <div className="container mx-auto px-6 max-w-2xl">
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
    </div>
  );
};

export default Contact; 