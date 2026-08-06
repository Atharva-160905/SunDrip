import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create Razorpay Order
// @route   POST /api/payment/create
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body; 

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      res.status(400);
      throw new Error('Valid order amount is required');
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      res.status(500);
      throw new Error('Razorpay credentials are not configured on the server');
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Failed to create Razorpay order');
    }

    // Return the created order along with the public key_id
    res.json({
      ...order,
      key_id,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Missing payment verification parameters');
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error('Payment signature mismatch:', {
        received: razorpay_signature,
        expected: expectedSign,
      });
      res.status(400);
      throw new Error('Invalid payment signature!');
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    next(error);
  }
};
