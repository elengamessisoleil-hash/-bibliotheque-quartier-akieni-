const livreModel = require("../models/livre.model");

// GET /api/livres?recherche=...&page=1&limite=10
async function getAll(req, res, next) {
  try {
    const { recherche, page, limite } = req.query;
    const resultat = await livreModel.findAll({ recherche, page, limite });
    res.json(resultat);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const livre = await livreModel.findById(req.params.id);
    if (!livre) {
      const err = new Error("Livre introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(livre);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const livre = await livreModel.create(req.body);
    res.status(201).json(livre);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const livre = await livreModel.update(req.params.id, req.body);
    if (!livre) {
      const err = new Error("Livre introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(livre);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const livre = await livreModel.remove(req.params.id);
    if (!livre) {
      const err = new Error("Livre introuvable");
      err.statut = 404;
      throw err;
    }
    res.json({ message: "Livre supprimé", livre });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
