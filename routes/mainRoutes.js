const express = require("express");
const router = express.Router();

router.use("/task", require("./taskRoutes"));
router.use("/user", require("./userRoutes"));

module.exports = router;
