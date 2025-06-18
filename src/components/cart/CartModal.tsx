import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartModal: React.FC = () => {
  const { cartItems, closeCart, removeFromCart, clearCart } = useCart();
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  const handleCheckout = () => {
    alert('Purchase successful! This would redirect to a payment page in a real application.');
    clearCart();
    closeCart();
  };
  
  return (
    <>
      <div className="modal-backdrop" onClick={closeCart}></div>
      <div className="modal-content p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Your Cart</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-gray-400">{item.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white">{formatCurrency(item.price)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(totalPrice)}</span>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={handleCheckout}
                    className="btn btn-primary w-full"
                  >
                    Checkout
                  </button>
                  <button 
                    onClick={clearCart}
                    className="btn btn-secondary w-full"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;