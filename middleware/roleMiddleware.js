const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
      console.log(`User role: ${req.user.role}, Required role: ${requiredRole}`);  // Log the role to debug
      if (req.user && req.user.role === requiredRole) {
          next();
      } else {
          res.status(403).send('Forbidden');
      }
  };
};

  
  module.exports = roleMiddleware;
  
  