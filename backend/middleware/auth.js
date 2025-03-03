// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Token ellenőrzése a sütiből
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'Nincs token, engedély megtagadva' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Érvénytelen token' });
  }
};
