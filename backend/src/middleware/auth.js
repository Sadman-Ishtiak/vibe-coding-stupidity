import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

export const companyMiddleware = (req, res, next) => {
  if (req.userRole !== 'company') {
    return res.status(403).json({ error: 'Access denied. Company only.' });
  }
  next();
};

export const candidateMiddleware = (req, res, next) => {
  if (req.userRole !== 'candidate') {
    return res.status(403).json({ error: 'Access denied. Candidate only.' });
  }
  next();
};
