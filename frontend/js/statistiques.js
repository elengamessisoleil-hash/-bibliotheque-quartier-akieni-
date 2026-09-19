/* ============================================================
   statistiques.js — récupère et affiche le tableau de bord.
   ============================================================ */

function rendreTableauDeBord(stats) {
  const livrePlusEmprunte = stats.livre_plus_emprunte;
  const adherentPlusActif = stats.adherent_plus_actif;

  return `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card__number">${stats.total_livres}</div>
        <div class="stat-card__label">Livres au total</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__number">${stats.total_adherents}</div>
        <div class="stat-card__label">Adhérents</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__number">${stats.emprunts_en_cours}</div>
        <div class="stat-card__label">Emprunts en cours</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__number">${stats.emprunts_en_retard}</div>
        <div class="stat-card__label">Emprunts en retard</div>
      </div>
    </div>

    <div class="stat-highlights">
      <div class="stat-highlight">
        <p class="stat-highlight__label">Livre le plus emprunté</p>
        <p class="stat-highlight__value">
          ${livrePlusEmprunte ? `${escapeHtml(livrePlusEmprunte.titre)} (${livrePlusEmprunte.nombre_emprunts})` : "Aucune donnée pour l'instant"}
        </p>
      </div>
      <div class="stat-highlight">
        <p class="stat-highlight__label">Adhérent le plus actif</p>
        <p class="stat-highlight__value">
          ${adherentPlusActif ? `${escapeHtml(adherentPlusActif.nom)} (${adherentPlusActif.nombre_emprunts})` : "Aucune donnée pour l'instant"}
        </p>
      </div>
    </div>
  `;
}

async function chargerStatistiques() {
  const conteneur = document.getElementById("statistiques-contenu");
  if (!conteneur) return;
  conteneur.innerHTML = `<p class="ledger__loading">Chargement des statistiques…</p>`;

  try {
    const stats = await getStatistiques();
    conteneur.innerHTML = rendreTableauDeBord(stats);
  } catch (erreur) {
    conteneur.innerHTML = `<p class="ledger__error">Impossible de charger les statistiques : ${escapeHtml(erreur.message)}</p>`;
  }
}
