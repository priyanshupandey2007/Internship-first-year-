import React, { useState, useRef, useEffect } from 'react';

const WardrobeApp = () => {
  // ================= 1. STATE MANAGEMENT =================
  const [users, setUsers] = useState({
    'priyanshu': { password: '123', items: [] }
  });
  
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state to track password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('WARDROBE');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Top');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ================= 2. AUTHENTICATION LOGIC =================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanUsername = username.trim().toLowerCase();
    
    if (!cleanUsername || !password) {
      setErrorMessage('Fill in both fields to continue');
      setIsLoading(false);
      return;
    }

    if (!isSigningUp) {
      if (users[cleanUsername] && users[cleanUsername].password === password) {
        setLoggedInUser(cleanUsername);
        resetAuthFields();
      } else {
        setErrorMessage('Username or password incorrect');
      }
    } else {
      if (users[cleanUsername]) {
        setErrorMessage('Username already taken—try another');
      } else {
        setUsers(prevUsers => ({
          ...prevUsers,
          [cleanUsername]: { password: password, items: [] }
        }));
        setLoggedInUser(cleanUsername);
        resetAuthFields();
        setIsSigningUp(false);
      }
    }
    setIsLoading(false);
  };

  const resetAuthFields = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false); // Reset visibility on auth submit
    setErrorMessage('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setItemName('');
    setCategory('Top');
    setUploadedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // ================= 3. IMAGE UPLOAD & WARDROBE LOGIC =================
  const processFile = (file) => {
    if (!file) return;
    if (file.type && file.type.startsWith('image/')) {
      setUploadedFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      
      if (!itemName && file.name) {
        const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        setItemName(nameWithoutExtension || 'New Item');
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!uploadedFile || !loggedInUser) return;

    const newItem = {
      id: Date.now(),
      name: itemName || 'Untitled Item',
      category: category,
      image: imagePreview
    };

    setUsers(prevUsers => ({
      ...prevUsers,
      [loggedInUser]: {
        ...prevUsers[loggedInUser],
        items: [newItem, ...prevUsers[loggedInUser].items]
      }
    }));

    setItemName('');
    setCategory('Top');
    setUploadedFile(null);
    setImagePreview(null);
  };

  const currentUserData = loggedInUser ? users[loggedInUser] : { items: [] };

  // ================= VIEW A: FULL SCREEN PREMIUM LOGIN SCREEN =================
  if (!loggedInUser) {
    return (
      <div className={`w-full min-h-screen relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#060608] text-white' : 'bg-[#f3f4f6] text-gray-900'}`}>
        
        {/* Ambient Grid Background Elements */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none ${!isDarkMode && 'opacity-40'}`}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/[0.02] rounded-full blur-[140px] pointer-events-none"></div>

        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6 z-30">
          <button 
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${isDarkMode ? 'bg-[#111216] border-zinc-800 text-yellow-400 hover:bg-zinc-900' : 'bg-white border-gray-300 text-zinc-700 hover:bg-gray-50'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Full Viewport Flexible Container */}
        <div className="w-full min-h-screen flex flex-col md:flex-row relative z-10">
          
          {/* LEFT SIDE PANEL: Branding & Slogan Quote */}
          <div className={`w-full md:w-1/2 p-12 lg:p-16 flex flex-col justify-between relative md:border-r ${isDarkMode ? 'bg-gradient-to-br from-[#0a0b0d] via-[#0d0e12] to-black border-zinc-800/80' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border-gray-300'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#eab30805,transparent_50%)]"></div>
            
            {/* Header Branding Row */}
            <div className="flex items-center justify-between relative z-10 w-full">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black w-8 h-8 rounded-lg flex items-center justify-center font-black text-base shadow-[0_4px_12px_rgba(234,179,8,0.2)]">
                  W
                </div>
                <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>wardrobe ai</span>
              </div>
         
              <span className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               EST. 2026
              </span>
            </div>
                   
            {/* Core Value Text / Quote Section */}
            <div className="my-auto space-y-7 relative z-10 w-full max-w-sm">
              <h2 className={`text-3xl lg:text-4xl font-black tracking-tight leading-tight ${isDarkMode ? 'bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                Slay the last minute.
              </h2>
              <div className={`space-y-4 text-xs font-semibold tracking-wide ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                <div className="flex items-center gap-3"><span className="text-yellow-500 text-sm">✦</span> Ingest multi-modal apparel components</div>
                <div className="flex items-center gap-3"><span className="text-yellow-500 text-sm">✦</span> Real-time closet matrix tracking</div>
                <div className="flex items-center gap-3"><span className="text-yellow-500 text-sm">✦</span> Predictive styling composition layouts</div>
              </div>
            </div>

            <div className="h-4"></div>
          </div>

          {/* RIGHT SIDE PANEL: Main Input Form Control */}
          <div className={`w-full md:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative ${isDarkMode ? 'bg-[#090a0d]/40 backdrop-blur-md' : 'bg-white'}`}>
            
            <div className="max-w-md w-full mx-auto">
              <div className="mb-8">
                <h1 className={`text-2xl font-extrabold tracking-tight uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isSigningUp ? "signup" : "login"}
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                </h1>
                <p className={`text-xs mt-1.5 font-medium tracking-wide ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                  {isSigningUp ? "Create your personal layout account directory" : "Please input your credentials to access your workspace collection"}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2.5 animate-slideDown">
                  <span className="text-red-400 text-sm mt-0.5">⚠️</span>
                  <p className="text-red-300 text-xs font-semibold leading-relaxed tracking-wide">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className={`block text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                    username or E-mail
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter username"
                      className={`w-full border rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 outline-none focus:border-yellow-500/80 focus:shadow-[0_0_25px_rgba(234,179,8,0.05)] ${isDarkMode ? 'bg-[#111216]/90 border-zinc-800/80 text-white placeholder-zinc-700 focus:bg-[#14161d]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-gray-50/50'}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-40">👤</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                    password
                  </label>
                  <div className="relative group flex items-center">
                    {/* The input type changes dynamically based on showPassword */}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      placeholder="••••••••"
                      className={`w-full border rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium transition-all duration-300 outline-none focus:border-yellow-500/80 focus:shadow-[0_0_25px_rgba(234,179,8,0.05)] ${isDarkMode ? 'bg-[#111216]/90 border-zinc-800/80 text-white placeholder-zinc-700 focus:bg-[#14161d]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-gray-50/50'}`}
                    />
                    {/* Interactive Eye Trigger Option Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 focus:outline-none transition-opacity duration-200 hover:opacity-100 opacity-50 cursor-pointer select-none text-sm"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-black font-black py-3.5 rounded-xl text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(234,179,8,0.15)] cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>{isSigningUp ? "signup" : "login"}</span>
                  )}
                </button>
              </form>

              {/* Split Action Divider */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDarkMode ? 'border-zinc-800/60' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase">
                  <span className={`px-4 ${isDarkMode ? 'bg-[#060608] text-zinc-600' : 'bg-white text-gray-400'}`}>OR</span>
                </div>
              </div>

              {/* Toggle Link Mode */}
              <button
                type="button"
                onClick={() => { setIsSigningUp(!isSigningUp); setErrorMessage(''); }}
                disabled={isLoading}
                className={`w-full py-3.5 border rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 ${isDarkMode ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/50 text-zinc-300' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
              >
                {isSigningUp ? "Already have an account? login" : "Create an account? signup"}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW B: MAIN APP DASHBOARD =================
  return (
    <div className={`w-full min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8f9fa] text-gray-900'}`}>
      
      {/* Top Header Row */}
      <header className={`w-full border-b px-6 py-4 flex items-center justify-between ${isDarkMode ? 'bg-[#0d0d0d] border-[#1a1a1a]' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 text-black w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg">W</div>
          <h1 className="text-xl font-bold tracking-wider">Wardrobe AI</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold uppercase">{loggedInUser}</p>
            <p className="text-xs text-gray-500 font-medium">{loggedInUser}@wardrobeai.com</p>
          </div>

          <button 
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${isDarkMode ? 'bg-[#141414] border-[#222222] text-yellow-400' : 'bg-gray-100 border-gray-300 text-zinc-700'}`}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button 
            type="button"
            onClick={handleLogout}
            className={`text-xs font-bold border px-4 py-2 rounded-lg transition-all cursor-pointer ${isDarkMode ? 'text-gray-400 border-[#222222] bg-[#141414] hover:text-white' : 'text-gray-600 border-gray-300 bg-gray-100 hover:bg-gray-200'}`}
          >
            Log out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className={`max-w-5xl mx-auto px-4 mt-6 flex gap-8 border-b ${isDarkMode ? 'border-[#161616]' : 'border-gray-200'}`}>
        {['WARDROBE', 'OUTFITS', 'WEEKLY'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold tracking-widest relative cursor-pointer ${activeTab === tab ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-yellow-500 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* Main Container Workspace */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Ingest Apparel block */}
        <div className={`border rounded-2xl p-6 shadow-xl mb-8 ${isDarkMode ? 'bg-[#121212] border-[#232323]' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-lg font-bold tracking-wide">Ingest Apparel Modality</h2>
              <p className="text-sm text-gray-500 mt-1">Upload layout assets directly into your digital wardrobe network workspace.</p>
            </div>

            {/* Drag Zone Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer?.files?.[0]) processFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all w-full md:w-72 h-28 text-center ${isDragging ? 'border-yellow-500 bg-yellow-500/5' : (isDarkMode ? 'border-[#333333] bg-[#181818]' : 'border-gray-300 bg-gray-50')}`}
            >
              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => { if (e.target?.files?.[0]) processFile(e.target.files[0]); }} className="hidden" />
              
              {imagePreview ? (
                <div className="absolute inset-0 flex items-center justify-between px-4 bg-inherit rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-600" />
                    <div className="text-left min-w-0">
                      <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-wider">Loaded</p>
                      <p className="text-xs truncate max-w-[120px] text-gray-400">{uploadedFile?.name || 'Asset Image'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-zinc-800 text-gray-300 rounded hover:text-yellow-500">Change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <span className="text-2xl">📸</span>
                  <p className="text-xs"><span className="text-yellow-500 font-semibold">Click to browse</span> or drag image here</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAddItem} className="flex flex-col md:flex-row items-end gap-4 w-full">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Item Label Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Vintage Leather Jacket"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 ${isDarkMode ? 'bg-[#181818] border-[#2d2d2d] text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>

            <div className="w-full md:w-[200px] flex-shrink-0">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Category Classification</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-yellow-500 ${isDarkMode ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                <option value="Top">👕 Top</option>
                <option value="Outerwear">🧥 Outerwear</option>
                <option value="Bottom">👖 Bottom</option>
                <option value="Shoes">👟 Shoes</option>
              </select>
            </div>

            <div className="w-full md:w-[130px] flex-shrink-0">
              <button
                type="submit"
                disabled={!uploadedFile}
                className={`w-full font-bold py-2.5 rounded-xl transition-all text-sm tracking-wide ${uploadedFile ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:brightness-110 cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                Add Item
              </button>
            </div>
          </form>
        </div>

        {/* Closet Inventory Matrix Display */}
        <div className="mt-12">
          <h3 className="text-lg font-bold tracking-wide mb-6">Closet Inventory Matrix ({currentUserData.items.length})</h3>
          
          {currentUserData.items.length === 0 ? (
            <div className={`border border-dashed rounded-2xl p-16 text-center ${isDarkMode ? 'border-[#232323] bg-[#121212]/30' : 'border-gray-300 bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Your custom matrix is currently empty. Ingest device files to register clothing blocks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {currentUserData.items.map((item) => (
                <div key={item.id} className={`border rounded-xl overflow-hidden shadow-md transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#121212] border-[#222222]' : 'bg-white border-gray-200'}`}>
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover border-b border-inherit" />
                  <div className="p-3">
                    <p className="text-xs font-bold tracking-wide truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default WardrobeApp;