import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dr-johnny-secret-key-change-in-production';

const CODE_ATTEMPTS = new Map();

router.post('/dentist-code', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const attempts = CODE_ATTEMPTS.get(ip) || { count: 0, lastAttempt: 0 };
  const now = Date.now();

  if (now - attempts.lastAttempt < 1000) {
    return res.status(429).json({ success: false, message: 'Too many attempts. Please wait.' });
  }

  if (attempts.count >= 5) {
    if (now - attempts.lastAttempt < 300000) {
      return res.status(429).json({ success: false, message: 'Too many failed attempts. Try again in 5 minutes.' });
    }
    CODE_ATTEMPTS.delete(ip);
  }

  const expectedCode = process.env.DENTIST_ACCESS_CODE || 'DrJohnny2025';
  const isValid = req.body?.code === expectedCode;

  if (!isValid) {
    CODE_ATTEMPTS.set(ip, { count: attempts.count + 1, lastAttempt: now });
    return res.status(401).json({ success: false, message: 'Invalid access code' });
  }

  CODE_ATTEMPTS.delete(ip);
  const token = jwt.sign({ role: 'dentist', iat: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ success: true, token });
});

router.post('/verify', (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(401).json({ valid: false });
  try {
    jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true });
  } catch {
    return res.status(401).json({ valid: false });
  }
});

export { JWT_SECRET };
export default router;
