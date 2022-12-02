const jwt = require("jsonwebtoken");

const authMiddleare = async (req, res, next) => {
  const { crudToken } = req.cookies;
  if (crudToken) {
    try {
      const decodeToken = await jwt.verify(crudToken, "secretkey");
      req.userInfo = decodeToken;
      next();
    } catch (error) {
      return res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};

module.exports = authMiddleare;
