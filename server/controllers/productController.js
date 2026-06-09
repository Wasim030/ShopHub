const Product = require('../models/Product');
const Review = require('../models/Review');
const AppError = require('../utils/AppError');

exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      subcategory,
      minPrice,
      maxPrice,
      minRating,
      search,
      featured,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) {
      query.ratingsAverage = { $gte: Number(minRating) };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {
      '-createdAt': { createdAt: -1 },
      'price': { price: 1 },
      '-price': { price: -1 },
      '-ratingsAverage': { ratingsAverage: -1 },
      '-sold': { sold: -1 },
      'name': { name: 1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-reviews');

    const categories = await Product.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      categories,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'reviews.user',
      select: 'name avatar',
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate({
      path: 'reviews.user',
      select: 'name avatar',
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname,
      }));
    }

    if (typeof productData.images === 'string') {
      productData.images = JSON.parse(productData.images);
    }

    const product = await Product.create(productData);

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname,
      }));
    }

    if (typeof updateData.images === 'string') {
      updateData.images = JSON.parse(updateData.images);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: req.params.id,
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    const review = await Review.create({
      user: req.user._id,
      product: req.params.id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
    });

    const allReviews = await Review.find({ product: req.params.id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratingsAverage = Math.round((totalRating / allReviews.length) * 10) / 10;
    product.ratingsCount = allReviews.length;

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await product.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort('-createdAt')
      .limit(8)
      .select('-reviews');

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .select('-reviews');

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
