'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <div className="inline-block relative">
            <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-bold text-blue-400 blur-2xl opacity-30 animate-bounce"></div>
          </div>
        </div>

        {/* Main content */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 animate-fadeInDown">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed animate-fadeInUp">
          The page you&apos;re looking for seems to have wandered off into the cool atmosphere. Let&apos;s get you back to comfort.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-cyan-600"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Contact Support
          </Link>
        </div>

        {/* Floating icons */}
        <div className="mt-20 grid grid-cols-3 gap-8 justify-items-center">
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
            ❄️
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
            🌡️
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>
            ❄️
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
