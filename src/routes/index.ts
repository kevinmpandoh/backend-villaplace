// Importing express
const router = require("express").Router();

const exampleRoutes = require("./example/exampleRoutes");

// Use exampleRoutes
router.use("/example", exampleRoutes);

module.exports = router;
