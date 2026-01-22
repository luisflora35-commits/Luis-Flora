
export enum PetType {
  DOG = 'Dog',
  CAT = 'Cat',
  BIRD = 'Bird',
  FISH = 'Fish'
}

export enum UserRole {
  SELLER = 'Seller',
  CUSTOMER = 'Customer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  whatsapp?: string;
  location?: string;
}

export interface Pet {
  id: string;
  sellerId: string;
  sellerName: string;
  type: PetType;
  breed: string;
  age: string;
  gender: 'Male' | 'Female' | 'Unknown';
  price: number;
  location: string;
  isVaccinated: boolean;
  hasCertificate: boolean;
  description: string;
  images: string[];
  availability: 'Available' | 'Reserved' | 'Sold';
  createdAt: number;
}

export interface CartItem {
  pet: Pet;
  quantity: number;
}

export interface Inquiry {
  id: string;
  petId: string;
  petName: string;
  customerId: string;
  customerName: string;
  message: string;
  status: 'Pending' | 'Answered';
  createdAt: number;
}

export interface Order {
  id: string;
  customerId: string;
  petIds: string[];
  total: number;
  paymentMethod: 'COD' | 'UPI';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: number;
}
