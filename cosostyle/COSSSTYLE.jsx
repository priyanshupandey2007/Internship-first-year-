import React, { useState } from 'react';
import { ShoppingCart, X, Menu } from 'lucide-react';

// Product Images (Base64 embedded)
const PRODUCT_IMAGES = {
  1: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABIAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=",
  2: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABIAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=",
  3: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABIAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k="
};

export default function CosstyleWebsite() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState('shop');

  const products = [
    {
      id: 1,
      name: "Classic Comfort",
      price: 45,
      image: PRODUCT_IMAGES[1],
      colors: ["#000", "#e63946", "#fff", "#333"],
      description: "Timeless design with premium comfort"
    },
    {
      id: 2,
      name: "Urban Edge",
      price: 48,
      image: PRODUCT_IMAGES[2],
      colors: ["#000", "#e63946", "#444", "#fff"],
      description: "Bold style for the modern trendsetter"
    },
    {
      id: 3,
      name: "Signature Style",
      price: 50,
      image: PRODUCT_IMAGES[3],
      colors: ["#e63946", "#000", "#333", "#fff"],
      description: "Our most iconic piece"
    },
    {
      id: 4,
      name: "Street Collection",
      price: 46,
      image: PRODUCT_IMAGES[2],
      colors: ["#000", "#e63946", "#444", "#fff"],
      description: "Street-inspired premium wear"
    },
    {
      id: 5,
      name: "Premium Essentials",
      price: 52,
      image: PRODUCT_IMAGES[1],
      colors: ["#000", "#e63946", "#333", "#fff"],
      description: "Quality meets sophistication"
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ background: '#0f0f0f', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)', borderBottom: '2px solid #e63946', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e63946', letterSpacing: '2px', margin: 0 }}>COSSSTYLE</h1>
          
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => setActiveSection('shop')} style={{ background: 'none', border: 'none', color: activeSection === 'shop' ? '#e63946' : '#fff', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px', transition: 'color 0.3s' }}>Shop</button>
            <button onClick={() => setActiveSection('about')} style={{ background: 'none', border: 'none', color: activeSection === 'about' ? '#e63946' : '#fff', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px', transition: 'color 0.3s' }}>About</button>
            <button onClick={() => setActiveSection('contact')} style={{ background: 'none', border: 'none', color: activeSection === 'contact' ? '#e63946' : '#fff', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px', transition: 'color 0.3s' }}>Contact</button>
          </nav>

          <button onClick={() => setShowCart(!showCart)} style={{ background: '#e63946', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', position: 'relative' }}>
            Cart {cart.length > 0 && <span style={{ marginLeft: '8px' }}>({cart.length})</span>}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '4rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(230, 57, 70, 0.3)' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '1rem', color: '#e63946', letterSpacing: '3px', textTransform: 'uppercase' }}>COSSSTYLE</h2>
        <p style={{ fontSize: '18px', color: '#999', maxWidth: '600px', margin: '0 auto' }}>Premium quality t-shirts crafted for the modern individual. Express your style, own your vibe.</p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
        {activeSection === 'shop' && (
          <section>
            <h2 style={{ fontSize: '32px', marginBottom: '3rem', textAlign: 'center', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Collection</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '3rem 2rem', borderRadius: '8px', borderLeft: '4px solid #e63946' }}>
            <h2 style={{ color: '#e63946', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>About COSSSTYLE</h2>
            <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              At COSSSTYLE, we believe in creating premium quality t-shirts that transcend trends and stand the test of time. Each piece is carefully crafted with attention to detail, comfort, and style.
            </p>
            <p style={{ color: '#ccc', lineHeight: 1.8 }}>
              Our commitment is to provide you with versatile, timeless pieces that become staples in your wardrobe. From classic cuts to contemporary designs, every t-shirt is a statement of individuality and quality.
            </p>
          </section>
        )}

        {activeSection === 'contact' && (
          <section style={{ textAlign: 'center', padding: '3rem 0' }}>
            <h2 style={{ color: '#e63946', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Get In Touch</h2>
            <p style={{ color: '#999', marginBottom: '2rem' }}>Have questions? We'd love to hear from you.</p>
            <a href="mailto:hello@cossstyle.com" style={{ display: 'inline-block', background: '#e63946', color: 'white', padding: '12px 32px', textDecoration: 'none', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Contact Us
            </a>
          </section>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#1a1a1a', border: '2px solid #e63946', borderRadius: '8px', padding: '2rem', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowCart(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#e63946', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}>
              ×
            </button>
            
            <h2 style={{ color: '#e63946', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Cart</h2>
            
            {cart.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>Your cart is empty</p>
            ) : (
              <>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #333' }}>
                      <div>
                        <h4 style={{ color: '#e63946', marginBottom: '0.5rem', margin: 0 }}>{item.name}</h4>
                        <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>${item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} style={{ background: '#e63946', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e63946', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#e63946', fontSize: '18px', marginBottom: '1.5rem' }}>
                  <span>Total:</span>
                  <span>${cartTotal}</span>
                </div>

                <button style={{ width: '100%', background: '#e63946', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#000', borderTop: '2px solid #e63946', padding: '2rem', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>&copy; 2026 COSSSTYLE. All rights reserved. Premium quality, timeless style.</p>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [showNotification, setShowNotification] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <>
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e63946'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(230, 57, 70, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '320px', objectFit: 'cover', background: '#2a2a2a' }} />
        
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.5rem', color: '#fff', margin: 0 }}>{product.name}</h3>
          <p style={{ fontSize: '14px', color: '#999', margin: '0 0 1rem 0' }}>{product.description}</p>
          
          <div style={{ fontSize: '24px', color: '#e63946', fontWeight: 700, marginBottom: '1rem' }}>${product.price}</div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {product.colors.map((color, i) => (
              <div key={i} style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: color, border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }} />
            ))}
          </div>
          
          <button onClick={handleAdd} style={{ width: '100%', background: '#e63946', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', transition: 'background 0.3s' }} onMouseEnter={(e) => e.target.style.background = '#ff4d4d'} onMouseLeave={(e) => e.target.style.background = '#e63946'}>
            Add to Cart
          </button>
        </div>
      </div>

      {showNotification && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#e63946', color: 'white', padding: '1rem 1.5rem', borderRadius: '4px', fontWeight: 600, zIndex: 3000 }}>
          {product.name} added to cart!
        </div>
      )}
    </>
  );
}
