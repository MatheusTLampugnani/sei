const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const isMatch = await User.comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
        expiresIn: '8h'
      });

      res.json({
        auth: true,
        token: token,
        user: { id: user.id, username: user.username }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;