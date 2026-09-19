// Middleware d'erreur : DOIT être monté en DERNIER dans app.js (après toutes les routes).
// Express reconnaît un middleware d'erreur grâce à ses 4 paramètres (err, req, res, next).
//
// Dans les controllers, on utilise try/catch et on appelle next(err) en cas de problème :
// il atterrit automatiquement ici.

function errorHandler(err, req, res, next) {
  console.error("Erreur interceptée :", err);

  // Erreur "métier" volontaire (ex. livre indisponible) : on lui donne un statut personnalisé
  const statut = err.statut || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statut).json({ erreur: message });
}

module.exports = errorHandler;
