const fs = require('fs');

const newCode = `const AdminStudioOrders = () => {
  const [mockOrders, setMockOrders] = useState([
    { id: "ORD-001", customer: "Sophia L.", email: "sophia.l@example.com", phone: "+1 212-555-0199", address: "123 Bedford Ave, Apt 4B\\nBrooklyn, NY 11211", date: "Today, 14:30", total: 464, status: "Pending", items: [{ name: "Enchanted Canvas", qty: 1, price: 375 }, { name: "Ethereal Serenade", qty: 1, price: 89 }], tracking: "" },
    { id: "ORD-002", customer: "James W.", email: "james.w@example.com", phone: "+1 917-555-4422", address: "456 Lexington Ave\\nNew York, NY 10017", date: "Yesterday", total: 150, status: "Processing", items: [{ name: "Signature Glassware", qty: 1, price: 150 }], tracking: "" },
    { id: "ORD-003", customer: "Emma R.", email: "emma.rose@example.com", phone: "+1 646-555-8811", address: "789 Park Ave, Suite 1200\\nNew York, NY 10021", date: "May 28, 2026", total: 210, status: "Shipped", items: [{ name: "Sculptural Vase Set", qty: 1, price: 210 }], tracking: "TRK987654321" },
    { id: "ORD-004", customer: "Michael T.", email: "m.thomas@example.com", phone: "+1 212-555-9933", address: "321 Broadway\\nNew York, NY 10007", date: "May 27, 2026", total: 75, status: "Shipped", items: [{ name: "The Artail Story Book", qty: 1, price: 75 }], tracking: "TRK123456789" },
  ]);

  const [selectedOrderId, setSelectedOrder] = useState(null); // start null for mobile view
  const [filter, setFilter] = useState('All');
  
  const selectedOrder = mockOrders.find(o => o.id === selectedOrderId);
  const filteredOrders = filter === 'All' ? mockOrders : mockOrders.filter(o => o.status === filter);

  const stats = {
    today: mockOrders.filter(o => o.date.includes('Today')).length,
    revenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
    toFulfill: mockOrders.filter(o => o.status !== 'Shipped').length
  };

  const handleUpdateStatus = (id, newStatus) => {
    setMockOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleSaveTracking = (id, trackingNo) => {
    setMockOrders(prev => prev.map(o => o.id === id ? { ...o, tracking: trackingNo, status: 'Shipped' } : o));
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-140px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 shrink-0">
        <div className="p-4 md:p-6 border border-[#111111]/10 flex flex-col gap-1">
          <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">Orders Today</span>
          <span className="font-helvetica text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-2">{stats.today}</span>
        </div>
        <div className="p-4 md:p-6 border border-[#111111]/10 flex flex-col gap-1">
          <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">Total Revenue</span>
          <span className="font-helvetica text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-2">\${stats.revenue}</span>
        </div>
        <div className="bg-[#111111] p-4 md:p-6 flex flex-col gap-1">
          <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">To Fulfill</span>
          <div className="flex items-center gap-3 mt-2">
             <span className="font-helvetica text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F5]">{stats.toFulfill}</span>
             {stats.toFulfill > 0 && <span className="w-2 h-2 rounded-none bg-white animate-pulse"></span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 border border-[#111111]/10 overflow-hidden bg-white">
        
        {/* Left Panel: List */}
        <div className={\`w-full md:w-1/3 border-r-0 md:border-r border-[#111111]/10 flex flex-col \${selectedOrderId ? 'hidden md:flex' : 'flex'}\`}>
          <div className="p-4 border-b border-[#111111]/10 flex gap-4 overflow-x-auto shrink-0 hide-scrollbar bg-white">
             {['All', 'Pending', 'Processing', 'Shipped'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)} 
                 className={\`font-helvetica text-[9px] font-bold uppercase tracking-widest pb-1 transition-colors whitespace-nowrap \${filter === f ? 'text-[#111111] border-b border-[#111111]' : 'text-[#a0a0a0] hover:text-[#111111]'}\`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="flex flex-col overflow-y-auto flex-1">
            {filteredOrders.length === 0 ? (
               <div className="p-8 text-center font-helvetica text-[11px] text-[#a0a0a0] font-bold uppercase tracking-widest">No orders found</div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={idx} onClick={() => setSelectedOrder(order.id)} className={\`p-4 border-b border-[#111111]/10 cursor-pointer transition-colors flex flex-col gap-3 \${selectedOrderId === order.id ? 'bg-[#F5F5F5] border-l-2 border-l-[#111111]' : 'hover:bg-[#F5F5F5] bg-white border-l-2 border-l-transparent'}\`}>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="font-helvetica font-bold text-[12px] tracking-tight text-[#111111]">{order.id}</span>
                      <span className="font-helvetica text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0]">{order.customer}</span>
                    </div>
                    <span className="font-helvetica font-bold text-[12px] text-[#111111]">\${order.total}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">{order.date}</span>
                    <span className={\`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border \${order.status === 'Shipped' ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#111111]/20 text-[#111111]'}\`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Panel: Detail */}
        <div className={\`w-full md:w-2/3 bg-white overflow-y-auto flex-col relative \${selectedOrderId ? 'flex' : 'hidden md:flex'}\`}>
          {selectedOrder ? (
            <div className="flex flex-col">
              <div className="sticky top-0 bg-white border-b border-[#111111]/10 p-4 md:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 z-20">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="md:hidden text-[#111111] font-helvetica text-[9px] font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-1 mr-2">
                    {"< BACK"}
                  </button>
                  <h4 className="font-helvetica font-bold text-lg md:text-xl tracking-tight text-[#111111] uppercase">{selectedOrder.id}</h4>
                  <span className={\`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border \${selectedOrder.status === 'Shipped' ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#111111]/20 text-[#111111]'}\`}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="hidden sm:block px-4 py-2 border border-[#111111]/20 hover:border-[#111111] text-[#111111] font-helvetica text-[9px] font-bold uppercase tracking-widest transition-colors">
                    PRINT INVOICE
                  </button>
                  {selectedOrder.status === 'Pending' && (
                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')} className="bg-[#111111] hover:bg-[#333333] text-white font-helvetica text-[9px] font-bold uppercase tracking-widest px-4 py-2 transition-colors">
                      MARK PROCESSING
                    </button>
                  )}
                  {selectedOrder.status === 'Shipped' && (
                    <button className="px-4 py-2 border border-[#111111]/20 hover:border-red-500 hover:text-red-500 text-[#111111] font-helvetica text-[9px] font-bold uppercase tracking-widest transition-colors">
                      REFUND
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-8 lg:p-12 flex flex-col gap-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="font-helvetica text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-[#111111]/10 pb-2">CUSTOMER</span>
                    <div className="flex flex-col gap-1 text-[11px] font-helvetica font-bold uppercase tracking-widest text-[#111111]">
                      <span>{selectedOrder.customer}</span>
                      <a href={\`mailto:\${selectedOrder.email}\`} className="text-[#a0a0a0] hover:text-[#111111] transition-colors">{selectedOrder.email}</a>
                      <a href={\`tel:\${selectedOrder.phone}\`} className="text-[#a0a0a0] hover:text-[#111111] transition-colors">{selectedOrder.phone}</a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-helvetica text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-[#111111]/10 pb-2">SHIPPING ADDRESS</span>
                    <p className="text-[11px] font-helvetica font-bold uppercase tracking-widest text-[#111111] leading-relaxed">
                      {(selectedOrder.address || '').split('\\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-helvetica text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-[#111111]/10 pb-2">ITEMS ({selectedOrder.items.length})</span>
                  <div className="flex flex-col">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start py-4 border-b border-[#111111]/10">
                        <div className="flex gap-4 items-start">
                          <div className="w-16 aspect-[4/5] bg-[#F5F5F5] border border-[#111111]/10 flex justify-center items-center font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase">IMG</div>
                          <div className="flex flex-col gap-1">
                            <span className="font-helvetica font-bold text-[12px] tracking-tight text-[#111111]">"{item.name}"</span>
                            <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">QTY: 0{item.qty}</span>
                          </div>
                        </div>
                        <span className="font-helvetica font-bold text-[12px] text-[#111111]">\${item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4 bg-[#F5F5F5] p-6 border border-[#111111]/10">
                    <div className="flex justify-between items-center">
                      <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SUBTOTAL</span>
                      <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">\${selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SHIPPING</span>
                      <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">FREE</span>
                    </div>
                    <div className="w-full h-[1px] bg-[#111111]/10 my-2"></div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-helvetica font-bold text-[12px] uppercase text-[#111111]">TOTAL</span>
                      <span className="font-helvetica font-bold text-2xl tracking-tight text-[#111111]">\${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-helvetica text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-[#111111]/10 pb-2">FULFILLMENT</span>
                  
                  {selectedOrder.status !== 'Shipped' ? (
                    <div className="flex flex-col gap-4">
                      <p className="font-helvetica font-bold text-[11px] uppercase tracking-widest text-[#a0a0a0]">ENTER TRACKING NUMBER TO FULFILL THIS ORDER</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. TRK123456789" 
                          className="flex-1 bg-white border border-[#111111]/20 px-4 py-2 font-helvetica text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#111111] placeholder:text-[#a0a0a0]"
                          id={\`tracking-\${selectedOrder.id}\`}
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById(\`tracking-\${selectedOrder.id}\`).value;
                            if(val) handleSaveTracking(selectedOrder.id, val);
                          }} 
                          className="bg-[#111111] hover:bg-[#333333] text-white font-helvetica text-[9px] font-bold uppercase tracking-widest px-8 py-3 sm:py-0 transition-colors whitespace-nowrap"
                        >
                          FULFILL ORDER
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-6 border border-[#111111] bg-white">
                      <div className="flex items-center gap-2 text-[#111111]">
                        <span className="font-helvetica font-bold text-[11px] uppercase tracking-widest">ORDER FULFILLED</span>
                      </div>
                      <div className="flex gap-2 mt-2 items-center">
                        <span className="font-helvetica text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">TRACKING NO:</span>
                        <span className="font-helvetica font-bold text-[11px] uppercase tracking-widest text-[#111111]">{selectedOrder.tracking}</span>
                        <button className="ml-2 px-2 py-1 text-[8px] border border-[#111111]/20 hover:border-[#111111] font-helvetica font-bold uppercase tracking-widest">UPDATE</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">
              SELECT AN ORDER TO VIEW DETAILS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`;

let file = fs.readFileSync('src/App.jsx', 'utf8');

// Find the start of AdminStudioOrders
const startIndex = file.indexOf('const AdminStudioOrders = () => {');
if (startIndex !== -1) {
    // Find the start of the next component AdminStudioTimeline
    const endIndex = file.indexOf('const AdminStudioTimeline = () => {', startIndex);
    
    if (endIndex !== -1) {
        file = file.substring(0, startIndex) + newCode + '\n\n' + file.substring(endIndex);
        fs.writeFileSync('src/App.jsx', file);
        console.log('Successfully replaced AdminStudioOrders');
    } else {
        console.error('Could not find end index');
    }
} else {
    console.error('Could not find start index');
}
