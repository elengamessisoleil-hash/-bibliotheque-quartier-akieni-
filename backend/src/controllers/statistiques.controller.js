const pool = require("../config/db");

// GET /api/statistiques — tableau de bord
async function getStatistiques(req, res, next) {
  try {
    const [totalLivres, totalAdherents, empruntsEnCours, empruntsEnRetard, livrePlusEmprunte, adherentPlusActif] =
      await Promise.all([
        pool.query("SELECT COUNT(*) FROM livre"),
        pool.query("SELECT COUNT(*) FROM adherent"),
        pool.query("SELECT COUNT(*) FROM emprunt WHERE date_retour_effective IS NULL"),
        pool.query(
          `SELECT COUNT(*) FROM emprunt
           WHERE date_retour_effective IS NULL AND date_retour_prevue < CURRENT_DATE`
        ),
        pool.query(
          `SELECT l.titre, COUNT(*) AS nombre_emprunts
           FROM emprunt e JOIN livre l ON l.id = e.livre_id
           GROUP BY l.id, l.titre
           ORDER BY nombre_emprunts DESC
           LIMIT 1`
        ),
        pool.query(
          `SELECT a.nom, COUNT(*) AS nombre_emprunts
           FROM emprunt e JOIN adherent a ON a.id = e.adherent_id
           GROUP BY a.id, a.nom
           ORDER BY nombre_emprunts DESC
           LIMIT 1`
        ),
      ]);

    res.json({
      total_livres: parseInt(totalLivres.rows[0].count, 10),
      total_adherents: parseInt(totalAdherents.rows[0].count, 10),
      emprunts_en_cours: parseInt(empruntsEnCours.rows[0].count, 10),
      emprunts_en_retard: parseInt(empruntsEnRetard.rows[0].count, 10),
      livre_plus_emprunte: livrePlusEmprunte.rows[0] || null,
      adherent_plus_actif: adherentPlusActif.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStatistiques };
