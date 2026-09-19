const express = require("express");
const router = express.Router();
const controller = require("../controllers/emprunts.controller");
const validateBody = require("../middlewares/validation.middleware");

router.get("/en-cours", controller.getEnCours);
router.get("/en-retard", controller.getEnRetard);
router.post("/", validateBody(["adherent_id", "livre_id", "date_retour_prevue"]), controller.create);
router.patch("/:id/retour", controller.marquerRetour);

module.exports = router;
