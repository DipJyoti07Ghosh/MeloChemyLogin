const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies.token;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};
