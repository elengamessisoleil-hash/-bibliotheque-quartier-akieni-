// Connexion PostgreSQL via un pool (réutilise les connexions, plus performant
// que d'en ouvrir une nouvelle à chaque requête)
require("dotenv").config();
const { Pool } = require("pg");

// Connexion PostgreSQL via un pool (réutilise les connexions, plus performant
// que d'en ouvrir une nouvelle à chaque requête)
require("dotenv").config();
const { Pool } = require("pg");

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Indispensable pour la connexion entre Render et Neon
      },
    })
  : new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

pool.on("error", (err) => {
  console.error("Erreur inattendue sur le pool PostgreSQL :", err);
});

module.exports = pool;

pool.on("error", (err) => {
  console.error("Erreur inattendue sur le pool PostgreSQL :", err);
});

module.exports = pool;
