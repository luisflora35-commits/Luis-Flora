
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShoppingCart, 
  Calendar,
  Heart,
  Share2,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const PetDetails = () => {
  const { id } = useParams();
  const { pets, addToCart, user } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);

  const pet = pets.find(p => p.id === id);

  if (!pet) return <div className="p-20 text-center">Pet not found</div>;

  const handleWhatsApp = () => {
    const text = `Hi, I'm interested in the ${pet.breed} you listed on Pawfect Match. Is it still available?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleInquiry = () => {
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <ChevronRight size={14} />
        <Link to="/browse" className="hover:text-orange-500">Browse</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{pet.breed}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Images Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm relative">
            <img 
              src={pet.images[activeImg]} 
              className="w-full h-full object-cover"
              alt={pet.breed}
            />
            {pet.isVaccinated && (
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-green-100 text-green-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                <ShieldCheck size={16} /> Verified Vaccinated
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {pet.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImg === i ? 'border-orange-500 scale-95' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{pet.breed}</h1>
                <div className="flex items-center gap-4 text-gray-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {pet.age}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {pet.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart size={20} />
                </button>
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-colors shadow-sm">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex justify-between items-center">
              <div>
                <p className="text-sm text-orange-600 font-bold uppercase tracking-wider">Asking Price</p>
                <p className="text-4xl font-black text-orange-900">₹{pet.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-600/60 font-medium">Availability</p>
                <p className="text-lg font-bold text-emerald-600">{pet.availability}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Gender</p>
              <p className="font-bold text-gray-800">{pet.gender}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Health Cert</p>
              <p className="font-bold text-gray-800">{pet.hasCertificate ? 'Included' : 'Not available'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Description</h3>
            <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-3xl border border-gray-100">
              {pet.description}
            </p>
          </div>

          <div className="p-6 bg-stone-100 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
              <img src={pet.images[0]} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="seller" />
              <div>
                <p className="text-xs text-gray-400">Listed by</p>
                <p className="font-bold text-gray-800">{pet.sellerName}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {user?.role === UserRole.CUSTOMER ? (
                <>
                  <button 
                    onClick={() => addToCart(pet)}
                    disabled={pet.availability !== 'Available'}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-100"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleWhatsApp}
                      className="bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg shadow-green-50"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </button>
                    <button 
                      onClick={handleInquiry}
                      className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${inquirySent ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
                    >
                      {inquirySent ? 'Inquiry Sent!' : 'Quick Inquiry'}
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold text-center hover:bg-gray-900 transition-all"
                >
                  Sign in as Customer to Purchase
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
