const db = require('../config/database');

exports.createOrder = async (req, res) => {
    try {
      const { user_id, total } = req.body; // total should ideally be calculated based on order items
      const newOrder = await db.query(
        'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, \'pending\') RETURNING *',
        [user_id, total]
      );
      res.status(201).json(newOrder.rows[0]);
    } catch (error) {
      res.status(500).send('Error creating order');
    }
  };
  
  exports.getAllOrders = async (req, res) => {
    try {
      const results = await db.query('SELECT * FROM orders');
      res.status(200).json(results.rows);
    } catch (error) {
      res.status(500).send('Error retrieving orders');
    }
  };
  
  exports.getOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query('SELECT * FROM orders WHERE order_id = $1', [id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).send('Order not found');
      }
    } catch (error) {
      res.status(500).send('Error retrieving order');
    }
  };
  
  exports.updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await db.query(
        'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
        [status, id]
      );
      res.status(200).json(updatedOrder.rows[0]);
    } catch (error) {
      res.status(500).send('Error updating order');
    }
  };
  
  exports.deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM orders WHERE order_id = $1', [id]);
      res.status(200).send('Order deleted');
    } catch (error) {
      res.status(500).send('Error deleting order')
    }
  };