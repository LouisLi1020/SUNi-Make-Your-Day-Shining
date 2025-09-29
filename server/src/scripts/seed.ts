import 'dotenv/config';
import connectDB from '../config/database';
import { User, UserRole } from '../models/User';
import { Product, ProductCategory, ProductStatus, ProductType } from '../models/Product';

async function seedUsers() {
  const adminEmail = 'admin@suni.com';
  const memberEmail = 'member@suni.com';

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await new User({
      email: adminEmail,
      name: 'Suni Admin',
      password: 'admin123456',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true
    }).save();
    console.log('✓ Admin user created');
  } else {
    console.log('• Admin user exists');
  }

  const member = await User.findOne({ email: memberEmail });
  if (!member) {
    await new User({
      email: memberEmail,
      name: 'Demo Member',
      password: 'member123456',
      role: UserRole.MEMBER,
      isEmailVerified: true,
      isActive: true
    }).save();
    console.log('✓ Demo member created');
  } else {
    console.log('• Demo member exists');
  }
}

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`• Products exist (${count})`);
    return;
  }

  const products = [
    {
      name: 'Beach Towel Classic',
      description: 'Soft and quick-dry beach towel with ocean vibes.',
      type: ProductType.PHYSICAL,
      category: ProductCategory.BEACH_ACCESSORIES,
      sku: 'BT-CLSC-001',
      price: { base: 25, currency: 'USD' },
      inventory: { quantity: 100, lowStockThreshold: 5, trackInventory: true, allowBackorder: false },
      images: { primary: 'https://placehold.co/600x400', gallery: [] },
      seo: { slug: 'beach-towel-classic' },
      tags: ['beach', 'towel'],
      status: ProductStatus.ACTIVE,
      featured: true,
      isDigital: false
    },
    {
      name: 'Snorkeling Experience (Half Day)',
      description: 'Guided snorkeling in clear waters. Equipment included.',
      type: ProductType.DIGITAL,
      category: ProductCategory.WATER_ACTIVITIES,
      sku: 'SNORK-EX-1',
      price: { base: 80, currency: 'USD' },
      inventory: { quantity: 50, lowStockThreshold: 5, trackInventory: true, allowBackorder: true },
      images: { primary: 'https://placehold.co/600x400', gallery: [] },
      seo: { slug: 'snorkeling-experience-half-day' },
      tags: ['snorkeling', 'experience'],
      status: ProductStatus.ACTIVE,
      featured: true,
      isDigital: true
    }
  ];

  await Product.insertMany(products);
  console.log(`✓ Seeded ${products.length} products`);
}

(async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedProducts();
    console.log('✅ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
