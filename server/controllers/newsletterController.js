const Newsletter = require('../models/Newsletter');
const AppError = require('../utils/AppError');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Please provide an email', 400));
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Subscription reactivated' });
      }
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email }, { isActive: false });
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
};
