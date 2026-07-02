import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductGallery } from './components/ProductGallery';
import { ProductDetails } from './components/ProductDetails';

const MOCK_PRODUCT = {
  id: 'prod_01',
  name: 'AeroStride Kinetic Sneakers',
  price: 145.00,
  description: 'Engineered for ultimate breathability and ultra-lightweight performance. Featuring an adaptive seamless knit upper alongside our signature response-cushioned sole, the Kinetic transitions effortlessly from high-intensity training to daily city traversal.',
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
  ]
};

export default function App() {
  const [globalCartCount, setGlobalCartCount] = useState(0);

  const handleAddToCart = (quantity) => {
    setGlobalCartCount((prev) => prev + quantity);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      <Navbar cartCount={globalCartCount} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-16 lg:px-8">
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-gray-100 shadow-xl shadow-slate-200/50 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductGallery 
            images={MOCK_PRODUCT.images} 
            altText={MOCK_PRODUCT.name} 
          />
          <ProductDetails 
            product={MOCK_PRODUCT} 
            onAddToCart={handleAddToCart} 
          />
        </div>
      </main>
    </div>
  );
}