// Add this file as src/middlewares/corsHandler.js

/**
 * Middleware to handle CORS preflight requests
 */
const handleCorsPreflightRequests = (req, res, next) => {
    // Check if this is a preflight request
    if (req.method === 'OPTIONS') {
      // Set CORS headers
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      // Respond with 204 No Content
      return res.status(204).end();
    }
    
    // Continue to the next middleware for non-OPTIONS requests
    next();
  };
  
  module.exports = handleCorsPreflightRequests;