import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword, generateToken, getAuthUser } from '@/lib/auth';
import { calculateDistance, isInMaharashtra, filterFarmersWithinRadius } from '@/lib/gps';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============ AUTH ROUTES ============

// Register
async function handleRegister(request) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, address, city, pincode, latitude, longitude } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // For farmers, validate GPS coordinates
    if (role === 'farmer') {
      if (!latitude || !longitude) {
        return NextResponse.json({ error: 'GPS coordinates required for farmers' }, { status: 400 });
      }
      
      if (!isInMaharashtra(parseFloat(latitude), parseFloat(longitude))) {
        return NextResponse.json({ error: 'Service only available in Maharashtra' }, { status: 400 });
      }
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        approved: role === 'buyer' || role === 'admin', // Auto-approve buyers and admins
      },
    });

    // Create profile based on role
    if (role === 'buyer') {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          phone: phone || '',
          address: address || '',
          city: city || '',
          pincode: pincode || '',
        },
      });
    } else if (role === 'farmer') {
      await prisma.farmerProfile.create({
        data: {
          userId: user.id,
          phone: phone || '',
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });
    }

    const token = generateToken(user);

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        approved: user.approved,
      },
    },{status:201});
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

// Login
async function handleLogin(request) {
  try {
    const body = await request.json();
    const { email, password, latitude, longitude } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        buyerProfile: true,
        farmerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if approved
    if (!user.approved) {
      return NextResponse.json({ error: 'Account pending approval' }, { status: 403 });
    }

    // For buyers, update GPS location if provided
    if (user.role === 'buyer' && latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      if (!isInMaharashtra(lat, lon)) {
        return NextResponse.json({ error: 'Service only available in Maharashtra' }, { status: 400 });
      }

      await prisma.buyerProfile.update({
        where: { userId: user.id },
        data: { latitude: lat, longitude: lon },
      });
    }

    const token = generateToken(user);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        approved: user.approved,
        profile: user.buyerProfile || user.farmerProfile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// Get current user
async function handleGetMe(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        buyerProfile: true,
        farmerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      approved: user.approved,
      profile: user.buyerProfile || user.farmerProfile,
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

// ============ PRODUCT ROUTES ============

// Get products (filtered by buyer location)
async function handleGetProducts(request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const category = searchParams.get('category');

    let products;

    if (latitude && longitude) {
      // Get all farmers
      const farmers = await prisma.user.findMany({
        where: {
          role: 'farmer',
          approved: true,
        },
        include: {
          farmerProfile: true,
        },
      });

      // Filter farmers within 10km
      const nearbyFarmers = filterFarmersWithinRadius(
        farmers,
        parseFloat(latitude),
        parseFloat(longitude),
        10
      );

      const farmerIds = nearbyFarmers.map(f => f.id);

      // Get products from nearby farmers
      products = await prisma.product.findMany({
        where: {
          farmerId: { in: farmerIds },
          quantity: { gt: 0 },
          ...(category && { category }),
        },
        include: {
          farmer: {
            include: {
              farmerProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Return all products (for admin or testing)
      products = await prisma.product.findMany({
        where: {
          quantity: { gt: 0 },
          ...(category && { category }),
        },
        include: {
          farmer: {
            include: {
              farmerProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

// Create product (farmer only)
async function handleCreateProduct(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, price, quantity, image } = body;

    if (!name || !category || !price || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        farmerId: authUser.userId,
        name,
        category,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        image: image || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// Update product
async function handleUpdateProduct(request, productId) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.farmerId !== authUser.userId) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, category, price, quantity, image } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(price && { price: parseFloat(price) }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete product
async function handleDeleteProduct(request, productId) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || (authUser.role !== 'farmer' && authUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (authUser.role === 'farmer' && product.farmerId !== authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// Get farmer's products
async function handleGetFarmerProducts(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { farmerId: authUser.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get farmer products error:', error);
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

// ============ ORDER ROUTES ============

// Create order
async function handleCreateOrder(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'buyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, paymentMode } = body;
    console.log(items,paymentMode);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    if (!paymentMode || !['cod', 'razorpay'].includes(paymentMode)) {
      return NextResponse.json({ error: 'Invalid payment mode' }, { status: 400 });
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient quantity for ${product.name}` }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        farmerId: product.farmerId,
      });
    }

    // Create Razorpay order if payment mode is razorpay
    let razorpayOrderId = null;
    if (paymentMode === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      });
      razorpayOrderId = razorpayOrder.id;
    }
    console.log(paymentMode==="cod");
    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: authUser.userId,
        paymentMode,
        paymentStatus: paymentMode === 'cod' ? 'pending' : 'paid',
        orderStatus: 'new',
        totalAmount,
        razorpayOrderId,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product quantities
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// Verify Razorpay payment
async function handleVerifyPayment(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        razorpayPaymentId,
      },
    });

    return NextResponse.json({ message: 'Payment verified', order });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}

// Get buyer orders
async function handleGetBuyerOrders(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'buyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: authUser.userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get buyer orders error:', error);
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 });
  }
}

// Get farmer orders
async function handleGetFarmerOrders(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { farmerId: authUser.userId },
      include: {
        order: {
          include: {
            buyer: {
              include: {
                buyerProfile: true,
              },
            },
          },
        },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by order
    const ordersMap = {};
    orderItems.forEach(item => {
      if (!ordersMap[item.orderId]) {
        ordersMap[item.orderId] = {
          ...item.order,
          items: [],
        };
      }
      ordersMap[item.orderId].items.push({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      });
    });

    const orders = Object.values(ordersMap);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get farmer orders error:', error);
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 });
  }
}

// Update order status (farmer only)
async function handleUpdateOrderStatus(request, orderId) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderStatus } = body;

    if (!orderStatus || !['new', 'packed'].includes(orderStatus)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

// ============ ADMIN ROUTES ============

// Get pending farmers
async function handleGetPendingFarmers(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const farmers = await prisma.user.findMany({
      where: {
        role: 'farmer',
        approved: false,
      },
      include: {
        farmerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(farmers);
  } catch (error) {
    console.error('Get pending farmers error:', error);
    return NextResponse.json({ error: 'Failed to get pending farmers' }, { status: 500 });
  }
}

// Approve/reject farmer
async function handleApproveFarmer(request, userId) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { approved } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { approved },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Approve farmer error:', error);
    return NextResponse.json({ error: 'Failed to approve farmer' }, { status: 500 });
  }
}

// Get all users
async function handleGetAllUsers(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        buyerProfile: true,
        farmerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
  }
}

// Get all products (admin)
async function handleGetAdminProducts(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        farmer: {
          include: {
            farmerProfile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get admin products error:', error);
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

// Delete user
async function handleDeleteUser(request, userId) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

// Get admin stats
async function handleGetAdminStats(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalFarmers, totalBuyers, totalProducts, totalOrders, pendingApprovals] = await Promise.all([
      prisma.user.count({ where: { role: 'farmer', approved: true } }),
      prisma.user.count({ where: { role: 'buyer' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'farmer', approved: false } }),
    ]);

    return NextResponse.json({
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      pendingApprovals,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}

// ============ ROUTE HANDLERS ============

export async function GET(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  if (path === '' || path === '/') {
    return NextResponse.json({ message: 'Farmer Marketplace API' });
  }

  // Auth routes
  if (path === 'auth/me') return handleGetMe(request);

  // Product routes
  if (path === 'products') return handleGetProducts(request);
  if (path === 'products/my') return handleGetFarmerProducts(request);

  // Order routes
  if (path === 'orders/buyer') return handleGetBuyerOrders(request);
  if (path === 'orders/farmer') return handleGetFarmerOrders(request);

  // Admin routes
  if (path === 'admin/farmers/pending') return handleGetPendingFarmers(request);
  if (path === 'admin/users') return handleGetAllUsers(request);
  if (path === 'admin/products') return handleGetAdminProducts(request);
  if (path === 'admin/stats') return handleGetAdminStats(request);

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  // Auth routes
  if (path === 'auth/register') return handleRegister(request);
  if (path === 'auth/login') return handleLogin(request);

  // Product routes
  if (path === 'products') return handleCreateProduct(request);

  // Order routes
  if (path === 'orders') return handleCreateOrder(request);
  if (path === 'orders/verify-payment') return handleVerifyPayment(request);

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  // Product routes
  const productMatch = path.match(/^products\/(.+)$/);
  if (productMatch) {
    return handleUpdateProduct(request, productMatch[1]);
  }

  // Order routes
  const orderMatch = path.match(/^orders\/(.+)$/);
  if (orderMatch) {
    return handleUpdateOrderStatus(request, orderMatch[1]);
  }

  // Admin routes
  const farmerMatch = path.match(/^admin\/farmers\/(.+)$/);
  if (farmerMatch) {
    return handleApproveFarmer(request, farmerMatch[1]);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  // Product routes
  const productMatch = path.match(/^products\/(.+)$/);
  if (productMatch) {
    return handleDeleteProduct(request, productMatch[1]);
  }

  // Admin routes
  const userMatch = path.match(/^admin\/users\/(.+)$/);
  if (userMatch) {
    return handleDeleteUser(request, userMatch[1]);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
