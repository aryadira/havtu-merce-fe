import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description:
      "A sleek, adjustable desk lamp with warm LED lighting. Perfect for late-night coding sessions or focused work. Features touch-dimming and USB charging port.",
    price: 89.0,
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    category: "Lighting",
    stock: 15,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    description:
      "Premium mechanical keyboard with cherry MX switches. Hot-swappable keys, RGB backlighting, and aircraft-grade aluminum frame.",
    price: 159.0,
    image_url:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    category: "Electronics",
    stock: 23,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Concrete Planter",
    description:
      "Handcrafted concrete planter with geometric design. Includes drainage hole and cork base. Perfect for succulents.",
    price: 34.0,
    image_url:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    category: "Home",
    stock: 42,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Wireless Charger Pad",
    description:
      "Fast wireless charging pad with minimalist design. Compatible with all Qi-enabled devices. Sleek matte black finish.",
    price: 45.0,
    image_url:
      "https://images.unsplash.com/photo-1622675273330-26bcdd175819?w=600&q=80",
    category: "Electronics",
    stock: 67,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Canvas Tote Bag",
    description:
      'Heavy-duty canvas tote with reinforced handles. Water-resistant coating. Fits 15" laptop with room to spare.',
    price: 52.0,
    image_url:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
    category: "Accessories",
    stock: 31,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug",
    description:
      "Handmade ceramic mug with matte glaze. 12oz capacity, microwave and dishwasher safe. Each piece is unique.",
    price: 28.0,
    image_url:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    category: "Home",
    stock: 89,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Desk Organizer Set",
    description:
      "Modular desk organizer in powder-coated steel. Includes pen holder, card tray, and phone stand. Stackable design.",
    price: 67.0,
    image_url:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
    category: "Office",
    stock: 19,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    description:
      "Portable speaker with 360° sound. 20-hour battery life, IPX7 waterproof rating. Pairs seamlessly with any device.",
    price: 129.0,
    image_url:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    category: "Electronics",
    stock: 45,
    is_active: true,
    user_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const categories = [...new Set(products.map((p) => p.category))];
