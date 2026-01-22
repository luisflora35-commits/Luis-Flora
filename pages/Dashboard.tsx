
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Package,
  Users,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Upload,
  ShoppingCart,
  X as CloseIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, PetType, Pet } from '../types';
import { generatePetDescription } from '../services/geminiService';

const Dashboard = () => {
  const { user, pets, orders, deletePet, addPet } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newPet, setNewPet] = useState<Partial<Pet>>({
    type: PetType.DOG,
    breed: '',
    age: '',
    gender: 'Male',
    price: 0,
    location: '',
    isVaccinated: true,
    hasCertificate: true,
    description: '',
    images: [],
    availability: 'Available'
  });

  if (!user) return <div className="p-20 text-center">Please login to view dashboard</div>;

  const sellerPets = pets.filter(p => p.sellerId === user.id);
  const customerOrders = orders.filter(o => o.customerId === user.id);

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      addPet({
        ...newPet as Pet,
        sellerId: user.id,
        sellerName: user.name,
        images: newPet.images?.length ? newPet.images : ['https://picsum.photos/seed/placeholder/800/600']
      });
      setShowAddModal(false);
      setNewPet({
        type: PetType.DOG,
        breed: '',
        age: '',
        gender: 'Male',
        price: 0,
        location: '',
        isVaccinated: true,
        hasCertificate: true,
        description: '',
        images: [],
        availability: 'Available'
      });
    }
  };

  const handleAIDescription = async () => {
    if (!newPet.breed || !newPet.age) {
      alert("Please enter breed and age first!");
      return;
    }
    setIsGenerating(true);
    const desc = await generatePetDescription({
      type: newPet.type || 'Dog',
      breed: newPet.breed,
      age: newPet.age
    });
    if (desc) setNewPet(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPet(prev => ({
            ...prev,
            images: [...(prev.images || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewPet(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-72 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto border-4 border-orange-50 mb-4" alt="user" />
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-400 font-medium">{user.role}</p>
          </div>

          <nav className="bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={20} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('items')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'items' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {user.role === UserRole.SELLER ? <Package size={20} /> : <ShoppingCart size={20} />} 
              {user.role === UserRole.SELLER ? 'My Listings' : 'My Orders'}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Settings size={20} /> Settings
            </button>
          </nav>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-grow space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-500 p-8 rounded-[2rem] text-white space-y-4 shadow-xl shadow-orange-100">
                  <div className="bg-white/20 p-3 rounded-xl w-fit"><TrendingUp /></div>
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Account Status</p>
                    <h3 className="text-2xl font-bold">Verified {user.role}</h3>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="bg-blue-50 text-blue-500 p-3 rounded-xl w-fit"><Package /></div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      {user.role === UserRole.SELLER ? 'Active Listings' : 'Recent Orders'}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {user.role === UserRole.SELLER ? sellerPets.length : customerOrders.length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="bg-emerald-50 text-emerald-500 p-3 rounded-xl w-fit"><Bell /></div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">New Messages</p>
                    <h3 className="text-2xl font-bold text-gray-800">0</h3>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                  <button className="text-orange-500 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="p-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        {user.role === UserRole.SELLER ? <Package size={20} /> : <ShoppingCart size={20} />}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                          {user.role === UserRole.SELLER ? 'New listing published' : 'Order confirmation'}
                        </h4>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {user.role === UserRole.SELLER ? 'Manage Listings' : 'My Orders'}
                </h3>
                {user.role === UserRole.SELLER && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
                  >
                    <Plus size={20} /> Add New Pet
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {user.role === UserRole.SELLER ? (
                  sellerPets.map(pet => (
                    <div key={pet.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                      <img src={pet.images[0]} className="w-24 h-24 rounded-2xl object-cover" alt="pet" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800 text-lg">{pet.breed}</h4>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                          <span>{pet.type}</span>
                          <span>•</span>
                          <span>{pet.availability}</span>
                          <span>•</span>
                          <span className="text-orange-600 font-bold">₹{pet.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deletePet(pet.id)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  customerOrders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Package />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800">{order.id}</h4>
                        <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={12} /> {order.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {(user.role === UserRole.SELLER ? sellerPets : customerOrders).length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No items found yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="p-8 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Add New Pet</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddPet} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Pet Type</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value as PetType })}
                  >
                    {Object.values(PetType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Breed</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Age</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 3 months"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                    value={newPet.price}
                    onChange={(e) => setNewPet({ ...newPet, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <button 
                    type="button"
                    onClick={handleAIDescription}
                    disabled={isGenerating}
                    className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:text-orange-600 disabled:opacity-50"
                  >
                    <Wand2 size={14} /> {isGenerating ? 'Generating...' : 'AI Enhance Description'}
                  </button>
                </div>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="vacc" 
                    checked={newPet.isVaccinated}
                    onChange={(e) => setNewPet({ ...newPet, isVaccinated: e.target.checked })}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <label htmlFor="vacc" className="text-sm font-bold text-gray-700">Vaccinated</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="cert" 
                    checked={newPet.hasCertificate}
                    onChange={(e) => setNewPet({ ...newPet, hasCertificate: e.target.checked })}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <label htmlFor="cert" className="text-sm font-bold text-gray-700">Health Certificate</label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">Photos</label>
                
                {/* Preview Gallery */}
                <div className="grid grid-cols-4 gap-4">
                  {newPet.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                      <img src={img} className="w-full h-full object-cover" alt="preview" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-orange-200 hover:text-orange-500 transition-all bg-gray-50/50"
                  >
                    <Plus size={20} />
                    <span className="text-[10px] font-bold">Add Photo</span>
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
                >
                  Post Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
