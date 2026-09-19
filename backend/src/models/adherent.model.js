const pool = require("../config/db");

async function findAll() {
  const { rows } = await pool.query("SELECT * FROM adherent ORDER BY nom");
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM adherent WHERE id = $1", [id]);
  return rows[0];
}

async function create({ nom, contact }) {
  const { rows } = await pool.query(
    "INSERT INTO adherent (nom, contact) VALUES ($1, $2) RETURNING *",
    [nom, contact]
  );
  return rows[0];
}

async function update(id, { nom, contact }) {
  const { rows } = await pool.query(
    "UPDATE adherent SET nom = $1, contact = $2 WHERE id = $3 RETURNING *",
    [nom, contact, id]
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query("DELETE FROM adherent WHERE id = $1 RETURNING *", [id]);
  return rows[0];
}

// Historique complet des emprunts (en cours ET passés) d'un adhérent donné
async function findHistoriqueEmprunts(adherentId) {
  const { rows } = await pool.query(
    `SELECT e.id, e.date_emprunt, e.date_retour_prevue, e.date_retour_effective,
            l.titre AS livre_titre,
            CASE
              WHEN e.date_retour_effective IS NOT NULL THEN 'rendu'
              WHEN e.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
              ELSE 'en_cours'
            END AS statut
     FROM emprunt e
     JOIN livre l ON l.id = e.livre_id
     WHERE e.adherent_id = $1
     ORDER BY e.date_emprunt DESC`,
    [adherentId]
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, findHistoriqueEmprunts };
