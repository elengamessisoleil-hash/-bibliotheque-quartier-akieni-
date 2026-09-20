/* ============================================================
   navigation.js — bascule quelle section <section> est visible
   quand on clique un lien de la barre de navigation. Rien ici
   ne recharge la page : c'est le principe d'une SPA simple.
   ============================================================ */

function afficherSection(nomSection) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.toggle("is-active", section.id === `section-${nomSection}`);
  });

  document.querySelectorAll(".navlink").forEach((lien) => {
    lien.classList.toggle("is-active", lien.dataset.section === nomSection);
  });

  // Le tableau de bord doit toujours montrer des chiffres à jour,
  // même si l'utilisateur y revient après avoir ajouté des données ailleurs.
  if (nomSection === "statistiques" && typeof chargerStatistiques === "function") {
    chargerStatistiques();
  }
}

function initNavigation() {
  document.querySelectorAll(".navlink").forEach((lien) => {
    lien.addEventListener("click", () => afficherSection(lien.dataset.section));
  });
}

/**
 * Gère les boutons "+ Ajouter" / "Annuler" qui ouvrent ou ferment
 * un panneau de formulaire. Un seul attribut data-toggle-form
 * relie le bouton à son panneau (#form-panel-<nom>).
 */
function initToggleFormulaires() {
  document.querySelectorAll("[data-toggle-form]").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const panneau = document.getElementById(`form-panel-${bouton.dataset.toggleForm}`);
      if (panneau) panneau.classList.toggle("is-open");
    });
  });
}
