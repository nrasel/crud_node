const router = require("express").Router();
const authController = require("../controller/authController");

// for display the pages
router.get("/register", authController.registerPage);
router.get("/login", authController.loginPage);

// for registration and login
router.post("/user-register", authController.userRegister);
router.post("/user-login", authController.userLogin);

module.exports = router;
