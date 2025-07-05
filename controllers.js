const admin = require('firebase-admin');
const validUrl = require('valid-url');
const db = require('./firebase');

// URL shortening
const shortenUrl = async (req, res) => {
  const { longUrl, customId } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userId = req.userId;

  // Validate URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).send('Invalid URL');
  }

  // Check if custom ID is provided; generate automatically if not
  let shortUrl = customId || Math.random().toString(36).substring(2, 8);

  // If custom ID is provided, check if it is already in use
  if (customId) {
    const doc = await db.collection('urls').doc(customId).get();
    if (doc.exists) {
      return res.status(400).send('This custom ID is already in use');
    }
  }

  // Save the URL to Firestore, userId ile birlikte
  const createdAt = admin.firestore.FieldValue.serverTimestamp();
  await db.collection('urls').doc(shortUrl).set({ longUrl, createdAt, clientIp, userId });
  res.status(201).send({ shortUrl });
};

// Redirect from shortened URL
const redirectUrl = async (req, res) => {
  const doc = await db.collection('urls').doc(req.params.shortUrl).get();
  if (!doc.exists) {
    return res.status(404).send('URL not found');
  }
  res.redirect(doc.data().longUrl);
};

// Kullanıcının kendi linklerini listele
const listUserUrls = async (req, res) => {
  const userId = req.userId;
  const snapshot = await db.collection('urls').where('userId', '==', userId).get();
  const urls = [];
  snapshot.forEach(doc => {
    urls.push({ id: doc.id, ...doc.data() });
  });
  res.json(urls);
};

// Kullanıcıya ait bir linki sil
const deleteUserUrl = async (req, res) => {
  const userId = req.userId;
  const urlId = req.params.id;
  const doc = await db.collection('urls').doc(urlId).get();
  if (!doc.exists) {
    return res.status(404).json({ error: 'URL not found' });
  }
  if (doc.data().userId !== userId) {
    return res.status(403).json({ error: 'Bu linki silme yetkiniz yok.' });
  }
  await db.collection('urls').doc(urlId).delete();
  res.json({ success: true });
};

module.exports = { shortenUrl, redirectUrl, listUserUrls, deleteUserUrl };
