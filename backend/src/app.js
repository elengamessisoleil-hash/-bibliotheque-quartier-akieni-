const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const auteursRoutes = require("./routes/auteurs.routes");
const adherentsRoutes = require("./routes/adherents.routes");
const livresRoutes = require("./routes/livres.routes");
const empruntsRoutes = require("./routes/emprunts.routes");
const statistiquesRoutes = require("./routes/statistiques.routes");

const app = express();

// Autorise le frontend (servi sur un autre port, ex. Live Server sur :5500)
// à appeler cette API. Sans ça, le navigateur bloque les requêtes fetch()
// par sécurité (politique CORS), même si Postman n'a jamais eu ce problème
// puisque Postman n'applique pas les règles CORS des navigateurs.
app.use(cors());

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ message: "API Bibliothèque de quartier — opérationnelle" });
});

app.use("/api/auteurs", auteursRoutes);
app.use("/api/adherents", adherentsRoutes);
app.use("/api/livres", livresRoutes);
app.use("/api/emprunts", empruntsRoutes);
app.use("/api/statistiques", statistiquesRoutes);

// Route inconnue -> 404 propre
app.use((req, res) => {
  res.status(404).json({ erreur: "Route non trouvée" });
});

// Middleware d'erreur : TOUJOURS en dernier
app.use(errorHandler);

module.exports = app;
