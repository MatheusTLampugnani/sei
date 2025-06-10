const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;