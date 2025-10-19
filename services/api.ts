import { Product, Order, CustomUser, CartItem, Review } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'quantum-core-laptop',
    name: 'Quantum Core Laptop',
    description: 'The future of computing in your hands. Features a 16-core processor, 32GB RAM, and a stunning 4K display.',
    price: 1499.99,
    stock_quantity: 15,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    slug: 'nebula-smartphone',
    name: 'Nebula Smartphone',
    description: 'A stellar camera and an all-day battery life make this the only phone you\'ll ever need.',
    price: 899.00,
    stock_quantity: 30,
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    slug: 'aether-wireless-headphones',
    name: 'Aether Wireless Headphones',
    description: 'Crystal clear audio with industry-leading noise cancellation. Immerse yourself in sound.',
    price: 249.50,
    stock_quantity: 50,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    slug: 'chronos-smartwatch',
    name: 'Chronos Smartwatch',
    description: 'Track your fitness, manage notifications, and stay connected. All from your wrist.',
    price: 199.99,
    stock_quantity: 42,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&auto=format&fit=crop',
  },
    {
    id: '5',
    slug: 'nova-4k-monitor',
    name: 'Nova 4K Monitor',
    description: 'Experience breathtaking clarity and color accuracy with this 27-inch professional monitor.',
    price: 650.00,
    stock_quantity: 22,
    category: 'Monitors',
    image: 'https://images.unsplash.com/photo-1616440347436-02e578f3ce1b?w=600&auto=format&fit=crop',
  },
  {
    id: '6',
    slug: 'ergoflow-mechanical-keyboard',
    name: 'ErgoFlow Mechanical Keyboard',
    description: 'Type faster and more comfortably with responsive tactile switches and customizable backlighting.',
    price: 129.99,
    stock_quantity: 60,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop',
  },
  {
    id: '7',
    slug: 'pulsar-tablet',
    name: 'Pulsar Tablet',
    description: 'Your digital canvas. Perfect for work, play, and creativity on the go with a vibrant 11-inch display.',
    price: 429.99,
    stock_quantity: 35,
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop'
  },
  {
    id: '8',
    slug: 'odyssey-gaming-console',
    name: 'Odyssey Gaming Console',
    description: 'Next-generation gaming with lightning-fast load times and breathtaking 8K visuals.',
    price: 499.00,
    stock_quantity: 20,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop'
  },
  {
    id: '9',
    slug: 'horizon-drone',
    name: 'Horizon Drone',
    description: 'Capture stunning aerial footage with a 4K camera and intelligent flight modes. Easy to fly, hard to put down.',
    price: 799.00,
    stock_quantity: 18,
    category: 'Drones',
    image: 'https://images.unsplash.com/photo-1507582020474-9a334a76191a?w=600&auto=format&fit=crop'
  },
  {
    id: '10',
    slug: 'nexus-vr-headset',
    name: 'Nexus VR Headset',
    description: 'Step into new worlds. A fully immersive virtual reality experience with high-resolution displays and intuitive controls.',
    price: 399.00,
    stock_quantity: 25,
    category: 'VR',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop'
  },
  {
    id: '11',
    slug: 'aura-smart-home-hub',
    name: 'Aura Smart Home Hub',
    description: 'The central nervous system for your smart home. Control lights, thermostats, and more with your voice.',
    price: 99.50,
    stock_quantity: 70,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1518452902641-744d9f922d56?w=600&auto=format&fit=crop'
  },
  {
    id: '12',
    slug: 'cinemax-pico-projector',
    name: 'Cinemax Pico Projector',
    description: 'A movie theater in your pocket. Project a massive 100-inch screen from a device that fits in your hand.',
    price: 299.99,
    stock_quantity: 33,
    category: 'Projectors',
    image: 'https://images.unsplash.com/photo-1628102490589-a2a4b87826a7?w=600&auto=format&fit=crop'
  },
];

let mockOrders: Order[] = [];

// Use localStorage for reviews to make them persistent for the demo
const getStoredReviews = (): Review[] => {
    try {
        const stored = localStorage.getItem('product_reviews');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse reviews from localStorage", e);
        return [];
    }
};

const setStoredReviews = (reviews: Review[]) => {
    localStorage.setItem('product_reviews', JSON.stringify(reviews));
};


const createMockOrder = (cart: CartItem[]): Order => {
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    status: 'PENDING',
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

  fetchOrder: async (orderId: string, token: string): Promise<Order | undefined> => {
    console.log(`API: Fetching order with id: ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!token) throw new Error('Authentication required');
    return mockOrders.find(o => o.id === orderId);
  },
  
  createCheckoutSession: async (cart: CartItem[], token: string): Promise<{ sessionId: string; order: Order }> => {
    console.log('API: Creating checkout session...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!token) throw new Error('Authentication required');
    if (cart.length === 0) throw new Error('Cart is empty');
    
    const order = createMockOrder(cart);

    // Simulate backend webhook processing
    setTimeout(() => {
        const orderIndex = mockOrders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            mockOrders[orderIndex].status = 'PROCESSING';
            console.log(`API: Order ${order.id} status updated to PROCESSING`);
        }
    }, 5000); // 5 seconds delay to simulate webhook
    
    return { sessionId: `cs_test_${Date.now()}`, order };
  },

  fetchReviews: async (productId: string): Promise<Review[]> => {
    console.log(`API: Fetching reviews for product: ${productId}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const allReviews = getStoredReviews();
    return allReviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  submitReview: async (productId: string, reviewData: { rating: number; comment: string }, token: string, user: CustomUser): Promise<Review> => {
    console.log(`API: Submitting review for product ${productId}`);
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!token) throw new Error('Authentication required');

    const newReview: Review = {
      id: `REV-${Date.now()}`,
      productId,
      userId: user.id,
      userName: user.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };
    
    const allReviews = getStoredReviews();
    allReviews.push(newReview);
    setStoredReviews(allReviews);

    return newReview;
  },
};

export default api;