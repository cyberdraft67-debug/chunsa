
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: 'Standard' | 'Premium' | 'Bulk';
  reviews: Review[];
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
