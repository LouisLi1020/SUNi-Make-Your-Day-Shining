import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Product, ProductCategory, ProductStatus, ProductType, IProduct } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

// Create product interface
interface CreateProductRequest extends Request {
  body: {
    name: string;
    description: string;
    shortDescription?: string;
    type: ProductType;
    category: ProductCategory;
    subcategory?: string;
    sku: string;
    price: {
      base: number;
      sale?: number;
      currency: string;
    };
    inventory: {
      quantity: number;
      lowStockThreshold?: number;
      trackInventory?: boolean;
      allowBackorder?: boolean;
    };
    images: {
      primary: string;
      gallery?: string[];
      alt?: string;
    };
    specifications?: {
      [key: string]: any;
    };
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
      unit: string;
    };
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      slug?: string;
      keywords?: string[];
    };
    tags?: string[];
    status?: ProductStatus;
    featured?: boolean;
    isDigital?: boolean;
    digitalDelivery?: {
      type: 'email' | 'download' | 'streaming';
      files?: string[];
      instructions?: string;
    };
    variants?: {
      name: string;
      options: {
        [key: string]: string;
      };
      price?: number;
      sku?: string;
      inventory?: number;
    }[];
    relatedProducts?: string[];
  };
}

// Update product interface
interface UpdateProductRequest extends Request {
  body: Partial<CreateProductRequest['body']>;
  params: {
    id: string;
  };
}

// Get products query interface
interface GetProductsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    category?: ProductCategory;
    subcategory?: string;
    status?: ProductStatus;
    featured?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    tags?: string;
  };
}

// Create new product
export const createProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    // Create product
    const product = new Product({
      ...productData,
      inventory: {
        quantity: productData.inventory.quantity,
        lowStockThreshold: productData.inventory.lowStockThreshold || 5,
        trackInventory: productData.inventory.trackInventory !== false,
        allowBackorder: productData.inventory.allowBackorder || false
      },
      images: {
        primary: productData.images.primary,
        gallery: productData.images.gallery || [],
        alt: productData.images.alt
      },
      tags: productData.tags || [],
      status: productData.status || ProductStatus.ACTIVE,
      featured: productData.featured || false,
      isDigital: productData.isDigital || false
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: product.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with filtering and pagination
export const getProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      subcategory,
      status,
      featured,
      search,
      sort = 'createdAt',
      minPrice,
      maxPrice,
      tags
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (tags) filter.tags = { $in: (tags as string).split(',') };

    // Price range filter
    if (minPrice || maxPrice) {
      filter['price.base'] = {};
      if (minPrice) filter['price.base'].$gte = parseFloat(minPrice as string);
      if (maxPrice) filter['price.base'].$lte = parseFloat(maxPrice as string);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj: any = {};
    if (search) {
      sortObj = { score: { $meta: 'textScore' } };
    } else {
      switch (sort) {
        case 'name':
          sortObj = { name: 1 };
          break;
        case 'price-asc':
          sortObj = { 'price.base': 1 };
          break;
        case 'price-desc':
          sortObj = { 'price.base': -1 };
          break;
        case 'rating':
          sortObj = { 'reviews.averageRating': -1 };
          break;
        case 'newest':
          sortObj = { createdAt: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }
    }

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('relatedProducts', 'name price images');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products: products.map(product => product.toJSON()),
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalProducts: total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID or slug
export const getProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let product = await Product.findById(id).populate('relatedProducts', 'name price images');
    
    if (!product) {
      product = await Product.findOne({ 'seo.slug': id }).populate('relatedProducts', 'name price images');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product: product.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if SKU is being updated and if it already exists
    if (updateData.sku) {
      const existingProduct = await Product.findOne({ 
        sku: updateData.sku, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('relatedProducts', 'name price images');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: product.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get product categories
export const getCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Product.aggregate([
      { $match: { status: ProductStatus.ACTIVE } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          subcategories: { $addToSet: '$subcategory' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          subcategories: {
            $filter: {
              input: '$subcategories',
              cond: { $ne: ['$$this', null] }
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products
export const getFeaturedProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '8' } = req.query;
    const limitNum = parseInt(limit as string);

    const products = await Product.find({
      featured: true,
      status: ProductStatus.ACTIVE
    })
    .sort({ createdAt: -1 })
    .limit(limitNum);

    res.json({
      success: true,
      data: {
        products: products.map(product => product.toJSON())
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit = '20' } = req.query;
    const limitNum = parseInt(limit as string);

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $text: { $search: q },
      status: ProductStatus.ACTIVE
    }, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limitNum);

    res.json({
      success: true,
      data: {
        products: products.map(product => product.toJSON()),
        query: q,
        count: products.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update product inventory
export const updateInventory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newQuantity;
    switch (operation) {
      case 'add':
        newQuantity = product.inventory.quantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, product.inventory.quantity - quantity);
        break;
      case 'set':
      default:
        newQuantity = quantity;
        break;
    }

    product.inventory.quantity = newQuantity;
    await product.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: {
        product: product.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product statistics
export const getProductStats: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', ProductStatus.ACTIVE] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          outOfStockProducts: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$inventory.trackInventory', true] },
                    { $eq: ['$inventory.quantity', 0] }
                  ]
                },
                1,
                0
              ]
            }
          },
          lowStockProducts: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$inventory.trackInventory', true] },
                    { $gt: ['$inventory.quantity', 0] },
                    { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { status: ProductStatus.ACTIVE } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          featuredProducts: 0,
          outOfStockProducts: 0,
          lowStockProducts: 0
        },
        categories: categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};
