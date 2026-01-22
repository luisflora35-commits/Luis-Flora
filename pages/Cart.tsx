
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, placeOrder } = useApp();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.pet.price, 0);
  const deliveryFee = 2000;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await placeOrder(paymentMethod);
    setIsProcessing(false);
    setStep('success');
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-500">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-4 max-w-sm mx-auto">Looks like you haven't found your perfect match yet. Start browsing now!</p>
        <Link 
          to="/browse" 
          className="mt-8 inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
        >
          Browse Pets <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500 ring-8 ring-emerald-50/50">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h2>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">
          Thank you for choosing Pawfect Match. We've sent your order details to our central office at <span className="font-bold text-gray-800">pawmart745@gmail.com</span>. 
          Our <span className="text-orange-600 font-bold">Nalgonda team</span> will verify the request and the seller will contact you shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link 
            to="/dashboard" 
            className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all"
          >
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:border-orange-200 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'cart' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {step === 'cart' ? '1' : <CheckCircle2 size={20} />}
          </div>
          <span className="font-bold text-gray-800">Review Cart</span>
        </div>
        <div className="h-[2px] w-12 bg-gray-100"></div>
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'checkout' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
            2
          </div>
          <span className={`font-bold ${step === 'checkout' ? 'text-gray-800' : 'text-gray-400'}`}>Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {step === 'cart' ? (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.pet.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-orange-200 transition-all">
                  <img src={item.pet.images[0]} className="w-24 h-24 rounded-2xl object-cover" alt="pet" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg">{item.pet.breed}</h3>
                    <p className="text-sm text-gray-400">{item.pet.type} • {item.pet.age}</p>
                    <p className="text-orange-600 font-bold mt-1">₹{item.pet.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.pet.id)}
                    className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-orange-500" /> Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${paymentMethod === 'COD' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Truck size={20} />
                    </div>
                    <p className="font-bold text-gray-800">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-1">Pay when your pet arrives home safely.</p>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${paymentMethod === 'UPI' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Smartphone size={20} />
                    </div>
                    <p className="font-bold text-gray-800">UPI Payment</p>
                    <p className="text-xs text-gray-400 mt-1">Instant payment via any UPI app like GPay or PhonePe.</p>
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Delivery Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Contact Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none" defaultValue="Arjun Sharma" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Address</label>
                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none" rows={3} placeholder="House no, Street, Landmark, Pincode..." />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-orange-50/50 sticky top-24 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Safe Delivery Fee</span>
                <span className="font-bold text-gray-800">₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-black text-orange-500">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-4">
              {step === 'cart' ? (
                <button 
                  onClick={() => setStep('checkout')}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Transmitting to Office...' : 'Confirm & Place Order'}
                </button>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 font-medium">
                  <ShieldCheck size={14} className="text-emerald-500" /> Secure checkout with end-to-end encryption
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-[10px] text-gray-500 text-center font-bold uppercase mb-1">Central Office Info</p>
                   <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600">
                     <MapPin size={12} className="text-orange-500" /> Nalgonda, Telangana
                   </div>
                   <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600 mt-1">
                     <Mail size={12} className="text-orange-500" /> pawmart745@gmail.com
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
