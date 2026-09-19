/* ============================================================
   adherents.js — même principe que livres.js, appliqué aux
   adhérents. Affichage en lecture seule pour l'instant.
   ============================================================ */

function rendreLigneAdherent(adherent) {
  return `
    <div class="ledger-row">
      <div class="ledger-row__main">
        <p class="ledger-row__title">${escapeHtml(adherent.nom)}</p>
        <p class="ledger-row__meta">${escapeHtml(adherent.contact)}</p>
      </div>
    </div>
  `;
}

async function chargerAdherents() {
  const conteneur = document.getElementById("adherents-liste");
  conteneur.innerHTML = `<p class="ledger__loading">Chargement des adhérents…</p>`;

  try {
    const adherents = await getAdherents();

    if (adherents.length === 0) {
      conteneur.innerHTML = `<p class="ledger__empty">Aucun adhérent inscrit pour l'instant.</p>`;
      return;
    }

    conteneur.innerHTML = adherents.map(rendreLigneAdherent).join("");
  } catch (erreur) {
    conteneur.innerHTML = `<p class="ledger__error">Impossible de charger les adhérents : ${escapeHtml(erreur.message)}</p>`;
  }
}

function initFormulaireAdherent() {
  const form = document.getElementById("form-adherent");
  const messageBox = document.getElementById("form-adherent-message");

  form.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "form-message";

    const nom = form.nom.value.trim();
    const contact = form.contact.value.trim();

    try {
      await creerAdherent({ nom, contact });
      messageBox.textContent = "Adhérent ajouté avec succès.";
      messageBox.className = "form-message form-message--success";
      form.reset();
      await chargerAdherents();
      if (typeof rafraichirSelecteurAdherents === "function") {
        rafraichirSelecteurAdherents();
      }
    } catch (erreur) {
      messageBox.textContent = erreur.message;
      messageBox.className = "form-message form-message--error";
    }
  });
}
