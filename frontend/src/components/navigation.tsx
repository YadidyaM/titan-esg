'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLandingPage = pathname === '/';
  const isDashboard = pathname === '/dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-bold text-xl">Titan ESG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isLandingPage 
                  ? 'text-emerald-400 border-b-2 border-emerald-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDashboard 
                  ? 'text-emerald-400 border-b-2 border-emerald-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/ai-analysis" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              AI Analysis
            </Link>
            <Link 
              href="/team" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Team
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {isLandingPage ? (
              <Link 
                href="/dashboard" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                href="/" 
                className="bg-transparent border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Back to Home
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-lg mt-2">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isLandingPage 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isDashboard 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/ai-analysis" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                AI Analysis
              </Link>
              <Link 
                href="/team" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Team
              </Link>
              <div className="pt-4 pb-2">
                {isLandingPage ? (
                  <Link 
                    href="/dashboard" 
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/" 
                    className="block w-full text-center bg-transparent border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Back to Home
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
