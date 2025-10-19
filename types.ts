
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image: string;
}

export interface CustomUser {
  id: string;
  email: string;
  name: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  total_price: number;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

export interface CartItem extends Product {
  quantity: number;
}
