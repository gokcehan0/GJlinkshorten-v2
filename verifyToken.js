// Token doğrulama middleware'i
const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ error: 'Token gerekli.' });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token.' });
  }
};

module.exports = verifyToken;
