const express = require("express");
const route = express.Router();

const {
  getExample,
  createExample,
} = require("../../controllers/example/exampleController");

route.get("/", getExample);
route.post("/", createExample);

module.exports = route;
