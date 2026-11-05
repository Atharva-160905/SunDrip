import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to deduct product stock inventory
const deductStock = async (products) => {
  if (!Array.isArray(products)) return;
  for (const item of products) {
    const pId = item.productId || item.id || item._id;
    if (!pId) continue;
    try {
      const product = await Product.findById(pId);
      if (product) {
        const qtyToDeduct = Number(item.qty) || 1;
        product.stock = Math.max(0, (Number(product.stock) || 0) - qtyToDeduct);

        // Deduct from size-specific stock if sizes array exists
        if (item.size && Array.isArray(product.sizes) && product.sizes.length > 0) {
          const sizeObj = product.sizes.find(
            (s) => s.size && s.size.toLowerCase() === String(item.size).toLowerCase()
          );
          if (sizeObj) {
            sizeObj.stock = Math.max(0, (Number(sizeObj.stock) || 0) - qtyToDeduct);
          }
        }
        await product.save();
      }
    } catch (err) {
      console.error('Error deducting stock for product', pId, err);
    }
  }
};

// Helper to restore product stock inventory on cancellation
const restoreStock = async (products) => {
  if (!Array.isArray(products)) return;
  for (const item of products) {
    const pId = item.productId || item.id || item._id;
    if (!pId) continue;
    try {
      const product = await Product.findById(pId);
      if (product) {
        const qtyToRestore = Number(item.qty) || 1;
        product.stock = (Number(product.stock) || 0) + qtyToRestore;

        if (item.size && Array.isArray(product.sizes) && product.sizes.length > 0) {
          const sizeObj = product.sizes.find(
            (s) => s.size && s.size.toLowerCase() === String(item.size).toLowerCase()
          );
          if (sizeObj) {
            sizeObj.stock = (Number(sizeObj.stock) || 0) + qtyToRestore;
          }
        }
        await product.save();
      }
    } catch (err) {
      console.error('Error restoring stock for product', pId, err);
    }
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
  try {
    const {
      products,
      address,
      totalPrice,
      paymentStatus,
    } = req.body;

    if (products && products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        products,
        userId: req.user._id,
        address,
        totalPrice,
        paymentStatus: paymentStatus || 'pending',
        isStockDeducted: true,
      });

      const createdOrder = await order.save();

      // Deduct inventory stock for purchased products
      await deductStock(products);

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order && (req.user.role === 'admin' || order.userId._id.toString() === req.user._id.toString())) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found or not authorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = 'completed';
      
      // If stock wasn't already deducted, deduct it now
      if (!order.isStockDeducted) {
        await deductStock(order.products);
        order.isStockDeducted = true;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      const prevStatus = order.orderStatus;
      order.orderStatus = status;

      // If cancelling an order with deducted stock, restore inventory
      if (status === 'cancelled' && prevStatus !== 'cancelled' && order.isStockDeducted) {
        await restoreStock(order.products);
        order.isStockDeducted = false;
      } else if (status !== 'cancelled' && prevStatus === 'cancelled' && !order.isStockDeducted) {
        // If un-cancelling, re-deduct
        await deductStock(order.products);
        order.isStockDeducted = true;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
