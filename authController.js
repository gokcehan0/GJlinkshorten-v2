const admin = require('firebase-admin');

// Firebase ile e-posta/şifre ile giriş
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    // Firebase Admin SDK doğrudan şifre ile giriş yapamaz, sadece kullanıcı oluşturma ve yönetme işlemleri yapar.
    // Şifre ile giriş için client-side (web, mobil) Firebase SDK veya REST API kullanılmalı.
    // Burada REST API ile giriş yapılır:
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const apiKey = process.env.FIREBASE_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );
    const data = await response.json();
    if (data.error) {
      return res.status(401).json({ error: data.error.message });
    }
    // Giriş başarılı, idToken döndür
    res.json({ idToken: data.idToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

module.exports = { login };
