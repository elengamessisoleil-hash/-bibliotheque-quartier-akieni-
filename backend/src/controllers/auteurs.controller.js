const auteurModel = require("../models/auteur.model");

async function getAll(req, res, next) {
  try {
    const auteurs = await auteurModel.findAll();
    res.json(auteurs);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const auteur = await auteurModel.findById(req.params.id);
    if (!auteur) {
      const err = new Error("Auteur introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(auteur);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const auteur = await auteurModel.create(req.body);
    res.status(201).json(auteur);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const auteur = await auteurModel.update(req.params.id, req.body);
    if (!auteur) {
      const err = new Error("Auteur introuvable");
      err.statut = 404;
      throw err;
    }
    res.json(auteur);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const auteur = await auteurModel.remove(req.params.id);
    if (!auteur) {
      const err = new Error("Auteur introuvable");
      err.statut = 404;
      throw err;
    }
    res.json({ message: "Auteur supprimé", auteur });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
