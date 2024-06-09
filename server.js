require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const order_itemsRoutes = require('./routes/order_items');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order_items', order_itemsRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => res.send(`Welcome to my ecommerce portfolio project's back end!\n Please read the documentation at {insert documentation link here} for information on routes.`));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
