/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { FreeCheck } from './components/FreeCheck';
import { Modules } from './components/Modules';
import { Measured } from './components/Measured';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('ownbench_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ownbench_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ownbench_theme', 'light');
    }
  }, [darkMode]);

  const openCheckout = () => setCheckoutOpen(true);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--tx)] selection:bg-[#F2C230] selection:text-[#121A16] transition-colors duration-150">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenCheckout={openCheckout}
      />

      <main className="flex-1">
        <Hero onOpenCheckout={openCheckout} />
        <Problem />
        <FreeCheck />
        <Modules />
        <Measured />
        <Pricing onOpenCheckout={openCheckout} />
        <FAQ />
        <Contact />
      </main>

      <Footer />

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
