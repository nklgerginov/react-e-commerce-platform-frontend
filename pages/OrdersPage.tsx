
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AppContext';
import api from '../services/api';
import { Order } from '../types';
import Spinner from '../components/Spinner';

const OrderItemCard: React.FC<{ order: Order }> = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
                    <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                    <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">€{order.total_price.toFixed(2)}</p>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-2 text-sm">
                            <div className="flex items-center">
                                <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                                <span>{item.product.name}</span>
                            </div>
                            <span>{item.quantity} x €{item.price_at_purchase.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
        setLoading(false);
        return;
    }
    
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await api.fetchOrders(token);
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token, isAuthenticated]);

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <p className="text-center text-yellow-500">Please log in to view your orders.</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-8 rounded-lg">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderItemCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
