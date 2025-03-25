const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const client = new MongoClient(MONGODB_URI);

const categories = [
  { name: 'Eletrônicos' },
  { name: 'Roupas' },
  { name: 'Livros' },
  { name: 'Brinquedos' },
];

const products = [
  {
    name: 'Notebook Gamer',
    description: 'Alto desempenho para jogos pesados.',
    price: 4999.99,
    imageUrl: 'https://via.placeholder.com/150',
    categoryCount: 2,
  },
  {
    name: 'Camiseta Preta',
    description: 'Camiseta básica de algodão.',
    price: 59.9,
    imageUrl: 'https://via.placeholder.com/150',
    categoryCount: 1,
  },
  {
    name: 'Livro de JavaScript',
    description: 'Aprenda JS moderno do básico ao avançado.',
    price: 89.5,
    imageUrl: 'https://via.placeholder.com/150',
    categoryCount: 1,
  },
];

const createRandomOrder = (productIds) => {
  const selected = productIds.sort(() => 0.5 - Math.random()).slice(0, 2);
  const total = selected.reduce((sum, id) => {
    const prod = productsMap[id.toString()];
    return sum + (prod?.price || 0);
  }, 0);

  return {
    date: new Date(),
    productIds: selected.map(id => ({ _id: id })),
    total,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

let productsMap = {};

async function run() {
  try {
    await client.connect();
    const db = client.db();

    console.log('📂 Limpando coleções antigas...');
    await db.collection('orders').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});

    console.log('📁 Inserindo categorias...');
    const insertedCategories = await db.collection('categories').insertMany(categories);
    const categoryIds = Object.values(insertedCategories.insertedIds);

    console.log('📦 Inserindo produtos...');
    const productDocs = products.map((product) => {
      const assignedCategories = categoryIds
        .sort(() => 0.5 - Math.random())
        .slice(0, product.categoryCount);

      return {
        ...product,
        categoryIds: assignedCategories,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const insertedProducts = await db.collection('products').insertMany(productDocs);
    const productIds = Object.values(insertedProducts.insertedIds);

    productsMap = {};
    productIds.forEach((id, index) => {
      productsMap[id.toString()] = productDocs[index];
    });

    console.log('🧾 Inserindo pedidos...');
    const orders = Array.from({ length: 5 }).map(() => createRandomOrder(productIds));
    await db.collection('orders').insertMany(orders);

    console.log('✅ Seed concluído com sucesso!');
  } catch (err) {
    console.error('Erro ao executar seed:', err);
  } finally {
    await client.close();
  }
}

run();
