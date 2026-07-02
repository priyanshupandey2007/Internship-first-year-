import React, { useState } from 'react';

export const ProductGallery = ({ images, altText }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4 w-full">
      {/* Main Display Frame */}
      <div className="relative flex-1 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group">
        <img
          src={images[activeIndex]}
          alt={`${altText} view`}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full border border-white/40 shadow-sm text-gray-800 tracking-wide">
          Interactive View
        </div>
      </div>

      {/* Modern Sidebar/Grid Thumbnails */}
      <div className="flex md:flex-col gap-3 justify-start overflow-x-auto pb-2 md:pb-0 scrollbar-none min-w-[80px]">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square w-20 md:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border transition-all duration-200 outline-none ${
              activeIndex === index 
                ? 'border-indigo-600 ring-2 ring-indigo-600/10 scale-95 shadow-md' 
                : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
            }`}
            aria-label={`Switch to gallery image ${index + 1}`}
          >
            <img 
              src={img} 
              alt="" 
              className="h-full w-full object-cover object-center" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};