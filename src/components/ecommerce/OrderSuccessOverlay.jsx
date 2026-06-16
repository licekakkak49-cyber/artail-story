import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const OrderSuccessOverlay = ({ onClose, orderDetails, onSetPassword }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setIsSubmitting(true);
    // Call parent handler which interacts with Supabase Auth
    await onSetPassword(password);
    setIsSubmitting(false);
    setSuccessMsg('ACCOUNT CREATED. YOU MAY NOW ACCESS THE PORTAL.');
  };

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[10000] overflow-y-auto flex items-center justify-center selection:bg-[#111111] selection:text-[#ffffff]">
      <div className="w-full max-w-2xl mx-auto p-6 md:p-12 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="border border-[#111111]/10 p-8 md:p-16 w-full flex flex-col items-center text-center bg-[#ffffff]"
        >
          
          <h1 className="font-aura text-4xl md:text-5xl tracking-tight uppercase text-[#111111] mb-6">
            THANK YOU
          </h1>
          <p className="font-helvetica text-[12px] uppercase text-[#111111] mb-10 max-w-md leading-relaxed tracking-wide">
            ORDER <span className="font-bold">{orderDetails?.orderId || 'WAYD-00000'}</span> CONFIRMED.<br />
            RECEIPT SENT TO <span className="font-bold">{orderDetails?.email || 'EMAIL'}</span>.
          </p>

          <div className="w-full h-[1px] bg-[#111111]/10 mb-10"></div>

          {/* The Magic Trick */}
          {!successMsg ? (
            <div className="w-full flex flex-col items-center">
              <h2 className="font-helvetica font-bold text-[12px] uppercase tracking-widest text-[#111111] mb-3">TRACK YOUR COLLECTION</h2>
              <p className="font-helvetica text-[10px] uppercase tracking-widest text-[#a0a0a0] mb-8 max-w-sm leading-relaxed">
                SET A PASSWORD TO INSTANTLY CREATE YOUR WAYD CLIENT ACCOUNT.
              </p>
              
              <form onSubmit={handleCreateAccount} className="w-full max-w-sm flex flex-col gap-6">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="CREATE A SECURE PASSWORD" 
                  className="w-full border-b border-[#111111]/20 py-3 px-2 text-[12px] uppercase tracking-widest font-helvetica outline-none bg-transparent focus:border-black text-[#111111] transition-colors text-center" 
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting || !password}
                  className="w-full bg-[#111111] text-[#F5F5F5] py-4 font-inter-tight font-semibold text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full border border-[#111111]/10 p-6 bg-[#F5F5F5]">
              <p className="font-helvetica text-[10px] tracking-widest uppercase text-[#111111] font-bold">{successMsg}</p>
            </div>
          )}

          <div className="mt-16">
            <span onClick={onClose} className="font-helvetica text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0] cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
              CONTINUE EXPLORING
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
