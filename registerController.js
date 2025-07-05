const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Firebase ile e-posta/şifre ile kayıt
const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );
    const data = await response.json();
    if (data.error) {
      // Do not leak error details
      return res.status(400).json({ error: 'Registration failed.' });
    }
    // Email verification gönder
    if (data.idToken) {
      await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken: data.idToken })
        }
      );
    }
    res.json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ error: 'Register failed.' });
  }
};

module.exports = { register };
