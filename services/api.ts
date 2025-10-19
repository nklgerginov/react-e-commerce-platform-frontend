
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
