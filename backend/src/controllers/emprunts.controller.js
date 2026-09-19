const empruntModel = require("../models/emprunt.model");
const livreModel = require("../models/livre.model");
const adherentModel = require("../models/adherent.model");

// POST /api/emprunts — { adherent_id, livre_id, date_retour_prevue }
async function create(req, res, next) {
  try {
    const { adherent_id, livre_id, date_retour_prevue } = req.body;

    // Vérifier que l'adhérent existe
    const adherent = await adherentModel.findById(adherent_id);
    if (!adherent) {
      const err = new Error("Adhérent introuvable");
      err.statut = 404;
      throw err;
    }

    // Vérifier que le livre existe
    const livre = await livreModel.findById(livre_id);
    if (!livre) {
      const err = new Error("Livre introuvable");
      err.statut = 404;
      throw err;
    }

    // Règle métier centrale : un emprunt ne peut pas être créé si le livre
    // est déjà indiqué comme emprunté
    if (!livre.disponible) {
      const err = new Error("Ce livre est déjà emprunté et n'est pas disponible");
      err.statut = 409; // Conflict
      throw err;
    }

    const emprunt = await empruntModel.create({ adherent_id, livre_id, date_retour_prevue });

    // Le livre passe automatiquement au statut "emprunté"
    await livreModel.setDisponibilite(livre_id, false);

    res.status(201).json(emprunt);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/emprunts/:id/retour — enregistre le retour d'un livre
async function marquerRetour(req, res, next) {
  try {
    const emprunt = await empruntModel.findById(req.params.id);
    if (!emprunt) {
      const err = new Error("Emprunt introuvable");
      err.statut = 404;
      throw err;
    }

    if (emprunt.date_retour_effective) {
      const err = new Error("Ce livre a déjà été rendu");
      err.statut = 409;
      throw err;
    }

    const empruntMisAJour = await empruntModel.marquerRetour(req.params.id);

    // Le livre redevient disponible
    await livreModel.setDisponibilite(emprunt.livre_id, true);

    res.json(empruntMisAJour);
  } catch (err) {
    next(err);
  }
}

async function getEnCours(req, res, next) {
  try {
    const emprunts = await empruntModel.findEnCours();
    res.json(emprunts);
  } catch (err) {
    next(err);
  }
}

async function getEnRetard(req, res, next) {
  try {
    const emprunts = await empruntModel.findEnRetard();
    res.json(emprunts);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, marquerRetour, getEnCours, getEnRetard };
