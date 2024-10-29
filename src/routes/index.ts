// Importing express
const router = require("express").Router();

const exampleRoutes = require("./example/exampleRoutes");
const pesananRoutes = require("./pesanan.route");

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);

module.exports = router;
