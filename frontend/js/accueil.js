/* ============================================================
   accueil.js — remplit les tuiles de la grille bento avec les
   vraies statistiques de l'API, plutôt que des chiffres inventés.
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const stats = await getStatistiques();

    document.getElementById("stat-livres").textContent = stats.total_livres;
    document.getElementById("stat-adherents").textContent = stats.total_adherents;
    document.getElementById("stat-en-cours").textContent = stats.emprunts_en_cours;
    document.getElementById("stat-en-retard").textContent = stats.emprunts_en_retard;
  } catch (erreur) {
    // Si l'API n'est pas démarrée, la page d'accueil reste consultable :
    // on affiche juste un tiret plutôt qu'un chiffre.
    ["stat-livres", "stat-adherents", "stat-en-cours", "stat-en-retard"].forEach((id) => {
      document.getElementById(id).textContent = "—";
    });
  }
});
