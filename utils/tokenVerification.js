const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('auth-token');

  if (!token) {
    res.status(401).send('Access denied');
  }

  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch {
    res.status(400).send('Invalid token')
  }
}

module.exports = auth;
