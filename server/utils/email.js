const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmation = async (order, user) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${(item.quantity * item.price).toFixed(2)}</td></tr>`
    )
    .join('');

  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order, <strong>${user.name}</strong>!</p>
    <p>Order ID: <strong>${order.orderId}</strong></p>
    <p>Status: <strong>${order.status}</strong></p>
    <h2>Items</h2>
    <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${itemsList}</tbody>
    </table>
    <h3>Subtotal: $${order.subtotal.toFixed(2)}</h3>
    <h3>Shipping: $${order.shippingPrice.toFixed(2)}</h3>
    <h3>Tax: $${order.taxPrice.toFixed(2)}</h3>
    <h2>Total: $${order.totalPrice.toFixed(2)}</h2>
    <p>Shipping to: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderId}`,
    html,
  });
};

const sendPasswordReset = async (user, resetUrl) => {
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>You requested a password reset. Click the link below to reset your password. This link expires in 10 minutes.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    html,
  });
};

module.exports = { sendEmail, sendOrderConfirmation, sendPasswordReset };
