import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { productAPI } from '../utils/api';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );
        const { data } = await productAPI.getAll(cleanFilters);
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm">{total} products found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-outline text-sm py-2 px-4 flex items-center space-x-2">
          <FiFilter /><span>Filters</span>
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : 'hidden'} lg:block lg:w-64 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0`}>
          <ProductFilter filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
        </aside>

        <main className="flex-1">
          {loading ? (
            <Spinner className="py-20" />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
