import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default function auth(roles = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: token missing' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.id) return res.status(401).json({ message: 'Unauthorized: invalid token' });

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Unauthorized: user not found' });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
}
