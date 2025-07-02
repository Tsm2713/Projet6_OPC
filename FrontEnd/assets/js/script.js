fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    const portfolio = document.querySelector("#portfolio");
    const filtersDiv = document.createElement("div");
    filtersDiv.className = "filters"; 
    filtersDiv.id = "filters";
    portfolio.insertBefore(filtersDiv, document.querySelector(".gallery"));

    createAllButton(filtersDiv)
    const categoriesSet = new Set();
    works.forEach(work => {
      if (work.category && work.category.name) {
        categoriesSet.add(work.category.name);
      }
    });

    categoriesSet.forEach(catName => {
      const btn = document.createElement("button");
      btn.innerText = catName;
      btn.dataset.category = catName;  
      filtersDiv.appendChild(btn);
    });

    createFiltersButtons();
     
    displayGalery(works)
if (localStorage.getItem('token')) {
  const banner = document.querySelector(".banner");
  banner.id = 'admin-banner';                        
  banner.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mode édition';
  const filterButtons = document.getElementById("filters");
  filterButtons.remove()
   const editBtn = document.getElementById("edit-projects-btn");
   if (editBtn) {
       editBtn.style.display = "inline-flex";
       editBtn.addEventListener("click", () => {
           openModal();
       });
   }
}
  })
  .catch(err => console.error("Erreur lors de la récupération des works :", err));
function createAllButton(filtersDiv) {
  const btnAll = document.createElement("button");
  btnAll.innerText = "Tous";
  btnAll.dataset.category = "all";      
  btnAll.classList.add("active");       
  filtersDiv.appendChild(btnAll);
}
  
function createFiltersButtons(){
    const filterButtons = document.querySelectorAll(".filters button");
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const selectedCategory = button.dataset.category;
        const figures = document.querySelectorAll(".gallery figure");
        figures.forEach(fig => {
          if (selectedCategory === "all") {
            fig.style.display = "";  
          } else {
            if (fig.dataset.category !== selectedCategory) {
              fig.style.display = "none";  
            } else {
              fig.style.display = "";
            }
          }
        });
      });
    });
}
 function displayGalery(works){
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
      if (work.category && work.category.name) {
        figure.dataset.category = work.category.name;
      }
      gallery.appendChild(figure);
    });
 }