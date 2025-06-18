import React from 'react';
import { ShoppingCart, Info } from 'lucide-react';
import { Vehicle } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { addToCart, cartItems } = useCart();
  
  const isInCart = cartItems.some(item => item.id === vehicle.id);
  
  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-3">{vehicle.description}</p>
        </div>
        <span className="absolute top-2 right-2 bg-red-800 text-white px-2 py-1 rounded-md text-xs font-medium">
          {vehicle.category}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-white text-lg">{vehicle.name}</h3>
            <p className="text-gray-400 text-sm">{vehicle.brand}</p>
          </div>
          <span className="font-bold text-white">{formatCurrency(vehicle.price)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center bg-gray-700 p-2 rounded">
            <p className="text-xs text-gray-400">Top Speed</p>
            <p className="text-white font-medium">{vehicle.specs.topSpeed} mph</p>
          </div>
          <div className="text-center bg-gray-700 p-2 rounded">
            <p className="text-xs text-gray-400">0-60 mph</p>
            <p className="text-white font-medium">{vehicle.specs.acceleration}s</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => addToCart(vehicle)}
            disabled={isInCart}
            className={`flex-1 btn ${isInCart ? 'bg-gray-600 cursor-not-allowed' : 'btn-primary'} flex items-center justify-center space-x-1`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
          <button className="btn btn-secondary aspect-square flex items-center justify-center">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;