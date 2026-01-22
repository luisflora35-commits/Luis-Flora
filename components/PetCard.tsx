
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <Link 
      to={`/pet/${pet.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={pet.images[0]} 
          alt={pet.breed} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {pet.isVaccinated && (
            <div className="bg-green-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg" title="Vaccinated">
              <ShieldCheck size={14} />
            </div>
          )}
          <div className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {pet.type}
          </div>
        </div>
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Handle wishlist logic
          }}
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 line-clamp-1">{pet.breed}</h3>
            <p className="text-xs text-gray-500">{pet.age} • {pet.gender}</p>
          </div>
          <span className="text-orange-600 font-bold text-lg">₹{pet.price.toLocaleString('en-IN')}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center text-gray-400 text-[10px] gap-1">
            <MapPin size={12} />
            <span className="line-clamp-1">{pet.location}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            pet.availability === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {pet.availability}
          </span>
        </div>
      </div>
    </Link>
  );
};
