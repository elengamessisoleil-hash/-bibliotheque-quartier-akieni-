const pool = require("../config/db");

async function create({ adherent_id, livre_id, date_retour_prevue }) {
  const { rows } = await pool.query(
    `INSERT INTO emprunt (adherent_id, livre_id, date_retour_prevue)
     VALUES ($1, $2, $3) RETURNING *`,
    [adherent_id, livre_id, date_retour_prevue]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM emprunt WHERE id = $1", [id]);
  return rows[0];
}

async function marquerRetour(id) {
  const { rows } = await pool.query(
    `UPDATE emprunt SET date_retour_effective = CURRENT_DATE
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}

// Emprunts en cours (pas encore rendus), avec titre du livre et nom de l'adhérent
async function findEnCours() {
  const { rows } = await pool.query(
    `SELECT e.*, l.titre AS livre_titre, ad.nom AS adherent_nom
     FROM emprunt e
     JOIN livre l ON l.id = e.livre_id
     JOIN adherent ad ON ad.id = e.adherent_id
     WHERE e.date_retour_effective IS NULL
     ORDER BY e.date_retour_prevue`
  );
  return rows;
}

// Emprunts en retard : pas rendus ET date prévue dépassée
async function findEnRetard() {
  const { rows } = await pool.query(
    `SELECT e.*, l.titre AS livre_titre, ad.nom AS adherent_nom
     FROM emprunt e
     JOIN livre l ON l.id = e.livre_id
     JOIN adherent ad ON ad.id = e.adherent_id
     WHERE e.date_retour_effective IS NULL
       AND e.date_retour_prevue < CURRENT_DATE
     ORDER BY e.date_retour_prevue`
  );
  return rows;
}

module.exports = { create, findById, marquerRetour, findEnCours, findEnRetard };
