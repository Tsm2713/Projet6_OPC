// =======================
// MODAL DYNAMIQUE AVEC GALERIE ET SUPPRESSION
// =======================

// Fonction pour fermer la modale proprement
function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  }
  
  // Fonction d'ouverture de la modale
  function openModal() {
    // Ferme toute modale déjà présente avant d’en ouvrir une nouvelle
    closeModal();
  
    // Crée l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
  
    // Crée la boîte modale
    const modal = document.createElement('div');
    modal.className = 'modal-content';
  
    // Bouton croix
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.innerHTML = '&times;';
  
    // Titre
    const title = document.createElement('h3');
    title.innerText = 'Galerie photo';
    title.className = 'modal-title';
  
    // Galerie (sera remplie dynamiquement)
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'modal-gallery';
  
    // Séparateur
    const hr = document.createElement('hr');
    hr.className = 'modal-separator';
  
    // Bouton “Ajouter une photo”
    const addBtn = document.createElement('button');
    addBtn.className = 'add-photo';
    addBtn.innerText = 'Ajouter une photo';
  
    // Construction du DOM
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(galleryContainer);
    modal.appendChild(hr);
    modal.appendChild(addBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    // Affiche la galerie dynamique à l'ouverture
    loadModalGallery(galleryContainer);
  
    // Gestion fermeture modale
    function onClose() {
      closeModal();
      closeBtn.removeEventListener('click', onClose);
      overlay.removeEventListener('click', onOverlayClick);
    }
    function onOverlayClick(e) {
      if (e.target === overlay) onClose();
    }
    closeBtn.addEventListener('click', onClose);
    overlay.addEventListener('click', onOverlayClick);
  }
  
  // =======
  // Galerie dynamique + suppression
  // =======
  function loadModalGallery(galleryContainer) {
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(works => {
        galleryContainer.innerHTML = "";  // vide le conteneur
  
        works.forEach(work => {
          // Création du bloc figure
          const figure = document.createElement("figure");
          figure.style.position = "relative";
  
          // Image
          const img = document.createElement("img");
          img.src = work.imageUrl;
          img.alt = work.title;
  
          // Corbeille
          const trashIcon = document.createElement("i");
          trashIcon.className = "fa-solid fa-trash-can trash-icon";
          trashIcon.dataset.id = work.id;
    
          // Suppression au clic sur la corbeille
          trashIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            const workId = this.dataset.id;
            const token = localStorage.getItem("token");
            if (!token) {
              alert("Vous devez être connecté pour supprimer une photo.");
              return;
            }
            if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
              fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              })
                .then(res => {
                  if (res.ok) {
                    figure.remove();
                    // (optionnel) : retire de la galerie principale si affichée
                    const mainGalleryImg = document.querySelector(`.gallery img[src="${img.src}"]`);
                    if (mainGalleryImg && mainGalleryImg.closest("figure")) {
                      mainGalleryImg.closest("figure").remove();
                    }
                  } else {
                    alert("Suppression échouée.");
                  }
                })
                .catch(() => alert("Erreur serveur ou réseau."));
            }
          });
  
          // Ajout dans le DOM
          figure.appendChild(img);
          figure.appendChild(trashIcon);
          galleryContainer.appendChild(figure);
        });
      })
      .catch(() => {
        galleryContainer.innerHTML = "<p>Erreur lors du chargement de la galerie.</p>";
      });
  }
  
  // Liaison bouton "modifier"
  document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.getElementById("edit-projects-btn");
    if (editBtn) {
      editBtn.addEventListener("click", openModal);
    }
  });
  
  