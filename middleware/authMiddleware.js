const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // First, check if the Authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).send('Access denied. No token provided.');
  }

  // Try to extract the token by replacing the 'Bearer' prefix
  const token = req.headers.authorization.replace('Bearer ', '');

  // Check if after replacing 'Bearer ', we have a token
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to next middleware or controller if token is valid
  } catch (ex) {
    res.status(400).send('Invalid token.'); // Handle errors like expired or malformed tokens
  }
};

module.exports = authMiddleware;
