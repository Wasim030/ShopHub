import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { productAPI, wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getDiscountPercent } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getOne(id);
        setProduct(data.product);
        setSelectedImage(0);

        const relatedRes = await productAPI.getRelated(id);
        setRelatedProducts(relatedRes.data.products);

        if (user) {
          const wishRes = await wishlistAPI.check(id);
          setInWishlist(wishRes.data.inWishlist);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const { data } = await wishlistAPI.toggle({ productId: id });
      setInWishlist(data.inWishlist);
      toast.success(data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await productAPI.addReview(id, reviewForm);
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await productAPI.getOne(id);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!product) return <div className="text-center py-20"><p className="text-gray-500">Product not found</p></div>;

  const discount = getDiscountPercent(product.price, product.comparePrice);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? 'border-primary-600' : 'border-gray-200'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-primary-600 font-medium mb-1">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <StarRating rating={product.ratingsAverage} />
            <span className="text-sm text-gray-500">({product.ratingsCount} reviews)</span>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
            {product.comparePrice > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center space-x-2 mb-4">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><FiMinus /></button>
                <span className="px-4 font-medium min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50"><FiPlus /></button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3">
                <FiShoppingCart /><span>Add to Cart</span>
              </button>
              <button onClick={handleToggleWishlist} className={`p-3 rounded-lg border ${inWishlist ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}>
                <FiHeart size={20} className={inWishlist ? 'fill-red-500' : ''} />
              </button>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center space-x-2"><FiTruck /> Free shipping on orders over $100</p>
            <p className="flex items-center space-x-2"><FiShield /> Secure checkout with Stripe</p>
            <p className="flex items-center space-x-2"><FiRefreshCw /> 30-day easy returns</p>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews ({product.reviews?.length || 0})</h2>
        {user && (
          <form onSubmit={handleReviewSubmit} className="card p-6 mb-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} interactive />
            </div>
            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your thoughts..." className="input-field mb-4" rows={4} required />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}
        <div className="space-y-4">
          {product.reviews?.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {product.reviews?.map((review, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                    {review.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium">{review.name}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
              </div>
              <StarRating rating={review.rating} size={14} />
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
