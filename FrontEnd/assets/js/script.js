fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    // 1. Sélection du conteneur portfolio et création du menu de filtres
    const portfolio = document.querySelector("#portfolio");
    const filtersDiv = document.createElement("div");
    filtersDiv.className = "filters";
    portfolio.insertBefore(filtersDiv, document.querySelector(".gallery"));

    // appelle fonction bouton Tous (le bouton)
    createAllButton(filtersDiv)

    // 3. Récupération des catégories uniques depuis works
    const categoriesSet = new Set();
    works.forEach(work => {
      if (work.category && work.category.name) {
        categoriesSet.add(work.category.name);
      }
    });
    // 4. Création d’un bouton par catégorie unique
    categoriesSet.forEach(catName => {
      const btn = document.createElement("button");
      btn.innerText = catName;
      btn.dataset.category = catName;  // on stocke le nom de la catégorie dans le bouton
      filtersDiv.appendChild(btn);
    });

    // 5. Insérer les travaux dans la galerie comme déjà fait   InsertGallery
    const gallery = document.querySelector(".gallery");
    works.forEach(work => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");
      img.src = work.imageUrl;
      img.alt = work.title;
      caption.innerText = work.title;
      figure.appendChild(img);
      figure.appendChild(caption);
      // Associer la catégorie en data-attribute pour filtrage
      if (work.category && work.category.name) {
        figure.dataset.category = work.category.name;
      }
      gallery.appendChild(figure);
    });
    if (localStorage.getItem('token')) {
    // 6. Gestionnaires d’événement pour chaque bouton de filtre
    const filterButtons = document.querySelectorAll(".filters button");
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Mettre à jour l'état actif du bouton (optionnel)
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedCategory = button.dataset.category;
        const figures = document.querySelectorAll(".gallery figure");
        figures.forEach(fig => {
          if (selectedCategory === "all") {
            // Afficher tous les travaux
            fig.style.display = "";  // pas de style = visible par défaut
          } else {
            // Afficher seulement ceux de la catégorie choisie, masquer les autres
            if (fig.dataset.category !== selectedCategory) {
              fig.style.display = "none";  // masque l’élément
            } else {
              fig.style.display = "";
            }
          }
        });
      });

    });
  }
  })
  .catch(err => console.error("Erreur lors de la récupération des works :", err));

// Création du bouton "Tous"
function createAllButton(filtersDiv) {
  const btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.dataset.category = "all";      // marque ce bouton comme filtre "all"
  btnTous.classList.add("active");       // actif par défaut
  filtersDiv.appendChild(btnTous);
}

  

if (localStorage.getItem('token')) {
  // Création de la bannière admin
  const banner = document.querySelector(".banner");
  banner.id = 'admin-banner';                        
  banner.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mode édition';

    const filterButtons = document.getElementById("filters");

  filterButtons.remove()
}

