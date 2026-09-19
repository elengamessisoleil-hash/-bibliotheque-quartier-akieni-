const pool = require("../config/db");

// Liste des livres avec nom de l'auteur, recherche (titre ou auteur) et pagination
async function findAll({ recherche, page = 1, limite = 10 }) {
  const offset = (page - 1) * limite;
  const params = [];
  let whereClause = "";

  if (recherche) {
    params.push(`%${recherche}%`);
    whereClause = `WHERE l.titre ILIKE $${params.length} OR a.nom ILIKE $${params.length}`;
  }

  params.push(limite, offset);

  const { rows } = await pool.query(
    `SELECT l.id, l.titre, l.annee_publication, l.disponible,
            a.id AS auteur_id, a.nom AS auteur_nom
     FROM livre l
     JOIN auteur a ON a.id = l.auteur_id
     ${whereClause}
     ORDER BY l.titre
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  // Compte total (pour calculer le nombre de pages côté frontend)
  const countParams = recherche ? [`%${recherche}%`] : [];
  const countWhere = recherche ? "WHERE l.titre ILIKE $1 OR a.nom ILIKE $1" : "";
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM livre l JOIN auteur a ON a.id = l.auteur_id ${countWhere}`,
    countParams
  );

  return {
    livres: rows,
    total: parseInt(countRows[0].count, 10),
    page: parseInt(page, 10),
    limite: parseInt(limite, 10),
  };
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT l.*, a.nom AS auteur_nom
     FROM livre l JOIN auteur a ON a.id = l.auteur_id
     WHERE l.id = $1`,
    [id]
  );
  return rows[0];
}

async function create({ titre, annee_publication, auteur_id }) {
  const { rows } = await pool.query(
    `INSERT INTO livre (titre, annee_publication, auteur_id, disponible)
     VALUES ($1, $2, $3, true) RETURNING *`,
    [titre, annee_publication, auteur_id]
  );
  return rows[0];
}

async function update(id, { titre, annee_publication, auteur_id }) {
  const { rows } = await pool.query(
    `UPDATE livre SET titre = $1, annee_publication = $2, auteur_id = $3
     WHERE id = $4 RETURNING *`,
    [titre, annee_publication, auteur_id, id]
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query("DELETE FROM livre WHERE id = $1 RETURNING *", [id]);
  return rows[0];
}

async function setDisponibilite(id, disponible) {
  const { rows } = await pool.query(
    "UPDATE livre SET disponible = $1 WHERE id = $2 RETURNING *",
    [disponible, id]
  );
  return rows[0];
}

module.exports = { findAll, findById, create, update, remove, setDisponibilite };
