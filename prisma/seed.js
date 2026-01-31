const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@freshlocal.com' },
    update: {},
    create: {
      email: 'admin@freshlocal.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      approved: true,
    },
  });
  console.log('Created admin:', admin.email);

  // Create sample farmers (within Maharashtra)
  const farmerPassword = bcrypt.hashSync('farmer123', 10);
  
  const farmer1 = await prisma.user.upsert({
    where: { email: 'farmer1@example.com' },
    update: {},
    create: {
      email: 'farmer1@example.com',
      password: farmerPassword,
      name: 'Ramesh Patil',
      role: 'farmer',
      approved: true,
      farmerProfile: {
        create: {
          phone: '9876543210',
          latitude: 19.0760,
          longitude: 72.8777, // Mumbai area
        },
      },
    },
  });
  console.log('Created farmer 1:', farmer1.email);

  const farmer2 = await prisma.user.upsert({
    where: { email: 'farmer2@example.com' },
    update: {},
    create: {
      email: 'farmer2@example.com',
      password: farmerPassword,
      name: 'Suresh Deshmukh',
      role: 'farmer',
      approved: true,
      farmerProfile: {
        create: {
          phone: '9876543211',
          latitude: 19.0820,
          longitude: 72.8850, // Near Mumbai
        },
      },
    },
  });
  console.log('Created farmer 2:', farmer2.email);

  const farmer3 = await prisma.user.upsert({
    where: { email: 'farmer3@example.com' },
    update: {},
    create: {
      email: 'farmer3@example.com',
      password: farmerPassword,
      name: 'Ganesh Kulkarni',
      role: 'farmer',
      approved: true,
      farmerProfile: {
        create: {
          phone: '9876543212',
          latitude: 18.5204,
          longitude: 73.8567, // Pune area
        },
      },
    },
  });
  console.log('Created farmer 3:', farmer3.email);

  // Create sample products
  const products = [
    // Farmer 1 products
    {
      farmerId: farmer1.id,
      name: 'Fresh Tomatoes',
      category: 'Vegetable',
      price: 40,
      quantity: 50,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    },
    {
      farmerId: farmer1.id,
      name: 'Organic Onions',
      category: 'Vegetable',
      price: 30,
      quantity: 100,
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    },
    {
      farmerId: farmer1.id,
      name: 'Fresh Mangoes',
      category: 'Fruit',
      price: 150,
      quantity: 30,
      image: 'https://images.unsplash.com/photo-1605027990121-cbae9d3da507?w=400',
    },
    // Farmer 2 products
    {
      farmerId: farmer2.id,
      name: 'Green Spinach',
      category: 'Vegetable',
      price: 25,
      quantity: 40,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    },
    {
      farmerId: farmer2.id,
      name: 'Fresh Bananas',
      category: 'Fruit',
      price: 50,
      quantity: 60,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    },
    {
      farmerId: farmer2.id,
      name: 'Basmati Rice',
      category: 'Rice',
      price: 80,
      quantity: 200,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    },
    // Farmer 3 products
    {
      farmerId: farmer3.id,
      name: 'Fresh Potatoes',
      category: 'Vegetable',
      price: 35,
      quantity: 150,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    },
    {
      farmerId: farmer3.id,
      name: 'Organic Carrots',
      category: 'Vegetable',
      price: 45,
      quantity: 70,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    },
    {
      farmerId: farmer3.id,
      name: 'Wheat Grain',
      category: 'Grain',
      price: 60,
      quantity: 300,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Created ${products.length} products`);

  // Create a sample buyer
  const buyerPassword = bcrypt.hashSync('buyer123', 10);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      password: buyerPassword,
      name: 'Priya Sharma',
      role: 'buyer',
      approved: true,
      buyerProfile: {
        create: {
          phone: '9876543220',
          address: 'Andheri West',
          city: 'Mumbai',
          pincode: '400058',
          latitude: 19.1136,
          longitude: 72.8697,
        },
      },
    },
  });
  console.log('Created buyer:', buyer.email);

  console.log('\\n=== Seed Data Summary ===');
  console.log('Admin: admin@freshlocal.com / admin123');
  console.log('Farmers:');
  console.log('  - farmer1@example.com / farmer123 (Mumbai)');
  console.log('  - farmer2@example.com / farmer123 (Mumbai)');
  console.log('  - farmer3@example.com / farmer123 (Pune)');
  console.log('Buyer: buyer@example.com / buyer123 (Mumbai)');
  console.log('Products: 9 products from 3 farmers');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
