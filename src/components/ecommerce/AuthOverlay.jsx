import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const AuthOverlay = ({ onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
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
    <div className="fixed inset-0 z-[10000] flex flex-col bg-[#F5F5F5] overflow-y-auto selection:bg-[#111111] selection:text-[#F5F5F5]">
      {/* Top Bar with Logo & Close Button */}
      <div className="w-full flex justify-between items-center px-[6vw] md:px-[8vw] py-6 bg-transparent">
        <img 
          src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/D.svg" 
          alt="logo" 
          className="h-8 sm:h-9 object-contain brightness-0" 
        />
        <button 
          onClick={onClose} 
          className="font-inter-tight text-[11px] font-bold uppercase tracking-widest cursor-pointer text-[#111111] hover:text-zinc-500 transition-colors"
        >
          [ CLOSE ]
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16 pt-4">
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
            <h2 className="font-inter-tight font-extrabold text-4xl text-[#111111] tracking-tight mb-2">
              {isLogin ? 'Login' : 'Join WAYD'}
            </h2>
            {isLogin ? (
              <p className="text-zinc-500 font-inter text-sm">
                Welcome back.
              </p>
            ) : (
              <p className="text-zinc-500 font-inter text-sm">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-[#111111] underline hover:text-zinc-600 transition-colors"
                >
                  Login
                </button>
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <>
                {/* First Name / Last Name side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                      First name
                    </label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                      className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                      Last name
                    </label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                      className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                      required 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                    required 
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col">
                  <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Username <span className="text-zinc-500 font-normal lowercase">(only letters, numbers and underscores)</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                    required 
                  />
                </div>

                {/* Password (min. 8 char) */}
                <div className="flex flex-col">
                  <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Password <span className="text-zinc-500 font-normal lowercase">(min. 8 char)</span>
                  </label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                    required 
                  />
                </div>

              </>
            )}

            {isLogin && (
              <>
                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-inter-tight font-bold text-xs uppercase tracking-wider mb-2 text-[#111111]">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                    required 
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-inter-tight font-bold text-xs uppercase tracking-wider text-[#111111]">
                      Password
                    </label>
                    <span className="font-inter text-xs text-zinc-500 hover:text-black cursor-pointer underline">
                      Forgot your password?
                    </span>
                  </div>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-[#EBF1FA]/40 text-sm font-inter text-black outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all" 
                    required 
                  />
                </div>
              </>
            )}

            {error && <span className="text-red-500 text-xs font-inter mt-1">{error}</span>}

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-2 w-full bg-[#111111] hover:bg-zinc-800 text-[#F5F5F5] py-4 rounded-lg font-inter-tight font-bold text-xs md:text-sm uppercase tracking-wider transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Join')}
            </button>
          </form>

          {/* Bottom Switch Account section (Only visible on Login view) */}
          {isLogin && (
            <div className="mt-12 py-6 border border-zinc-200 rounded-lg text-center flex items-center justify-center bg-white relative overflow-hidden">
              <span className="font-inter text-sm text-[#111111] z-10">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(false)} 
                  className="font-bold underline hover:text-zinc-600 transition-colors"
                >
                  Join
                </button>
              </span>
              
              {/* SVG curls styling elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* Left hand curl */}
                <svg className="absolute left-3 top-3 w-10 h-10 text-zinc-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10,75 C25,65 35,40 18,20 C8,10 5,28 18,45 C28,55 45,65 65,45" />
                </svg>
                {/* Right hand pointing arrow */}
                <svg className="absolute right-4 top-4 w-8 h-8 text-zinc-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M80,20 Q60,30 40,60 M40,60 L58,60 M40,60 L40,42" />
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
