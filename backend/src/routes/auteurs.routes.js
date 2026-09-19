const express = require("express");
const router = express.Router();
const controller = require("../controllers/auteurs.controller");
const validateBody = require("../middlewares/validation.middleware");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", validateBody(["nom"]), controller.create);
router.put("/:id", validateBody(["nom"]), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
