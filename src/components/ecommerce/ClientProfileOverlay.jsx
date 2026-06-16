import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ClientProfileOverlay = ({ onClose, user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    location: '',
    bio: ''
  });
  
  const [addresses, setAddresses] = useState([
    { id: 1, firstName: 'Narudee', lastName: 'Chaisuk', company: '', line1: '123 Art Gallery Ave', line2: 'Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States', phone: '+1 555-0198' }
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    firstName: '', lastName: '', company: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: ''
  });
  const [addressErrors, setAddressErrors] = useState({});
  
  useEffect(() => {
    setOrders([
      { 
        id: 'WAYD-00123', date: '2026-06-12', total: 129.00, status: 'DELIVERED', items: 1,
        tracking: 'UPS 1Z9999999999999999',
        shippingAddress: { name: 'Narudee Chaisuk', line1: '123 Art Gallery Ave', line2: 'Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
        products: [
          { name: 'Ceramic Vase Series 01', designer: 'STUDIO A', price: 129.00, qty: 1, img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80' }
        ]
      },
      { 
        id: 'WAYD-00145', date: '2026-06-15', total: 375.00, status: 'PROCESSING', items: 2,
        tracking: null,
        shippingAddress: { name: 'Narudee Chaisuk', line1: '123 Art Gallery Ave', line2: 'Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
        products: [
          { name: 'Abstract Sculpture', designer: 'ATELIER B', price: 250.00, qty: 1, img: 'https://images.unsplash.com/photo-1554188248-986ff1aeb6c4?auto=format&fit=crop&w=200&q=80' },
          { name: 'Art Book Vol 2', designer: 'WAYD EDITIONS', price: 125.00, qty: 1, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80' }
        ]
      }
    ]);
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || ''
      }));
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username
      });
    }
    alert('ACCOUNT DETAILS SAVED.');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const errors = {};
    if (!addressFormData.firstName.trim()) errors.firstName = true;
    if (!addressFormData.lastName.trim()) errors.lastName = true;
    if (!addressFormData.line1.trim()) errors.line1 = true;
    if (!addressFormData.city.trim()) errors.city = true;
    if (!addressFormData.state.trim()) errors.state = true;
    
    const zipCode = addressFormData.zip.trim();
    if (!zipCode) {
      errors.zip = true;
    } else if (['united states', 'us', 'usa'].includes(addressFormData.country.trim().toLowerCase())) {
      if (!/^\d{5}(-\d{4})?$/.test(zipCode)) errors.zip = true;
    } else if (zipCode.length < 3) {
      errors.zip = true;
    }

    if (!addressFormData.country.trim()) errors.country = true;
    
    const phone = addressFormData.phone.trim();
    if (!phone) {
      errors.phone = true;
    } else if (!/^\+?[\d\s\-\(\)]{7,20}$/.test(phone)) {
      errors.phone = true;
    }
    
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddressErrors({});
    setAddresses([...addresses, { id: Date.now(), ...addressFormData }]);
    setIsAddingAddress(false);
    setAddressFormData({ firstName: '', lastName: '', company: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: '' });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col bg-[#ffffff] overflow-y-auto selection:bg-[#111111] selection:text-[#ffffff]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col px-6 md:px-12 lg:px-20 pb-24 pt-8 md:pt-16 min-h-screen">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aura text-4xl tracking-tight uppercase text-[#111111]">
            CLIENT PORTAL
          </h1>
          <span onClick={onClose} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
            CLOSE
          </span>
        </div>
        
        <div className="flex flex-col mb-12 pb-6 border-b border-[#111111]/10">
           <span className="font-helvetica text-[#111111] text-[14px] font-bold uppercase tracking-tight">
             {formData.firstName || 'CLIENT'} {formData.lastName || ''} <span className="text-[#a0a0a0] font-normal mx-2">/</span> {activeTab === 'orders' ? 'ORDER HISTORY' : activeTab === 'addresses' ? 'SAVED ADDRESSES' : 'ACCOUNT DETAILS'}
           </span>
           <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mt-2">
             MANAGE YOUR ACQUISITIONS, PREFERENCES, AND ACCOUNT DETAILS
           </span>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Sidebar */}
          <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-6 font-helvetica">
            <span className="text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-2">MENU</span>
            
            <button 
              onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }} 
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors w-fit ${activeTab === 'orders' ? 'text-[#111111] border-b border-[#111111]' : 'text-[#a0a0a0] hover:text-[#111111]'}`}
            >
              ORDER HISTORY
            </button>
            <button 
              onClick={() => { setActiveTab('addresses'); setSelectedOrder(null); }} 
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors w-fit ${activeTab === 'addresses' ? 'text-[#111111] border-b border-[#111111]' : 'text-[#a0a0a0] hover:text-[#111111]'}`}
            >
              SAVED ADDRESSES
            </button>
            <button 
              onClick={() => { setActiveTab('account'); setSelectedOrder(null); }} 
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors w-fit ${activeTab === 'account' ? 'text-[#111111] border-b border-[#111111]' : 'text-[#a0a0a0] hover:text-[#111111]'}`}
            >
              ACCOUNT DETAILS
            </button>
            
            <div className="w-full h-[1px] bg-[#111111]/10 my-4"></div>
            
            <button 
              onClick={() => { onLogout(); onClose(); }} 
              className="text-left text-[#a0a0a0] hover:text-[#111111] text-[11px] font-bold uppercase tracking-widest transition-colors w-fit"
            >
              SIGN OUT
            </button>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 w-full bg-[#ffffff]">

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                {selectedOrder ? (
                  <div className="flex flex-col border border-[#111111]/10 p-6 md:p-12">
                    <div className="flex justify-between items-center pb-6 border-b border-[#111111]/10 mb-8">
                      <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase tracking-tight">ORDER #{selectedOrder.id}</span>
                      <span onClick={() => setSelectedOrder(null)} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
                        RETURN
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">DATE</span>
                          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight uppercase">{selectedOrder.date}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">STATUS</span>
                          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight uppercase">{selectedOrder.status}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">TRACKING</span>
                          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight uppercase">{selectedOrder.tracking || 'NOT AVAILABLE'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6 border-t border-[#111111]/10 pt-8">
                        <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-2">ITEMS</span>
                        {selectedOrder.products?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center pb-4 border-b border-[#111111]/10">
                            <div className="flex items-center gap-6">
                              <div className="w-16 md:w-20 aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <span className="font-helvetica text-[#111111] text-[12px] md:text-[14px] font-bold tracking-tight uppercase">"{item.name}"</span>
                                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">QTY: 0{item.qty}</span>
                              </div>
                            </div>
                            <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                        <div className="flex flex-col gap-3">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-2">SHIPPING TO</span>
                          <span className="font-helvetica text-[#111111] text-[12px] uppercase tracking-wide">{selectedOrder.shippingAddress?.name}</span>
                          <span className="font-helvetica text-[#111111] text-[12px] uppercase tracking-wide">{selectedOrder.shippingAddress?.line1} {selectedOrder.shippingAddress?.line2}</span>
                          <span className="font-helvetica text-[#111111] text-[12px] uppercase tracking-wide">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</span>
                          <span className="font-helvetica text-[#111111] text-[12px] uppercase tracking-wide">{selectedOrder.shippingAddress?.country}</span>
                        </div>
                        
                        <div className="flex flex-col gap-4 bg-[#F5F5F5] p-6 border border-[#111111]/10">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-2">SUMMARY</span>
                          <div className="flex justify-between items-center">
                            <span className="font-helvetica text-[#111111] text-[10px] font-bold uppercase tracking-widest">SUBTOTAL</span>
                            <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">${selectedOrder.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-helvetica text-[#a0a0a0] text-[10px] font-bold uppercase tracking-widest">SHIPPING</span>
                            <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">FREE</span>
                          </div>
                          <div className="w-full h-[1px] bg-[#111111]/10 my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase tracking-widest">TOTAL</span>
                            <span className="font-helvetica text-[#111111] text-[16px] font-bold tracking-tight">${selectedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-8">ORDER HISTORY</span>
                    {orders.length === 0 ? (
                      <div className="py-12 border-t border-b border-[#111111]/10 text-center">
                        <span className="font-helvetica text-[#a0a0a0] text-[11px] font-bold uppercase tracking-widest">NO ORDERS FOUND</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="hidden md:grid grid-cols-4 gap-4 border-b border-[#111111]/10 pb-4 mb-4">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">ORDER</span>
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">DATE</span>
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">STATUS</span>
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest text-right">TOTAL</span>
                        </div>
                        {orders.map((order) => (
                          <div key={order.id} className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-0 gap-x-4 border-b border-[#111111]/10 py-6 items-center">
                            <div className="flex flex-col">
                              <span className="md:hidden font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-1">ORDER</span>
                              <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase">{order.id}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="md:hidden font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-1">DATE</span>
                              <span className="font-helvetica text-[#111111] text-[12px] uppercase">{order.date}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="md:hidden font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-1">STATUS</span>
                              <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase">{order.status}</span>
                            </div>
                            <div className="flex flex-col items-end gap-2 col-span-2 md:col-span-1">
                              <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">${order.total.toFixed(2)}</span>
                              <span onClick={() => setSelectedOrder(order)} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
                                VIEW DETAILS
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SAVED ADDRESSES</span>
                  {!isAddingAddress && (
                    <span onClick={() => setIsAddingAddress(true)} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
                      ADD NEW
                    </span>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleSaveAddress} className="flex flex-col gap-10 border border-[#111111]/10 p-6 md:p-12 mb-8">
                    <div className="flex flex-col gap-6">
                      <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">NEW ADDRESS</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <input type="text" name="firstName" value={addressFormData.firstName} onChange={(e) => setAddressFormData({...addressFormData, firstName: e.target.value})} placeholder="FIRST NAME *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.firstName ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                        <div className="flex flex-col">
                          <input type="text" name="lastName" value={addressFormData.lastName} onChange={(e) => setAddressFormData({...addressFormData, lastName: e.target.value})} placeholder="LAST NAME *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.lastName ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <input type="text" name="company" value={addressFormData.company} onChange={(e) => setAddressFormData({...addressFormData, company: e.target.value})} placeholder="COMPANY (OPTIONAL)" className="w-full border-b border-[#111111]/20 py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent focus:border-black text-[#111111] transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <input type="text" name="line1" value={addressFormData.line1} onChange={(e) => setAddressFormData({...addressFormData, line1: e.target.value})} placeholder="ADDRESS *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.line1 ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                      </div>
                      <div className="flex flex-col">
                        <input type="text" name="line2" value={addressFormData.line2} onChange={(e) => setAddressFormData({...addressFormData, line2: e.target.value})} placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)" className="w-full border-b border-[#111111]/20 py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent focus:border-black text-[#111111] transition-colors" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <input type="text" name="city" value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} placeholder="CITY *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.city ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                        <div className="flex flex-col">
                          <input type="text" name="state" value={addressFormData.state} onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} placeholder="STATE / PROVINCE *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.state ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <input type="text" name="zip" value={addressFormData.zip} onChange={(e) => setAddressFormData({...addressFormData, zip: e.target.value})} placeholder="ZIP / POSTAL CODE *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.zip ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                        <div className="flex flex-col">
                          <input type="text" name="country" value={addressFormData.country} onChange={(e) => setAddressFormData({...addressFormData, country: e.target.value})} placeholder="COUNTRY *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.country ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <input type="text" name="phone" value={addressFormData.phone} onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})} placeholder="PHONE NUMBER *" className={`w-full border-b py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent transition-colors ${addressErrors.phone ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-[#111111]/20 focus:border-black text-[#111111]'}`} />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                      <button type="submit" className="w-full md:flex-1 bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors hover:bg-zinc-800 order-1 md:order-2">
                        SAVE ADDRESS
                      </button>
                      <span onClick={() => { setIsAddingAddress(false); setAddressErrors({}); }} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors w-full md:w-1/3 text-center order-2 md:order-1 mt-4 md:mt-0">
                        CANCEL
                      </span>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flex flex-col p-6 border border-[#111111]/10 bg-white">
                        <span className="font-helvetica text-[#111111] text-[12px] font-bold uppercase mb-4">{addr.firstName} {addr.lastName}</span>
                        {addr.company && <span className="font-helvetica text-[#111111] text-[12px] uppercase">{addr.company}</span>}
                        <span className="font-helvetica text-[#111111] text-[12px] uppercase">{addr.line1}</span>
                        {addr.line2 && <span className="font-helvetica text-[#111111] text-[12px] uppercase">{addr.line2}</span>}
                        <span className="font-helvetica text-[#111111] text-[12px] uppercase">{addr.city}, {addr.state} {addr.zip}</span>
                        <span className="font-helvetica text-[#111111] text-[12px] uppercase">{addr.country}</span>
                        <span className="font-helvetica text-[#111111] text-[12px] uppercase mt-2">{addr.phone}</span>
                        
                        <div className="flex gap-4 mt-8 pt-4 border-t border-[#111111]/10">
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">EDIT</span>
                          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-red-500 underline underline-offset-4 decoration-1 transition-colors">REMOVE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ACCOUNT DETAILS TAB */}
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mb-8">ACCOUNT DETAILS</span>
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <input type="text" name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="FIRST NAME" className="w-full border-b border-[#111111]/20 py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent focus:border-black text-[#111111] transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <input type="text" name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="LAST NAME" className="w-full border-b border-[#111111]/20 py-3 text-[12px] uppercase font-helvetica outline-none bg-transparent focus:border-black text-[#111111] transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <input type="email" value={user?.email || ''} readOnly placeholder="EMAIL" className="w-full border-b border-[#111111]/10 py-3 text-[12px] uppercase font-helvetica outline-none bg-[#F5F5F5] text-zinc-500 cursor-not-allowed px-4" />
                    <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest mt-2">EMAIL CANNOT BE CHANGED</span>
                  </div>

                  <div className="pt-8">
                    <button type="submit" className="w-full md:w-auto px-12 bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors hover:bg-zinc-800">
                      SAVE CHANGES
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
