const db = require('../config/database');

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send('Error creating product: ' + error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send('Error retrieving products: ' + error.message);
  }
};

exports.searchProducts = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  let params = [];

  if (name) {
    query += ' AND name ILIKE $' + (params.length + 1);
    params.push(`%${name}%`);
  }
  if (category) {
    query += ' AND category = $' + (params.length + 1);
    params.push(category);
  }
  if (minPrice) {
    query += ' AND price >= $' + (params.length + 1);
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= $' + (params.length + 1);
    params.push(maxPrice);
  }

  try {
    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send("Error searching for products: " + error.message);
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving product: ' + error.message);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  try {
    const result = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5 WHERE id = $6 RETURNING *',
      [name, description, price, stock, category, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error updating product: ' + error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).send('Product deleted');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting product: ' + error.message);
  }
};

