const { PrismaClient } = require('@prisma/client');
const { PrismaMariadb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = mariadb.createPool(connectionString);
  const adapter = new PrismaMariadb(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const categories = [
      { name: 'Baby Boy', slug: 'baby-boy' },
      { name: 'Baby Girl', slug: 'baby-girl' },
      { name: 'Boys', slug: 'boys' },
      { name: 'Girls', slug: 'girls' },
    ];

    for (const cat of categories) {
      const category = await prisma.category.create({
        data: cat,
      });

      // Create some sample products for each category
      await prisma.product.createMany({
        data: [
          {
            name: `${cat.name} Waffle Set`,
            description: 'Comfortable waffle textured plush set for daily wear.',
            price: 14.99,
            categoryId: category.id,
            image: '/products/waffle-set.jpg',
          },
          {
            name: `${cat.name} Ribbed Set`,
            description: 'Soft ribbed jogging set for active kids.',
            price: 18.50,
            categoryId: category.id,
            image: '/products/ribbed-set.jpg',
          },
        ],
      });
    }

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
