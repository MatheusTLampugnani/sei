const db = require('../database');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    const result = await db.query('SELECT * FROM user WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;