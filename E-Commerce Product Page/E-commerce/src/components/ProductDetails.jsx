import React, { useState } from 'react';

export const ProductDetails = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('10');
  const [isAdding, setIsAdding] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddClick = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(quantity);
      setQuantity(1);
      setIsAdding(false);
    }, 600); // UI micro-interaction animation loop
  };

  return (
    <div className="flex flex-col justify-start w-full lg:pl-4 pt-4 lg:pt-0">
      {/* Breadcrumb / Category Tag */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
          Premium Performance
        </span>
      </div>

      {/* Heading Group */}
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
        {product.name}
      </h1>
      
      {/* Price & Rating Mockup */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        <div className="flex items-center text-sm text-gray-500 gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <span className="text-amber-400">★</span>
          <span className="font-semibold text-gray-700">4.9</span>
          <span className="text-gray-400">(128 reviews)</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8">
        {product.description}
      </p>

      {/* Added Variant Selector Component for realistic premium layout */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-900">Select Size (US Men)</label>
          <a href="#" className="text-xs font-medium text-indigo-600 hover:underline">Size Guide</a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['8', '9', '10', '11'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 text-center text-sm font-semibold rounded-xl border transition-all ${
                selectedSize === size
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 ring-1 ring-indigo-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Segment */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
        {/* Modern Custom Quantity Increment Counter */}
        <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-gray-50 p-1.5 sm:w-1/3">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-white active:scale-95 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 font-semibold transition-all disabled:opacity-20 disabled:hover:bg-transparent"
            aria-label="Decrease"
          >
            —
          </button>
          <span className="font-bold text-gray-900 w-8 text-center select-none">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-white active:scale-95 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 font-semibold transition-all"
            aria-label="Increase"
          >
            +
          </button>
        </div>

        {/* High-Impact CTA Button */}
        <button
          onClick={handleAddClick}
          disabled={isAdding}
          className={`flex-1 relative overflow-hidden text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all duration-300 ${
            isAdding ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-700/30'
          }`}
        >
          <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${isAdding ? 'scale-0' : 'scale-100'}`}>
            Add to Bag
          </span>
          {isAdding && (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tracking-wide animate-pulse">
              ✓ Added to Bag!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};