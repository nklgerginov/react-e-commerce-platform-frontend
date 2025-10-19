
import { Product, Order, CustomUser, CartItem } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'quantum-core-laptop',
    name: 'Quantum Core Laptop',
    description: 'The future of computing in your hands. Features a 16-core processor, 32GB RAM, and a stunning 4K display.',
    price: 1499.99,
    stock_quantity: 15,
    category: 'Laptops',
    image: 'https://picsum.photos/seed/laptop/600/400',
  },
  {
    id: '2',
    slug: 'nebula-smartphone',
    name: 'Nebula Smartphone',
    description: 'A stellar camera and an all-day battery life make this the only phone you\'ll ever need.',
    price: 899.00,
    stock_quantity: 30,
    category: 'Smartphones',
    image: 'https://picsum.photos/seed/phone/600/400',
  },
  {
    id: '3',
    slug: 'aether-wireless-headphones',
    name: 'Aether Wireless Headphones',
    description: 'Crystal clear audio with industry-leading noise cancellation. Immerse yourself in sound.',
    price: 249.50,
    stock_quantity: 50,
    category: 'Audio',
    image: 'https://picsum.photos/seed/headphones/600/400',
  },
  {
    id: '4',
    slug: 'chronos-smartwatch',
    name: 'Chronos Smartwatch',
    description: 'Track your fitness, manage notifications, and stay connected. All from your wrist.',
    price: 199.99,
    stock_quantity: 42,
    category: 'Wearables',
    image: 'https://picsum.photos/seed/watch/600/400',
  },
    {
    id: '5',
    slug: 'nova-4k-monitor',
    name: 'Nova 4K Monitor',
    description: 'Experience breathtaking clarity and color accuracy with this 27-inch professional monitor.',
    price: 650.00,
    stock_quantity: 22,
    category: 'Monitors',
    image: 'https://picsum.photos/seed/monitor/600/400',
  },
  {
    id: '6',
    slug: 'ergoflow-mechanical-keyboard',
    name: 'ErgoFlow Mechanical Keyboard',
    description: 'Type faster and more comfortably with responsive tactile switches and customizable backlighting.',
    price: 129.99,
    stock_quantity: 60,
    category: 'Peripherals',
    image: 'https://picsum.photos/seed/keyboard/600/400',
  },
];

const mockOrders: Order[] = [];

const createMockOrder = (cart: CartItem[]): Order => {
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    status: 'PROCESSING',
    total_price: cart.reduce((total, item) => total + item.price * item.quantity, 0),
    shipping_address: '123 Quantum Way, Cybertown, 98765',
    created_at: new Date().toISOString(),
    items: cart.map(item => ({
      id: `ITEM-${item.id}-${Date.now()}`,
      product: item,
      quantity: item.quantity,
      price_at_purchase: item.price,
    })),
  };
  mockOrders.unshift(newOrder); // Add to the beginning
  return newOrder;
};

const api = {
  fetchProducts: async (): Promise<Product[]> => {
    console.log('API: Fetching products...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  fetchProduct: async (slug: string): Promise<Product | undefined> => {
    console.log(`API: Fetching product with slug: ${slug}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(p => p.slug === slug);
  },

  login: async (email: string, pass: string): Promise<{ user: CustomUser; token: string }> => {
    console.log(`API: Logging in with ${email}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    if (email === 'test@example.com' && pass === 'password') {
      const user = { id: 'user-1', email: 'test@example.com', name: 'Test User' };
      const token = 'mock-jwt-token-string';
      return { user, token };
    }
    throw new Error('Invalid credentials');
  },

  fetchOrders: async (token: string): Promise<Order[]> => {
    console.log('API: Fetching orders...');
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!token) throw new Error('Authentication required');
    return mockOrders;
  },
  
  createCheckoutSession: async (cart: CartItem[], token: string): Promise<{ sessionId: string; order: Order }> => {
    console.log('API: Creating checkout session...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!token) throw new Error('Authentication required');
    if (cart.length === 0) throw new Error('Cart is empty');
    
    const order = createMockOrder(cart);
    return { sessionId: `cs_test_${Date.now()}`, order };
  }
};

export default api;
