
import React from 'react';
import { Pet, PetType, User, UserRole } from './types';
import { 
  Dog, 
  Cat, 
  Bird, 
  Fish, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Zap 
} from 'lucide-react';

export const MOCK_USER_CUSTOMER: User = {
  id: 'c1',
  name: 'Arjun Sharma',
  email: 'arjun@example.com',
  role: UserRole.CUSTOMER,
  avatar: 'https://picsum.photos/seed/arjun/200'
};

export const MOCK_USER_SELLER: User = {
  id: 's1',
  name: 'Pet Paradise India',
  email: 'seller@petparadise.in',
  role: UserRole.SELLER,
  whatsapp: '+919876543210',
  location: 'Bangalore, Karnataka',
  avatar: 'https://picsum.photos/seed/pethaven/200'
};

export const INITIAL_PETS: Pet[] = [
  {
    id: 'p1',
    sellerId: 's1',
    sellerName: 'Pet Paradise India',
    type: PetType.DOG,
    breed: 'Golden Retriever',
    age: '3 months',
    gender: 'Male',
    price: 25000,
    location: 'Bangalore, Karnataka',
    isVaccinated: true,
    hasCertificate: true,
    description: 'A very friendly and playful Golden Retriever puppy. Loves kids and other dogs. Perfect for Indian homes.',
    images: ['https://picsum.photos/seed/dog1/800/600', 'https://picsum.photos/seed/dog2/800/600'],
    availability: 'Available',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'p2',
    sellerId: 's1',
    sellerName: 'Pet Paradise India',
    type: PetType.CAT,
    breed: 'Persian',
    age: '5 months',
    gender: 'Female',
    price: 15000,
    location: 'Mumbai, Maharashtra',
    isVaccinated: true,
    hasCertificate: true,
    description: 'Beautiful white Persian kitten with striking blue eyes. Very calm and affectionate.',
    images: ['https://picsum.photos/seed/cat1/800/600'],
    availability: 'Available',
    createdAt: Date.now() - 172800000
  },
  {
    id: 'p3',
    sellerId: 's1',
    sellerName: 'Pet Paradise India',
    type: PetType.BIRD,
    breed: 'African Grey Parrot',
    age: '1 year',
    gender: 'Unknown',
    price: 45000,
    location: 'New Delhi, Delhi',
    isVaccinated: false,
    hasCertificate: true,
    description: 'Highly intelligent African Grey. Starting to mimic basic words. Healthy and energetic.',
    images: ['https://picsum.photos/seed/bird1/800/600'],
    availability: 'Available',
    createdAt: Date.now() - 43200000
  },
  {
    id: 'p4',
    sellerId: 's2',
    sellerName: 'Aquatic World Delhi',
    type: PetType.FISH,
    breed: 'Fancy Guppies',
    age: '2 months',
    gender: 'Unknown',
    price: 500,
    location: 'Delhi, India',
    isVaccinated: false,
    hasCertificate: false,
    description: 'Vibrant and healthy fancy guppies. Perfect for home aquariums.',
    images: ['https://picsum.photos/seed/fish1/800/600'],
    availability: 'Available',
    createdAt: Date.now() - 604800000
  }
];

export const CATEGORIES = [
  { id: PetType.DOG, name: 'Dogs', icon: <Dog className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
  { id: Cat, name: 'Cats', icon: <Cat className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  { id: Bird, name: 'Birds', icon: <Bird className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
  { id: Fish, name: 'Fish', icon: <Fish className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-600' },
];

export const FEATURES = [
  { title: 'Safe Delivery', desc: 'Expert handling for your pets.', icon: <Truck className="w-6 h-6" /> },
  { title: 'Verified Sellers', desc: 'All sellers are pre-screened.', icon: <ShieldCheck className="w-6 h-6" /> },
  { title: 'Health First', desc: 'Vaccination & health certificates.', icon: <Heart className="w-6 h-6" /> },
  { title: 'Quick Support', desc: 'WhatsApp chat for fast info.', icon: <Zap className="w-6 h-6" /> },
];
