import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthOverlay = ({ onClose, onLogin, onRegister, setView, setOverlayView, setEcommerceView, cartCount, currentUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '',
    username: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        // Validation checks
        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username)) {
          throw new Error('Username can only contain letters, numbers, and underscores.');
        }

        await onRegister(
          formData.email, 
          formData.password, 
          { 
            firstName: formData.firstName, 
            lastName: formData.lastName,
            username: formData.username 
          }
        );
      }
      onClose(); // Close overlay on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col bg-white overflow-y-auto selection:bg-[#111111] selection:text-white">
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-transparent h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-light capitalize tracking-widest text-black/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Our Journey</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-black bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { onClose(); setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-light capitalize tracking-widest text-black/80">
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">BAG ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#ffffff] z-[90] flex flex-col justify-evenly items-center pt-[140px] pb-[40px] h-[100dvh] overflow-y-auto gap-2 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">Our Journey</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-black text-2xl font-light capitalize tracking-widest cursor-pointer">Visit</span>
            
            <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                className="border border-black/20 text-black hover:bg-black hover:text-white rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
              >
                BAG ({cartCount})
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    onClose();
                    setEcommerceView('profile');
                  }
                }} 
                className="bg-black text-white hover:bg-black/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
              >
                {currentUser ? 'Account' : 'Log In'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16 pt-[160px] md:pt-[180px]">
        <motion.div 
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-helvetica font-bold text-[28px] text-black tracking-normal uppercase mb-3">
              {isLogin ? 'Login' : 'Join'}
            </h2>
            <p className="text-zinc-500 font-helvetica font-light text-xs md:text-sm tracking-wide">
              {isLogin ? 'Please enter your e-mail and password:' : 'Please enter your details to create an account:'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <>
                {/* First Name / Last Name side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                      First name
                    </label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                      className="w-full px-4 py-3 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                      Last name
                    </label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                      className="w-full px-4 py-3 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                      required 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-3 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                    required 
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col">
                  <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Username <span className="text-zinc-500 font-normal lowercase">(letters, numbers, underscores)</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    className="w-full px-4 py-3 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                    required 
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Password <span className="text-zinc-500 font-normal lowercase">(min. 8 char)</span>
                  </label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full px-4 py-3 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                    required 
                  />
                </div>
              </>
            )}

            {isLogin && (
              <>
                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-3.5 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                    required 
                  />
                </div>

                {/* Password & Forgot Link inside */}
                <div className="flex flex-col">
                  <label className="font-helvetica font-light text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Password
                  </label>
                  <div className="relative w-full">
                    <input 
                      type="password" 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      className="w-full pl-4 pr-36 py-3.5 border border-zinc-300 bg-white text-sm font-helvetica font-light text-black outline-none focus:border-black transition-all rounded-none" 
                      required 
                    />
                    <span 
                      onClick={() => setError('Password reset instructions will be sent to your email.')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-helvetica text-[11px] font-light text-zinc-500 hover:text-black cursor-pointer underline decoration-zinc-300"
                    >
                      Forgot password?
                    </span>
                  </div>
                </div>
              </>
            )}

            {error && <span className="text-red-500 text-xs font-helvetica font-light mt-1">{error}</span>}

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-4 w-full bg-black hover:bg-zinc-900 text-white py-4 rounded-none font-helvetica font-medium text-xs md:text-sm uppercase tracking-[0.2em] transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Join')}
            </button>
          </form>

          {/* Bottom Switch Account Links */}
          <div className="mt-8 text-center">
            {isLogin ? (
              <span className="font-helvetica font-light text-xs md:text-sm text-zinc-500">
                New customer?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(false)} 
                  className="text-black underline font-light hover:text-zinc-600 transition-colors"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span className="font-helvetica font-light text-xs md:text-sm text-zinc-500">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(true)} 
                  className="text-black underline font-light hover:text-zinc-600 transition-colors"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
