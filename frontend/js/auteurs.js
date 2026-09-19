/* ============================================================
   auteurs.js — liste des auteurs + formulaire d'ajout.
   ============================================================ */

function rendreLigneAuteur(auteur) {
  return `
    <div class="ledger-row">
      <div class="ledger-row__main">
        <p class="ledger-row__title">${escapeHtml(auteur.nom)}</p>
        <p class="ledger-row__meta">${escapeHtml(auteur.nationalite || "Nationalité non renseignée")}</p>
      </div>
    </div>
  `;
}

async function chargerAuteurs() {
  const conteneur = document.getElementById("auteurs-liste");
  conteneur.innerHTML = `<p class="ledger__loading">Chargement des auteurs…</p>`;

  try {
    const auteurs = await getAuteurs();

    if (auteurs.length === 0) {
      conteneur.innerHTML = `<p class="ledger__empty">Aucun auteur enregistré pour l'instant.</p>`;
      return;
    }

    conteneur.innerHTML = auteurs.map(rendreLigneAuteur).join("");
  } catch (erreur) {
    conteneur.innerHTML = `<p class="ledger__error">Impossible de charger les auteurs : ${escapeHtml(erreur.message)}</p>`;
  }
}

function initFormulaireAuteur() {
  const form = document.getElementById("form-auteur");
  const messageBox = document.getElementById("form-auteur-message");

  form.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "form-message";

    const nom = form.nom.value.trim();
    const nationalite = form.nationalite.value.trim();

    try {
      await creerAuteur({ nom, nationalite });
      messageBox.textContent = "Auteur ajouté avec succès.";
      messageBox.className = "form-message form-message--success";
      form.reset();
      await chargerAuteurs();
      // Un nouvel auteur doit être proposable immédiatement dans le
      // formulaire "Ajouter un livre" (menu déroulant des auteurs).
      if (typeof rafraichirSelecteurAuteurs === "function") {
        rafraichirSelecteurAuteurs();
      }
    } catch (erreur) {
      messageBox.textContent = erreur.message;
      messageBox.className = "form-message form-message--error";
    }
  });
}
