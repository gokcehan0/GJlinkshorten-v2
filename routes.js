const express = require('express');
const { shortenUrl, redirectUrl, listUserUrls, deleteUserUrl } = require('./controllers');
const verifyToken = require('./verifyToken');

const router = express.Router();

// URL shortening endpoint (token zorunlu)
router.post('/shorten', verifyToken, shortenUrl);

// Kullanıcının kendi linklerini listele
router.get('/my/urls', verifyToken, listUserUrls);

// Kullanıcıya ait bir linki sil
router.delete('/my/urls/:id', verifyToken, deleteUserUrl);

// Redirect endpoint (herkese açık)
router.get('/:shortUrl', redirectUrl);

module.exports = router;
