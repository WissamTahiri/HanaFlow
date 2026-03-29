const { validationResult } = require("express-validator");

// Renvoie la première erreur de validation sous forme JSON 400
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = validate;
