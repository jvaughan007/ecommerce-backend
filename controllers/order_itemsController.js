const db = require('../config/database');

// Add an item to an order
exports.addItemToOrder = async (req, res) => {
    const { orderId, productId, quantity, price } = req.body;

    // Input validation
    if (!orderId || !productId || !quantity || !price) {
        return res.status(400).send("All fields (orderId, productId, quantity, price) are required.");
    }
    if (quantity <= 0 || price <= 0) {
        return res.status(400).send("Quantity and price must be positive numbers.");
    }

    try {
        // Start transaction
        await db.query('BEGIN');

        // Insert a new order item
        const insertQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const insertedItem = await db.query(insertQuery, [orderId, productId, quantity, price]);

        // Update order total
        const updateTotalQuery = `
            UPDATE orders
            SET total = total + ($1 * $2)
            WHERE order_id = $3
            RETURNING total;
        `;
        const updatedTotal = await db.query(updateTotalQuery, [price, quantity, orderId]);

        // Commit transaction
        await db.query('COMMIT');
        res.status(201).json({ item: insertedItem.rows[0], newTotal: updatedTotal.rows[0].total });
    } catch (error) {
        // Rollback transaction if any error occurs
        await db.query('ROLLBACK');
        res.status(500).send("Failed to add item to order: " + error.message);
    }
};


// Get all items in an order by order ID
exports.getItemsByOrderId = async (req, res) => {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).send("Order ID is required.");
    }
  
    try {
      const result = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
      if (result.rows.length === 0) {
        return res.status(404).send('No items found for this order.');
      }
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).send("Error retrieving items: " + error.message);
    }
  };


  // Update an item in an order
exports.updateOrderItem = async (req, res) => {
    const { orderItemId } = req.params;
    const { quantity, price } = req.body;
  
    // Input validation
    if (!quantity || !price) {
      return res.status(400).send("Both quantity and price are required.");
    }
    if (quantity <= 0 || price <= 0) {
      return res.status(400).send("Quantity and price must be positive numbers.");
    }
  
    try {
      // Start transaction
      await db.query('BEGIN');
  
      // Retrieve the old item to get the old price and quantity
      const itemQuery = 'SELECT price, quantity, order_id FROM order_items WHERE order_item_id = $1';
      const itemResult = await db.query(itemQuery, [orderItemId]);
      if (itemResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).send('Item not found.');
      }
      const { price: oldPrice, quantity: oldQuantity, order_id } = itemResult.rows[0];
  
      // Update the item
      const updateQuery = `
        UPDATE order_items SET quantity = $1, price = $2
        WHERE order_item_id = $3
        RETURNING *;
      `;
      const updatedItem = await db.query(updateQuery, [quantity, price, orderItemId]);
  
      // Update order total
      const updateTotalQuery = `
        UPDATE orders
        SET total = total - ($1 * $2) + ($3 * $4)
        WHERE order_id = $5
        RETURNING total;
      `;
      const updatedTotal = await db.query(updateTotalQuery, [oldPrice, oldQuantity, price, quantity, order_id]);
  
      // Commit transaction
      await db.query('COMMIT');
      res.status(200).json({ item: updatedItem.rows[0], newTotal: updatedTotal.rows[0].total });
    } catch (error) {
      // Rollback transaction if any error occurs
      await db.query('ROLLBACK');
      res.status(500).send("Failed to update item: " + error.message);
    }
  };
  
  
// Remove an item from an order
exports.removeItemFromOrder = async (req, res) => {
    const { orderItemId } = req.params;

    if (!orderItemId) {
        return res.status(400).send("Order item ID is required.");
    }

    try {
        // Start transaction
        await db.query('BEGIN');

        // Retrieve the item to be deleted
        const itemQuery = 'SELECT price, quantity, order_id FROM order_items WHERE order_item_id = $1';
        const itemResult = await db.query(itemQuery, [orderItemId]);
        if (itemResult.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).send('Item not found.');
        }
        const { price, quantity, order_id } = itemResult.rows[0];

        // Delete the item
        const deleteQuery = 'DELETE FROM order_items WHERE order_item_id = $1';
        await db.query(deleteQuery, [orderItemId]);

        // Update order total
        const updateTotalQuery = `
            UPDATE orders
            SET total = total - ($1 * $2)
            WHERE order_id = $3
            RETURNING total;
        `;
        const updatedTotal = await db.query(updateTotalQuery, [price, quantity, order_id]);

        // Commit transaction
        await db.query('COMMIT');
        res.status(200).json({ removedItem: orderItemId, newTotal: updatedTotal.rows[0].total });
    } catch (error) {
        // Rollback transaction if any error occurs
        await db.query('ROLLBACK');
        res.status(500).send("Failed to remove item from order: " + error.message);
    }
};
