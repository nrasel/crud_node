const dashboardController = require("../controller/dashboardController");
const authMiddleare = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/dashboard", authMiddleare, dashboardController.dashboardPage);

module.exports = router;
