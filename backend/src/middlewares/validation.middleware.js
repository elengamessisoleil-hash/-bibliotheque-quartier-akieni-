// Factory de middleware : on lui donne la liste des champs obligatoires,
// il renvoie un middleware qui vérifie que req.body les contient tous.
//
// Usage : router.post("/", validateBody(["nom", "nationalite"]), controller.create)

function validateBody(requiredFields) {
  return (req, res, next) => {
    const manquants = requiredFields.filter((champ) => {
      const valeur = req.body[champ];
      return valeur === undefined || valeur === null || valeur === "";
    });

    if (manquants.length > 0) {
      return res.status(400).json({
        erreur: "Champs manquants ou vides",
        champs: manquants,
      });
    }

    next();
  };
}

module.exports = validateBody;
