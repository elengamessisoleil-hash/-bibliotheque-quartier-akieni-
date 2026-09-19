const adherentModel = require("../models/adherent.model");

async function getAll(req, res, next) {
  try {
    const adherents = await adherentModel.findAll();
    res.json(adherents);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const adherent = await adherentModel.findById(req.params.id);
    if (!adherent) {
      const err = new Error("Adhérent introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(adherent);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const adherent = await adherentModel.create(req.body);
    res.status(201).json(adherent);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const adherent = await adherentModel.update(req.params.id, req.body);
    if (!adherent) {
      const err = new Error("Adhérent introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(adherent);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const adherent = await adherentModel.remove(req.params.id);
    if (!adherent) {
      const err = new Error("Adhérent introuvable");
      err.statut = 404;
      throw err;
    }
    res.json({ message: "Adhérent supprimé", adherent });
  } catch (err) {
    next(err);
  }
}

// GET /api/adherents/:id/emprunts — historique en cours et passés
async function getHistorique(req, res, next) {
  try {
    const adherent = await adherentModel.findById(req.params.id);
    if (!adherent) {
      const err = new Error("Adhérent introuvable");
      err.statut = 404;
      throw err;
    }
    const historique = await adherentModel.findHistoriqueEmprunts(req.params.id);
    res.json(historique);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove, getHistorique };
