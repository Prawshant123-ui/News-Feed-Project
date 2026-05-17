const express = require("express");
const Router = express.Router();

const { loginAdmin } = require("../controllers/adminController");

Router.post("/login", loginAdmin);

module.exports = Router;