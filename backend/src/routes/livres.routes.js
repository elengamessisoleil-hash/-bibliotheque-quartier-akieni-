const express = require("express");
const router = express.Router();
const controller = require("../controllers/livres.controller");
const validateBody = require("../middlewares/validation.middleware");

// GET /api/livres?recherche=&page=&limite=
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", validateBody(["titre", "auteur_id"]), controller.create);
router.put("/:id", validateBody(["titre", "auteur_id"]), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
