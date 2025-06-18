import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import VehicleCard from '../components/store/VehicleCard';
import { vehicles } from '../data/vehicles';

const StorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(1000000);
  
  const categories = ['All', ...Array.from(new Set(vehicles.map(vehicle => vehicle.category)))];
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || vehicle.category === selectedCategory;
    const matchesPrice = vehicle.price <= priceRange;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  return (
    <div className="pt-24 pb-16 bg-gray-900 min-h-screen animate-fadeIn">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-white mb-8">Vehicle Store</h1>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pl-10 pr-8 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  category !== 'All' && <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="text-white whitespace-nowrap">Max Price: ${priceRange.toLocaleString()}</label>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No vehicles found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange(1000000);
              }}
              className="btn btn-primary mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;