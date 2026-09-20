/* ============================================================
   app.js — point d'entrée. Initialise la navigation et déclenche
   le premier chargement des données une fois le DOM prêt.
   ============================================================ */

/**
 * Échappe le HTML dans une chaîne avant de l'insérer dans le DOM.
 * Sans ça, un titre de livre ou un nom d'adhérent contenant
 * "<script>" pourrait s'exécuter dans la page (faille XSS).
 */
function escapeHtml(valeur) {
  const div = document.createElement("div");
  div.textContent = valeur ?? "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initToggleFormulaires();

  chargerLivres();
  chargerAuteurs();
  chargerAdherents();
  chargerEmprunts();

  initFormulaireLivre();
  initFormulaireAuteur();
  initFormulaireAdherent();
  initFormulaireEmprunt();
  initRetourEmprunt();
  initRechercheLivres();

  rafraichirSelecteurAuteurs();
  rafraichirSelecteurAdherents();
  rafraichirSelecteurLivresDisponibles();

  // Permet à la page d'accueil de renvoyer directement vers une section
  // précise (ex. index.html#emprunts) plutôt que toujours sur Livres.
  const sectionCiblee = window.location.hash.replace("#", "");
  if (sectionCiblee && document.getElementById(`section-${sectionCiblee}`)) {
    afficherSection(sectionCiblee);
  }
});
