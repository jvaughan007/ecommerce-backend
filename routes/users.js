const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController'); 
const authMiddleware = require('../middleware/authMiddleware'); 
const roleMiddleware = require('../middleware/roleMiddleware'); 

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/:id', authMiddleware, usersController.getUser);
router.get('/:id/orders', authMiddleware, usersController.getUserOrders);
router.put('/:id', authMiddleware, usersController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), usersController.deleteUser);

module.exports = router;

