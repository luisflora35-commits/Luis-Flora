
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, X, MapPin, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PetCard } from '../components/PetCard';
import { PetType } from '../types';

const Browse = () => {
  const { pets } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const activeType = searchParams.get('type');
  const activePriceRange = searchParams.get('price');

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesType = !activeType || pet.type === activeType;
      
      // searchTerm searches across breed
      const matchesSearch = !searchTerm || 
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
      
      // locationTerm specifically filters by location field
      const matchesLocation = !locationTerm || 
        pet.location.toLowerCase().includes(locationTerm.toLowerCase());
      
      let matchesPrice = true;
      if (activePriceRange) {
        const [min, max] = activePriceRange.split('-').map(Number);
        matchesPrice = pet.price >= min && (max ? pet.price <= max : true);
      }

      return matchesType && matchesSearch && matchesLocation && matchesPrice;
    });
  }, [pets, activeType, searchTerm, locationTerm, activePriceRange]);

  const updateType = (type: string | null) => {
    if (type) searchParams.set('type', type);
    else searchParams.delete('type');
    setSearchParams(searchParams);
  };

  const updatePrice = (price: string | null) => {
    if (price) searchParams.set('price', price);
    else searchParams.delete('price');
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchTerm('');
    setLocationTerm('');
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // In a real app, we would reverse geocode the lat/lng here
          // For this simulation, we'll set it to a realistic sample location
          // based on our mock data context (India)
          setLocationTerm("Bangalore"); 
          setIsLocating(false);
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Could not detect location. Please type manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-64 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Location Search Filter */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" />
              Location
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Enter city or state..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
                {locationTerm && (
                  <button 
                    onClick={() => setLocationTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button 
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-orange-500 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all border border-orange-100"
              >
                <Navigation size={14} className={isLocating ? 'animate-pulse' : ''} />
                {isLocating ? 'Locating...' : 'Use Current Location'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Categories
            </h3>
            <div className="space-y-2">
              {[null, ...Object.values(PetType)].map(type => (
                <button
                  key={type || 'all'}
                  onClick={() => updateType(type)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                    (type === activeType || (!type && !activeType)) 
                      ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-100' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type || 'All Pets'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">Price Range</h3>
            <div className="space-y-2">
              {[
                { label: 'Under ₹5,000', value: '0-5000' },
                { label: '₹5,000 - ₹20,000', value: '5000-20000' },
                { label: '₹20,000 - ₹50,000', value: '20000-50000' },
                { label: 'Over ₹50,000', value: '50000-1000000' },
              ].map(range => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="price" 
                    checked={activePriceRange === range.value}
                    onChange={() => updatePrice(range.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 accent-orange-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={clearAllFilters}
            className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest border border-dashed border-gray-200 rounded-lg"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search breed or keywords..."
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-800">{filteredPets.length}</span> results
                {activeType && <span> for <span className="text-orange-600 font-semibold">{activeType}s</span></span>}
              </p>
              {locationTerm && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={12} /> Near "{locationTerm}"
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              Sort by: <span className="font-bold text-gray-800 flex items-center gap-1">Newest <ChevronDown size={16} /></span>
            </div>
          </div>

          {filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No pets found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              <button 
                onClick={clearAllFilters}
                className="mt-6 text-orange-500 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
