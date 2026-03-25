import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search query via keyword
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Filter by category
    const category = req.query.category ? { category: req.query.category } : {};

    // By default, fetch only active products for users, admin might want all
    const isActive = req.query.all === 'true' && req.user && req.user.role === 'admin' ? {} : { isActive: true };

    const count = await Product.countDocuments({ ...keyword, ...category, ...isActive });
    const products = await Product.find({ ...keyword, ...category, ...isActive })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Return 404 if product is inactive unless admin
      if (!product.isActive && (!req.user || req.user.role !== 'admin')) {
        res.status(404);
        throw new Error('Product not found or inactive');
      }
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, images, category, stock, colors, sizes, isTrending, isActive } = req.body;
    
    // If body has name, use actual data, else create sample
    const product = new Product({
      name: name,
      price: price,
      description: description,
      images: images && images.length > 0 ? images : [],
      category: category,
      stock: stock,
      colors: colors || ['Black'],
      sizes: sizes || [],
      isTrending: isTrending !== undefined ? isTrending : false,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock,
      sizes,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.sizes = sizes || product.sizes;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
