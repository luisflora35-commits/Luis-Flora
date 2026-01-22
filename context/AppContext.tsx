
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Pet, CartItem, Order, UserRole } from '../types';
import { INITIAL_PETS, MOCK_USER_CUSTOMER, MOCK_USER_SELLER } from '../constants';

interface AppContextType {
  user: User | null;
  pets: Pet[];
  cart: CartItem[];
  orders: Order[];
  login: (role: UserRole) => void;
  logout: () => void;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  deletePet: (id: string) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: string) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: 'COD' | 'UPI') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pawfect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('pawfect_pets');
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pawfect_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pawfect_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pawfect_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pawfect_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('pawfect_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pawfect_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (role: UserRole) => {
    const mockUser = role === UserRole.CUSTOMER ? MOCK_USER_CUSTOMER : MOCK_USER_SELLER;
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addPet = (petData: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...petData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setPets(prev => [newPet, ...prev]);
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
  };

  const addToCart = (pet: Pet) => {
    setCart(prev => {
      const existing = prev.find(item => item.pet.id === pet.id);
      if (existing) return prev;
      return [...prev, { pet, quantity: 1 }];
    });
  };

  const removeFromCart = (petId: string) => {
    setCart(prev => prev.filter(item => item.pet.id !== petId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (paymentMethod: 'COD' | 'UPI') => {
    if (!user || cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      customerId: user.id,
      petIds: cart.map(item => item.pet.id),
      total: cart.reduce((sum, item) => sum + item.pet.price, 0),
      paymentMethod,
      status: 'Pending',
      createdAt: Date.now()
    };

    // Simulated Backend Email Dispatch to pawmart745@gmail.com
    console.log(`[DISPATCH] Sending order details for ${newOrder.id} to pawmart745@gmail.com...`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock latency
    console.log(`[DISPATCH] Successfully notified Nalgonda Office at pawmart745@gmail.com`);

    setOrders(prev => [newOrder, ...prev]);
    
    // Mark pets as sold/reserved
    cart.forEach(item => updatePet(item.pet.id, { availability: 'Sold' }));
    clearCart();
  };

  return (
    <AppContext.Provider value={{
      user, pets, cart, orders, login, logout, 
      addPet, updatePet, deletePet, addToCart, removeFromCart, clearCart, placeOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
