require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      address: { street: '123 Admin St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      address: { street: '456 User Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
    });

    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        price: 79.99,
        comparePrice: 129.99,
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5d560c06d30e?w=500', alt: 'Wireless Headphones' }],
        category: 'Electronics',
        subcategory: 'Audio',
        stock: 50,
        featured: true,
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Soft, breathable organic cotton t-shirt. Available in multiple colors. Perfect for casual wear.',
        price: 24.99,
        comparePrice: 34.99,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Organic Cotton T-Shirt' }],
        category: 'Clothing',
        subcategory: 'Tops',
        stock: 200,
        featured: true,
      },
      {
        name: 'Smart Watch Pro',
        description: 'Feature-rich smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
        price: 199.99,
        comparePrice: 299.99,
        images: [{ url: 'https://images.unsplash.com/photo-1546868871-af0de0ae72ca?w=500', alt: 'Smart Watch Pro' }],
        category: 'Electronics',
        subcategory: 'Wearables',
        stock: 30,
        featured: true,
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-wall insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 32oz capacity.',
        price: 29.99,
        comparePrice: 39.99,
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', alt: 'Water Bottle' }],
        category: 'Home & Garden',
        subcategory: 'Kitchen',
        stock: 150,
        featured: true,
      },
      {
        name: 'Running Shoes Ultra',
        description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for daily runs.',
        price: 119.99,
        comparePrice: 159.99,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Running Shoes' }],
        category: 'Sports',
        subcategory: 'Footwear',
        stock: 75,
        featured: true,
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'A deep dive into the best features of JavaScript by Douglas Crockford. Essential reading for any web developer.',
        price: 29.99,
        comparePrice: 0,
        images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', alt: 'JavaScript Book' }],
        category: 'Books',
        subcategory: 'Programming',
        stock: 100,
      },
      {
        name: 'Moisturizing Face Cream',
        description: 'Daily moisturizer with SPF 30. Lightweight formula with hyaluronic acid for all-day hydration.',
        price: 34.99,
        comparePrice: 44.99,
        images: [{ url: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=500', alt: 'Face Cream' }],
        category: 'Beauty',
        subcategory: 'Skincare',
        stock: 80,
      },
      {
        name: 'Building Blocks Set 500pc',
        description: '500-piece building blocks set compatible with major brands. Includes base plates and storage box.',
        price: 39.99,
        comparePrice: 49.99,
        images: [{ url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500', alt: 'Building Blocks' }],
        category: 'Toys',
        subcategory: 'Building Toys',
        stock: 60,
      },
    ];

    const createdProducts = [];
    for (const p of products) {
      const product = await Product.create(p);
      createdProducts.push(product);
    }
    console.log(`Seeded ${createdProducts.length} products`);
    console.log(`Admin: admin@example.com / admin123`);
    console.log(`User: john@example.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
