fetch("http://localhost:5678/api/works")

  // une fois la réponse reçue, on la transforme en JSON 
  .then(response => response.json())

  .then(works => {

    // création du conteneur pour les boutons de filtres
    const portfolio = document.querySelector("#portfolio"); 
    const filtersDiv = document.createElement("div");       
    filtersDiv.className = "filters";                       
    filtersDiv.id = "filters";                              
    portfolio.insertBefore(filtersDiv, document.querySelector(".gallery")); 

    // appel a la fonction pour le bouton filtre "tous"
    createAllButton(filtersDiv);

    // récupération des catégories uniques à partir des projets
    const categoriesSet = new Set(); 
    works.forEach(work => {
      if (work.category && work.category.name) {
        categoriesSet.add(work.category.name); // ajoute le nom de la catégorie
      }
    });

    // création d’un bouton pour chaque catégorie
    categoriesSet.forEach(catName => {
      const btn = document.createElement("button");  
      btn.innerText = catName;                        
      btn.dataset.category = catName;                 
      filtersDiv.appendChild(btn);                    
    });

    // appel de la fonction pour gerer le filtrage
    createFiltersButtons();

    // appel de la fonction pour afficher nos images et legendes
    displayGalery(works);




    // si l'utlisateur est connecter alors on affiche la banniere et le bouton modifier
    if (localStorage.getItem('token')) {

      // bannière mode édition
      const banner = document.querySelector(".banner");
      banner.id = 'admin-banner';                        
      banner.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mode édition';

      // supprime les boutons de filtres
      const filterButtons = document.getElementById("filters");
      filterButtons.remove();

      // rend visible le bouton modifier
      const editBtn = document.getElementById("edit-projects-btn");
      if (editBtn) {
        editBtn.style.display = "inline-flex"; // affiche le bouton modifier
        editBtn.addEventListener("click", () => {
          openModal(); // fonction définie dans modal.js
        });
      }
    }
  })


  // Si l’appel à l’API échoue, on affiche une erreur dans la console
  .catch(err => console.error("Erreur lors de la récupération des données :", err));



// fonction pour créer le bouton "Tous"
function createAllButton(filtersDiv) {
  const btnAll = document.createElement("button");   
  btnAll.innerText = "Tous";                         
  btnAll.dataset.category = "all";                   
  btnAll.classList.add("active");                    
  filtersDiv.appendChild(btnAll);                   
}


// fonction pour gérer le filtrage par categories
function createFiltersButtons() {
  const filterButtons = document.querySelectorAll(".filters button"); // récupère tous les boutons

  filterButtons.forEach(button => {
    button.addEventListener("click", () => { 

      // change le bouton actif 
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // récupère la catégorie choisie
      const selectedCategory = button.dataset.category;

      // récupère toutes les images
      const figures = document.querySelectorAll(".gallery figure");

      // affiche ou masque les projets selon leur catégorie
      figures.forEach(fig => {
        if (selectedCategory === "all") {
          fig.style.display = ""; // affiche tous les projets
        } else {
          if (fig.dataset.category !== selectedCategory) {
            fig.style.display = "none"; //masque ceux d'autres catégories
          } else {
            fig.style.display = "";     // affiche ceux de la bonne catégorie
          }
        }
      });
    });
  });
}

// fonction qui affiche les projets dans la galerie
function displayGalery(works) {
  
  const gallery = document.querySelector(".gallery");

  // parcourt chaque élément du tableau works
  works.forEach(work => {

    const figure = document.createElement("figure");

    const img = document.createElement("img");

    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;

    img.alt = work.title;

    caption.innerText = work.title;

    figure.appendChild(img);

    figure.appendChild(caption);

    if (work.category && work.category.name) {
      figure.dataset.category = work.category.name; 
    }

    // ajoute la figure complète image et légende à la galerie dans le HTML
    gallery.appendChild(figure);
  });
}
