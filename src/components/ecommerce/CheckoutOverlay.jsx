import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ onPaymentSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    } else {
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-[10px] font-helvetica uppercase font-bold tracking-widest">{errorMessage}</div>}
      <button 
        disabled={!stripe || isProcessing}
        type="submit" 
        className="w-full bg-[#111111] text-[#F5F5F5] py-4 font-inter-tight font-semibold text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-4"
      >
        {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
      </button>
    </form>
  );
};

export const CheckoutOverlay = ({ onClose, cartItems, cartTotal, onSuccess, onReturnToBag }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', shippingMethod: 'ups_ground'
  });
  const [errors, setErrors] = useState({});
  const [clientSecret, setClientSecret] = useState('pi_123_secret_456');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = true;
    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;
    if (!formData.address) newErrors.address = true;
    if (!formData.city) newErrors.city = true;
    if (!formData.state) newErrors.state = true;
    if (!formData.zip) newErrors.zip = true;
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    handleNext();
  };

  const shippingCost = formData.shippingMethod === 'fedex_2day' ? 25 
    : formData.shippingMethod === 'same_day' ? 35 
    : 0;
  const finalTotal = cartTotal + shippingCost;

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[9999] overflow-y-auto">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row min-h-screen">
        
        {/* Left Side: Forms */}
        <div className="w-full md:w-[55%] flex flex-col pt-8 md:pt-16 px-6 md:px-12 lg:px-20 pb-20">
          <div className="flex justify-between items-center mb-12">
            <h1 className="font-aura text-4xl tracking-tight uppercase text-[#111111]">
              CHECKOUT
            </h1>
            <span onClick={onClose} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
              CLOSE
            </span>
          </div>

          <div className="flex items-center gap-3 mb-10 border-b border-[#111111]/10 pb-4">
            <span className={`font-helvetica text-[9px] font-bold uppercase tracking-widest transition-colors ${step >= 1 ? 'text-[#111111]' : 'text-[#a0a0a0]'}`}>INFORMATION</span>
            <span className="text-[#a0a0a0] font-helvetica text-[9px] uppercase tracking-widest">/</span>
            <span className={`font-helvetica text-[9px] font-bold uppercase tracking-widest transition-colors ${step >= 2 ? 'text-[#111111]' : 'text-[#a0a0a0]'}`}>SHIPPING</span>
            <span className="text-[#a0a0a0] font-helvetica text-[9px] uppercase tracking-widest">/</span>
            <span className={`font-helvetica text-[9px] font-bold uppercase tracking-widest transition-colors ${step >= 3 ? 'text-[#111111]' : 'text-[#a0a0a0]'}`}>PAYMENT</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-10">
                
                <div className="flex flex-col gap-6">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">CONTACT INFORMATION</span>
                  <div className="flex flex-col">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.email ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    {errors.email && <span className="text-red-500 text-[9px] font-helvetica font-bold uppercase tracking-widest mt-2">Required</span>}
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SHIPPING ADDRESS</span>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.firstName ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.lastName ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.address ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.city ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.state ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" className={`w-full border-b py-3 text-[14px] font-helvetica outline-none bg-transparent transition-colors ${errors.zip ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-zinc-300 focus:border-black text-[#111111]'}`} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 flex flex-col md:flex-row items-center gap-6">
                  <span onClick={onReturnToBag} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors w-full md:w-1/3 text-center order-2 md:order-1 mt-4 md:mt-0">
                    RETURN TO BAG
                  </span>
                  <button onClick={validateStep1} className="w-full md:flex-1 bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors hover:bg-zinc-800 order-1 md:order-2">
                    CONTINUE TO SHIPPING
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SHIPPING METHOD</span>
                  <div className="flex flex-col border border-[#111111]/10">
                    <label className="flex items-center justify-between p-6 border-b border-[#111111]/10 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shippingMethod" value="ups_ground" checked={formData.shippingMethod === 'ups_ground'} onChange={handleChange} className="accent-black w-4 h-4" />
                        <div className="flex flex-col gap-1">
                          <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">UPS GROUND</span>
                          <span className="font-helvetica text-[10px] text-[#a0a0a0] uppercase tracking-widest">3-5 BUSINESS DAYS</span>
                        </div>
                      </div>
                      <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">FREE</span>
                    </label>
                    <label className="flex items-center justify-between p-6 border-b border-[#111111]/10 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shippingMethod" value="fedex_2day" checked={formData.shippingMethod === 'fedex_2day'} onChange={handleChange} className="accent-black w-4 h-4" />
                        <div className="flex flex-col gap-1">
                          <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">FEDEX 2-DAY</span>
                          <span className="font-helvetica text-[10px] text-[#a0a0a0] uppercase tracking-widest">2 BUSINESS DAYS</span>
                        </div>
                      </div>
                      <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">$25.00</span>
                    </label>
                    <label className="flex items-center justify-between p-6 border-b border-[#111111]/10 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shippingMethod" value="same_day" checked={formData.shippingMethod === 'same_day'} onChange={handleChange} className="accent-black w-4 h-4" />
                        <div className="flex flex-col gap-1">
                          <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">MESSENGER (SAME-DAY)</span>
                          <span className="font-helvetica text-[10px] text-[#a0a0a0] uppercase tracking-widest">MANHATTAN & BROOKLYN ONLY</span>
                        </div>
                      </div>
                      <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">$35.00</span>
                    </label>
                    <label className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="shippingMethod" value="pickup" checked={formData.shippingMethod === 'pickup'} onChange={handleChange} className="accent-black w-4 h-4" />
                        <div className="flex flex-col gap-1">
                          <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">IN-GALLERY PICKUP</span>
                          <span className="font-helvetica text-[10px] text-[#a0a0a0] uppercase tracking-widest">WAYD SOHO, NY (READY IN 24H)</span>
                        </div>
                      </div>
                      <span className="font-helvetica font-bold text-[12px] text-[#111111] tracking-tight">FREE</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                  <span onClick={handleBack} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors w-full md:w-1/3 text-center order-2 md:order-1 mt-4 md:mt-0">
                    RETURN TO INFO
                  </span>
                  <button onClick={handleNext} className="w-full md:flex-1 bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors hover:bg-zinc-800 order-1 md:order-2">
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">PAYMENT</span>
                  <div className="w-full border border-[#111111]/10 p-6">
                    {clientSecret === 'pi_123_secret_456' ? (
                      <div className="flex flex-col gap-6">
                        <div className="p-4 bg-[#F5F5F5] text-[#111111] text-[10px] font-helvetica font-bold tracking-widest uppercase">
                          TEST MODE: API NOT CONNECTED
                        </div>
                        <input type="text" placeholder="CARD NUMBER" className="w-full border-b border-zinc-300 py-3 text-[14px] font-helvetica outline-none bg-transparent focus:border-black text-[#111111]" />
                        <div className="flex gap-6">
                          <input type="text" placeholder="MM / YY" className="w-1/2 border-b border-zinc-300 py-3 text-[14px] font-helvetica outline-none bg-transparent focus:border-black text-[#111111]" />
                          <input type="text" placeholder="CVC" className="w-1/2 border-b border-zinc-300 py-3 text-[14px] font-helvetica outline-none bg-transparent focus:border-black text-[#111111]" />
                        </div>
                        <button onClick={() => onSuccess({ orderId: 'WAYD-' + Math.floor(Math.random() * 100000), email: formData.email })} className="mt-6 w-full bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors hover:bg-zinc-800">
                          SIMULATE PAYMENT
                        </button>
                      </div>
                    ) : clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#111111', fontFamily: 'Helvetica, Arial, sans-serif' } } }}>
                        <CheckoutForm onPaymentSuccess={(pid) => onSuccess({ orderId: 'WAYD-' + Math.floor(Math.random() * 100000), email: formData.email, paymentIntentId: pid })} clientSecret={clientSecret} />
                      </Elements>
                    ) : (
                      <div className="text-[10px] font-helvetica font-bold tracking-widest uppercase text-[#a0a0a0] animate-pulse">INITIALIZING GATEWAY...</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <span onClick={handleBack} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors w-full text-center">
                    RETURN TO SHIPPING
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full md:w-[45%] md:border-l border-[#111111]/10 px-6 py-12 md:p-16 flex flex-col bg-[#ffffff] min-h-[50vh] md:min-h-0">
          <div className="flex justify-between items-center border-b border-[#111111]/10 pb-4 mb-8">
            <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">ORDER SUMMARY</span>
          </div>
          
          <div className="flex flex-col gap-6 mb-8 flex-1 overflow-y-auto">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 aspect-[4/5] bg-[#F5F5F5] overflow-hidden shrink-0 relative">
                    <img src={item.src || item.image_url || (item.images && item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#111111] text-[#F5F5F5] flex items-center justify-center text-[9px] font-bold">{item.qty}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">"{item.name}"</span>
                  </div>
                </div>
                <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight mt-1">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 border-t border-[#111111]/10 pt-8 mt-auto">
            <div className="flex justify-between items-center">
              <span className="font-helvetica text-[#111111] text-[10px] font-bold uppercase tracking-widest">SUBTOTAL</span>
              <span className="font-helvetica text-[#111111] text-[14px] font-bold tracking-tight">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-helvetica text-[#a0a0a0] text-[10px] font-bold uppercase tracking-widest">SHIPPING</span>
              <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase tracking-widest">TOTAL</span>
              <span className="font-helvetica text-[#111111] text-[20px] font-bold tracking-tight">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
