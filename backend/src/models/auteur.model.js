const pool = require("../config/db");

async function findAll() {
  const { rows } = await pool.query("SELECT * FROM auteur ORDER BY nom");
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM auteur WHERE id = $1", [id]);
  return rows[0];
}

async function create({ nom, nationalite }) {
  const { rows } = await pool.query(
    "INSERT INTO auteur (nom, nationalite) VALUES ($1, $2) RETURNING *",
    [nom, nationalite]
  );
  return rows[0];
}

async function update(id, { nom, nationalite }) {
  const { rows } = await pool.query(
    "UPDATE auteur SET nom = $1, nationalite = $2 WHERE id = $3 RETURNING *",
    [nom, nationalite, id]
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query("DELETE FROM auteur WHERE id = $1 RETURNING *", [id]);
  return rows[0];
}

module.exports = { findAll, findById, create, update, remove };
