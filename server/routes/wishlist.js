const express = require('express');
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/', protect, toggleWishlist);
router.get('/:productId', protect, checkWishlist);

module.exports = router;
