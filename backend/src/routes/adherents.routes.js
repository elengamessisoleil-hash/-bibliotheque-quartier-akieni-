const express = require("express");
const router = express.Router();
const controller = require("../controllers/adherents.controller");
const validateBody = require("../middlewares/validation.middleware");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.get("/:id/emprunts", controller.getHistorique);
router.post("/", validateBody(["nom", "contact"]), controller.create);
router.put("/:id", validateBody(["nom", "contact"]), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
