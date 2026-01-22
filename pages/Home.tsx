
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { CATEGORIES, FEATURES } from '../constants';
import { useApp } from '../context/AppContext';
import { PetCard } from '../components/PetCard';

const Home = () => {
  const { pets } = useApp();
  const featuredPets = pets.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/hero-pets/1920/1080" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                <Sparkles size={16} />
                <span>Over 5,000+ happy families joined</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
                <MapPin size={16} />
                <span>HQ: Nalgonda, Telangana</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1]">
              Find your <span className="text-orange-500">Pawfect</span> lifelong friend today.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              The world's most trusted marketplace for healthy, vaccinated, and happy pets. Connecting verified sellers with loving homes from our headquarters in <span className="font-bold text-gray-800 underline decoration-orange-500">Nalgonda</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/browse" 
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                Browse Pets <ArrowRight size={20} />
              </Link>
              <Link 
                to="/auth" 
                className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl text-lg font-bold hover:border-orange-200 transition-all flex items-center justify-center"
              >
                Sell a Pet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
            <p className="text-gray-500">Find the right friend for your lifestyle</p>
          </div>
          <Link to="/browse" className="text-orange-500 font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/browse?type=${cat.id}`}
              className="group p-8 bg-white border border-gray-100 rounded-3xl text-center hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">100+ available</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-gray-800">{feature.title}</h4>
                <p className="text-sm text-gray-500 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Recently Added</h2>
            <p className="text-gray-500">The newest friends looking for a home</p>
          </div>
          <Link to="/browse" className="text-orange-500 font-semibold hover:underline">See Newest Arrivals</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-500 rounded-[2.5rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative space-y-4 max-w-lg">
            <h2 className="text-4xl font-bold">Ready to meet your new family member?</h2>
            <p className="text-orange-100">Every pet on Pawfect Match undergoes a thorough health check verified by our central team in Nalgonda.</p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors">
              Get Started
            </button>
          </div>
          <img 
            src="https://picsum.photos/seed/pets-banner/400/300" 
            className="rounded-3xl shadow-2xl relative rotate-3"
            alt="Pet Banner"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
