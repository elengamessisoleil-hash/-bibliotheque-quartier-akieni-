/* ============================================================
   emprunts.js — formulaire de création d'un emprunt. La vue
   complète (emprunts en cours / en retard, retour d'un livre)
   arrivera dans une prochaine étape du projet.
   ============================================================ */

async function rafraichirSelecteurAdherents() {
  const select = document.getElementById("emprunt-adherent");
  if (!select) return;

  try {
    const adherents = await getAdherents();
    select.innerHTML =
      `<option value="">— Choisir un adhérent —</option>` +
      adherents.map((a) => `<option value="${a.id}">${escapeHtml(a.nom)}</option>`).join("");
  } catch (erreur) {
    select.innerHTML = `<option value="">Impossible de charger les adhérents</option>`;
  }
}

/**
 * Ne propose que les livres actuellement disponibles — inutile de
 * laisser choisir un livre déjà emprunté, autant guider l'utilisateur
 * avant même l'envoi du formulaire.
 */
async function rafraichirSelecteurLivresDisponibles() {
  const select = document.getElementById("emprunt-livre");
  if (!select) return;

  try {
    const { livres } = await getLivres({ limite: 100 });
    const disponibles = livres.filter((livre) => livre.disponible);

    if (disponibles.length === 0) {
      select.innerHTML = `<option value="">Aucun livre disponible actuellement</option>`;
      return;
    }

    select.innerHTML =
      `<option value="">— Choisir un livre —</option>` +
      disponibles.map((l) => `<option value="${l.id}">${escapeHtml(l.titre)} (${escapeHtml(l.auteur_nom)})</option>`).join("");
  } catch (erreur) {
    select.innerHTML = `<option value="">Impossible de charger les livres</option>`;
  }
}

function initFormulaireEmprunt() {
  const form = document.getElementById("form-emprunt");
  const messageBox = document.getElementById("form-emprunt-message");

  form.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "form-message";

    const adherent_id = form.adherent_id.value;
    const livre_id = form.livre_id.value;
    const date_retour_prevue = form.date_retour_prevue.value;

    if (!adherent_id || !livre_id) {
      messageBox.textContent = "Choisis un adhérent et un livre avant d'enregistrer l'emprunt.";
      messageBox.className = "form-message form-message--error";
      return;
    }

    try {
      await creerEmprunt({ adherent_id, livre_id, date_retour_prevue });
      messageBox.textContent = "Emprunt enregistré avec succès.";
      messageBox.className = "form-message form-message--success";
      form.reset();
      // Le livre qui vient d'être emprunté ne doit plus apparaître
      // comme disponible, ni dans ce formulaire ni dans la liste des livres.
      await rafraichirSelecteurLivresDisponibles();
      if (typeof chargerLivres === "function") await chargerLivres();
      await chargerEmprunts();
    } catch (erreur) {
      // C'est ici qu'apparaît, par exemple, le message 409 du backend
      // quand le livre a été pris entre-temps par quelqu'un d'autre.
      messageBox.textContent = erreur.message;
      messageBox.className = "form-message form-message--error";
    }
  });
}

/* ---------------- Vue emprunts en cours / en retard ---------------- */

function rendreLigneEmprunt(emprunt, estEnRetard) {
  return `
    <div class="ledger-row ${estEnRetard ? "ledger-row--retard" : ""}">
      <div class="ledger-row__main">
        <p class="ledger-row__title">${escapeHtml(emprunt.livre_titre)}</p>
        <p class="ledger-row__meta">
          ${escapeHtml(emprunt.adherent_nom)} · retour prévu le
          ${new Date(emprunt.date_retour_prevue).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <div class="ledger-row__side">
        <span class="badge ${estEnRetard ? "badge--retard" : "badge--en-cours"}">
          ${estEnRetard ? "En retard" : "En cours"}
        </span>
        <button class="btn btn--ghost btn--small" data-retour-emprunt="${emprunt.id}">
          Marquer le retour
        </button>
      </div>
    </div>
  `;
}

async function chargerEmprunts() {
  const conteneur = document.getElementById("emprunts-liste");
  if (!conteneur) return;
  conteneur.innerHTML = `<p class="ledger__loading">Chargement des emprunts…</p>`;

  try {
    const [enCours, enRetard] = await Promise.all([getEmpruntsEnCours(), getEmpruntsEnRetard()]);

    if (enCours.length === 0) {
      conteneur.innerHTML = `<p class="ledger__empty">Aucun emprunt en cours pour l'instant.</p>`;
      return;
    }

    const idsEnRetard = new Set(enRetard.map((e) => e.id));
    conteneur.innerHTML = enCours
      .map((emprunt) => rendreLigneEmprunt(emprunt, idsEnRetard.has(emprunt.id)))
      .join("");
  } catch (erreur) {
    conteneur.innerHTML = `<p class="ledger__error">Impossible de charger les emprunts : ${escapeHtml(erreur.message)}</p>`;
  }
}

/**
 * Délégation d'événement : un seul écouteur sur le conteneur, plutôt
 * qu'un écouteur par bouton "Marquer le retour" (qui changent à chaque
 * rechargement de la liste).
 */
function initRetourEmprunt() {
  const conteneur = document.getElementById("emprunts-liste");
  if (!conteneur) return;

  conteneur.addEventListener("click", async (evenement) => {
    const bouton = evenement.target.closest("[data-retour-emprunt]");
    if (!bouton) return;

    const id = bouton.dataset.retourEmprunt;
    bouton.disabled = true;
    bouton.textContent = "…";

    try {
      await marquerRetour(id);
      await chargerEmprunts();
      await rafraichirSelecteurLivresDisponibles();
      if (typeof chargerLivres === "function") await chargerLivres();
    } catch (erreur) {
      alert(`Impossible de marquer le retour : ${erreur.message}`);
      bouton.disabled = false;
      bouton.textContent = "Marquer le retour";
    }
  });
}
