import React from 'react';

export const Navbar = ({ cartCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-extrabold tracking-tight text-gray-900 cursor-pointer group">
          AERO<span className="text-indigo-600 transition-colors group-hover:text-indigo-500">LAB</span>
        </div>

        {/* Center Links (Purely Aesthetic for UI Polish) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="text-indigo-600">Shop</a>
          <a href="#" className="hover:text-gray-900 transition-colors">New Releases</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Collections</a>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5.5 h-5.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};