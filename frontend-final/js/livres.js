/* ============================================================
   livres.js — récupère les livres via l'API et les affiche dans
   #livres-liste, avec recherche et pagination.
   ============================================================ */

// État de la vue livres — simple, gardé en mémoire côté client
const etatLivres = { recherche: "", page: 1, limite: 5 };

function rendreLigneLivre(livre) {
  const disponible = livre.disponible;
  return `
    <div class="ledger-row">
      <div class="ledger-row__main">
        <p class="ledger-row__title">${escapeHtml(livre.titre)}</p>
        <p class="ledger-row__meta">${escapeHtml(livre.auteur_nom)} · ${livre.annee_publication ?? "année inconnue"}</p>
      </div>
      <span class="badge ${disponible ? "badge--disponible" : "badge--emprunte"}">
        ${disponible ? "Disponible" : "Emprunté"}
      </span>
    </div>
  `;
}

function rendrePagination(total, page, limite) {
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const conteneur = document.getElementById("livres-pagination");
  if (!conteneur) return;

  conteneur.innerHTML = `
    <button class="btn btn--ghost btn--small" id="livres-page-precedente" ${page <= 1 ? "disabled" : ""}>← Précédent</button>
    <span>Page ${page} / ${totalPages} (${total} livre${total > 1 ? "s" : ""})</span>
    <button class="btn btn--ghost btn--small" id="livres-page-suivante" ${page >= totalPages ? "disabled" : ""}>Suivant →</button>
  `;

  document.getElementById("livres-page-precedente")?.addEventListener("click", () => {
    etatLivres.page -= 1;
    chargerLivres();
  });
  document.getElementById("livres-page-suivante")?.addEventListener("click", () => {
    etatLivres.page += 1;
    chargerLivres();
  });
}

async function chargerLivres() {
  const conteneur = document.getElementById("livres-liste");
  conteneur.innerHTML = `<p class="ledger__loading">Chargement des livres…</p>`;

  try {
    const { livres, total, page, limite } = await getLivres(etatLivres);

    if (livres.length === 0) {
      conteneur.innerHTML = etatLivres.recherche
        ? `<p class="ledger__empty">Aucun livre ne correspond à « ${escapeHtml(etatLivres.recherche)} ».</p>`
        : `<p class="ledger__empty">Aucun livre enregistré pour l'instant.</p>`;
      rendrePagination(total ?? 0, page ?? 1, limite ?? etatLivres.limite);
      return;
    }

    conteneur.innerHTML = livres.map(rendreLigneLivre).join("");
    rendrePagination(total, page, limite);
  } catch (erreur) {
    conteneur.innerHTML = `<p class="ledger__error">Impossible de charger les livres : ${escapeHtml(erreur.message)}</p>`;
  }
}

function initRechercheLivres() {
  const input = document.getElementById("livres-recherche");
  if (!input) return;

  let minuteur;
  input.addEventListener("input", () => {
    clearTimeout(minuteur);
    // Un petit délai après la dernière frappe évite d'envoyer une
    // requête à chaque lettre tapée.
    minuteur = setTimeout(() => {
      etatLivres.recherche = input.value.trim();
      etatLivres.page = 1;
      chargerLivres();
    }, 350);
  });
}

/**
 * Remplit le menu déroulant "Auteur" du formulaire d'ajout de livre.
 * Appelée au chargement, et de nouveau après l'ajout d'un nouvel
 * auteur ailleurs dans l'app, pour qu'il soit tout de suite proposable.
 */
async function rafraichirSelecteurAuteurs() {
  const select = document.getElementById("livre-auteur");
  if (!select) return;

  try {
    const auteurs = await getAuteurs();
    const valeurActuelle = select.value;
    select.innerHTML =
      `<option value="">— Choisir un auteur —</option>` +
      auteurs.map((a) => `<option value="${a.id}">${escapeHtml(a.nom)}</option>`).join("");
    if (valeurActuelle) select.value = valeurActuelle;
  } catch (erreur) {
    select.innerHTML = `<option value="">Impossible de charger les auteurs</option>`;
  }
}

function initFormulaireLivre() {
  const form = document.getElementById("form-livre");
  const messageBox = document.getElementById("form-livre-message");

  form.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "form-message";

    const titre = form.titre.value.trim();
    const annee_publication = form.annee_publication.value ? Number(form.annee_publication.value) : null;
    const auteur_id = form.auteur_id.value;

    if (!auteur_id) {
      messageBox.textContent = "Choisis un auteur avant d'enregistrer le livre.";
      messageBox.className = "form-message form-message--error";
      return;
    }

    try {
      await creerLivre({ titre, annee_publication, auteur_id });
      messageBox.textContent = "Livre ajouté avec succès.";
      messageBox.className = "form-message form-message--success";
      form.reset();
      await chargerLivres();
      // Le nouveau livre doit tout de suite être proposable dans le
      // formulaire "Nouvel emprunt".
      if (typeof rafraichirSelecteurLivresDisponibles === "function") {
        rafraichirSelecteurLivresDisponibles();
      }
    } catch (erreur) {
      messageBox.textContent = erreur.message;
      messageBox.className = "form-message form-message--error";
    }
  });
}
