const { MongoClient } = require("mongodb");

let client;

const getDb = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("ecommerce");
};

const getTodaySlug = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

exports.processOrderHandler = async () => {
  const db = await getDb();
  const ordersCol = db.collection("orders");

  const topProducts = await ordersCol.aggregate([
    { $unwind: "$productIds" },
    {
      $group: {
        _id: "$productIds._id",
        totalSold: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$product.name",
        totalSold: 1,
        price: "$product.price",
        imageUrl: "$product.imageUrl",
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]).toArray();

  const topCategories = await ordersCol.aggregate([
    { $unwind: "$productIds" },
    { $unwind: "$productIds.categoryIds" },
    {
      $group: {
        _id: "$productIds.categoryIds",
        totalUsed: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        name: "$category.name",
        totalUsed: 1,
      },
    },
    { $sort: { totalUsed: -1 } },
    { $limit: 10 },
  ]).toArray();

  const kpiAgg = await ordersCol.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
        averageOrderValue: { $avg: "$total" },
        firstOrderDate: { $min: "$date" },
        lastOrderDate: { $max: "$date" },
        totalProductsSold: { $sum: { $size: "$productIds" } },
      },
    },
  ]).toArray();

  const kpis = kpiAgg[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    firstOrderDate: null,
    lastOrderDate: null,
  };

  const mostSoldProductAgg = await ordersCol.aggregate([
    { $unwind: "$productIds" },
    {
      $group: {
        _id: "$productIds._id",
        sold: { $sum: 1 },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        price: "$product.price",
        sold: 1,
      },
    },
  ]).toArray();

  const mostSoldProduct = mostSoldProductAgg[0] || null;

  const slug = getTodaySlug();
  const reportsCol = db.collection("daily_reports");

  await reportsCol.updateOne(
    { slug },
    {
      $set: {
        slug,
        date: new Date(slug),
        topProducts,
        topCategories,
        kpis: {
          ...kpis,
          mostSoldProduct,
        },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log(`Relatório diário "${slug}" salvo com KPIs`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Relatório diário "${slug}" com KPIs consolidados.`,
    }),
  };
};
