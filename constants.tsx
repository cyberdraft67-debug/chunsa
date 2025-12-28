
import { Product } from './types';

export const WHATSAPP_NUMBER = '923332175625'; // Updated to user-provided number

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chaunsa Standard Box',
    description: 'Freshly ripened to a beautiful golden yellow. Hand-picked and nested in newspaper lining for that signature honey-sweet aroma.',
    price: 1500,
    unit: '4.5kg - 5kg Box',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop',
    category: 'Standard',
    stock: 24,
    reviews: [
      { id: 'r1', userName: 'Amina K.', rating: 5, comment: 'Beautifully yellow and so sweet! The perfect 5kg box.', date: '2024-05-12' }
    ]
  },
  {
    id: '2',
    name: 'Chaunsa Heritage Pattie',
    description: 'The traditional 10kg Peti. Fully matured, fiber-less, and glowing yellow—the true taste of the Punjab heritage.',
    price: 2500,
    unit: '10kg Pattie',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=1000&auto=format&fit=crop',
    category: 'Standard',
    stock: 7,
    reviews: [
      { id: 'r3', userName: 'Sajid M.', rating: 5, comment: 'Authentic 10kg Peti. Arrived perfectly ripe and yellow.', date: '2024-05-14' }
    ]
  },
  {
    id: '3',
    name: 'Bulk Mega Harvest',
    description: 'Our largest 13kg box. Ideal for families who want a steady supply of ripe, sun-kissed yellow mangoes throughout the week.',
    price: 3000,
    unit: '13kg Mega Box',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1000&auto=format&fit=crop',
    category: 'Bulk',
    stock: 15,
    reviews: []
  },
  {
    id: '4',
    name: 'XL Premium Select Pattie',
    description: 'The absolute finest. Extra-large, hand-selected golden specimens. Only the biggest and sweetest yellow mangoes make it into this 10kg Peti.',
    price: 4000,
    unit: '10kg XL Select Pattie',
    image: 'https://pictures.grocerapps.com/original/grocerapp-mango-white-chaunsa-5kg-box-64958fcfea299.png',
    category: 'Premium',
    stock: 2,
    reviews: [
      { id: 'r4', userName: 'Elena R.', rating: 5, comment: 'Incredible size and deep yellow color. Worth every rupee.', date: '2024-05-15' }
    ]
  }
];
