const express = require("express");
const router = express.Router();
const controller = require("../controllers/statistiques.controller");

router.get("/", controller.getStatistiques);

module.exports = router;
