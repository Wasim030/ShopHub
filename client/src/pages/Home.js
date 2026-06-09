import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import Spinner from '../components/Spinner';
import { productAPI } from '../utils/api';
import { categories } from '../utils/helpers';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        setFeaturedProducts(data.products);
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Your Style</h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">Shop the latest trends with confidence. Free shipping on all orders over $100.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2">
                <span>Shop Now</span><FiArrowRight />
              </Link>
              <Link to="/products?category=Electronics" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: FiShoppingBag, title: 'Quality Products', desc: 'Curated collections' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                  <item.icon size={24} />
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-500 mb-8">Find exactly what you're looking for</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="card p-6 text-center hover:border-primary-300 group">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-gray-500">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-primary-600 font-medium hover:underline inline-flex items-center space-x-1">
              <span>View All</span><FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <Spinner className="py-12" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;
