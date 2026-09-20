/* ============================================================
   api.js — toutes les fonctions qui parlent à l'API vivent ici.
   Aucune autre partie du frontend n'appelle fetch() directement :
   si l'URL de base change un jour, un seul fichier à modifier.
   ============================================================ */

const API_BASE = "http://localhost:3000/api";

/**
 * Enveloppe fetch() : parse toujours le JSON, et transforme une
 * réponse HTTP en erreur JS exploitable si le statut n'est pas 2xx.
 * Le message vient directement du champ "erreur" renvoyé par
 * errorHandler.middleware.js côté backend.
 */
async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data && data.erreur ? data.erreur : `Erreur ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// ---------------- Livres ----------------

function getLivres({ recherche = "", page = 1, limite = 10 } = {}) {
  const params = new URLSearchParams();
  if (recherche) params.set("recherche", recherche);
  params.set("page", page);
  params.set("limite", limite);
  return apiFetch(`/livres?${params.toString()}`);
}

function creerLivre(livre) {
  return apiFetch("/livres", { method: "POST", body: JSON.stringify(livre) });
}

function modifierLivre(id, livre) {
  return apiFetch(`/livres/${id}`, { method: "PUT", body: JSON.stringify(livre) });
}

function supprimerLivre(id) {
  return apiFetch(`/livres/${id}`, { method: "DELETE" });
}

// ---------------- Auteurs ----------------

function getAuteurs() {
  return apiFetch("/auteurs");
}

function creerAuteur(auteur) {
  return apiFetch("/auteurs", { method: "POST", body: JSON.stringify(auteur) });
}

// ---------------- Adhérents ----------------

function getAdherents() {
  return apiFetch("/adherents");
}

function getHistoriqueAdherent(id) {
  return apiFetch(`/adherents/${id}/emprunts`);
}

function creerAdherent(adherent) {
  return apiFetch("/adherents", { method: "POST", body: JSON.stringify(adherent) });
}

// ---------------- Emprunts ----------------

function creerEmprunt(emprunt) {
  return apiFetch("/emprunts", { method: "POST", body: JSON.stringify(emprunt) });
}

function marquerRetour(id) {
  return apiFetch(`/emprunts/${id}/retour`, { method: "PATCH" });
}

function getEmpruntsEnCours() {
  return apiFetch("/emprunts/en-cours");
}

function getEmpruntsEnRetard() {
  return apiFetch("/emprunts/en-retard");
}

// ---------------- Statistiques ----------------

function getStatistiques() {
  return apiFetch("/statistiques");
}
