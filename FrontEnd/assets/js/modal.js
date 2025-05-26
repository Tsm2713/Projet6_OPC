// Fonction d'ouverture de la modale
function openModal() {

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


    // Gestion du clic "Ajouter une photo" pour afficher le formulaire
    addBtn.addEventListener('click', () => {
        // Masquer la galerie et le bouton
        title.innerText = 'Ajout photo';
        galleryContainer.style.display = 'none';
        hr.style.display = 'none';
        addBtn.style.display = 'none';

        // Création du conteneur de formulaire
        const formContainer = document.createElement('div');
        formContainer.className = 'modal-add-container';
        modal.appendChild(formContainer);

        // Création du formulaire d'ajout
        const form = document.createElement('form');
        form.id = 'add-work-form';
        formContainer.appendChild(form);

        // Champ image (input file)
        const imgLabel = document.createElement('label');
        imgLabel.setAttribute('for', 'imageInput');
        form.appendChild(imgLabel);
        const imgInput = document.createElement('input');
        imgInput.type = 'file';
        imgInput.accept = 'image/*';
        imgInput.id = 'imageInput';
        imgInput.name = 'image';
        form.appendChild(imgInput);
        

        // Champ titre (input text)
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'titleInput');
        titleLabel.innerText = 'Titre';
        form.appendChild(titleLabel);
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'titleInput';
        titleInput.name = 'title';
        form.appendChild(titleInput);

        // Champ catégorie (select)
        const catLabel = document.createElement('label');
        catLabel.setAttribute('for', 'categorySelect');
        catLabel.innerText = 'Catégorie';
        form.appendChild(catLabel);
        const catSelect = document.createElement('select');
        catSelect.id = 'categorySelect';
        catSelect.name = 'category';
        form.appendChild(catSelect);

        // Remplir le select avec les catégories via l'API
        fetch('http://localhost:5678/api/categories')
            .then(res => res.json())
            .then(categories => {
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.innerText = cat.name;
                    catSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Erreur chargement catégories', err));

        // Bouton "Valider"
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.innerText = 'Valider';
        submitBtn.className = 'submit-btn';
        form.appendChild(submitBtn);

        // Div pour message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        form.appendChild(errorDiv);

        // Gestion de l'envoi du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.textContent = '';

            // Vérification des champs
            if (!imgInput.files[0] || !titleInput.value.trim() || !catSelect.value) {
                errorDiv.textContent = 'Veuillez remplir tous les champs.';
                return;
            }
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Vous devez être connecté pour ajouter un projet.");
                return;
            }
            // Préparation des données
            const formData = new FormData();
            formData.append('image', imgInput.files[0]);
            formData.append('title', titleInput.value.trim());
            formData.append('category', catSelect.value);

            // Envoi vers l'API
            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Erreur lors de l\'ajout du projet.');
                    }
                    return res.json();
                })
                .then(data => {
                    // Réinitialiser et revenir à la galerie
                    form.reset();
                    formContainer.remove();
                    title.innerText = 'Galerie photo';
                    galleryContainer.style.display = '';
                    hr.style.display = '';
                    addBtn.style.display = '';
                    // Recharger la galerie avec le nouveau projet
                    loadModalGallery(galleryContainer);
                })
                .catch(err => {
                    errorDiv.textContent = err.message || 'Erreur serveur.';
                    console.error(err);
                });
        });
    });

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
                                    // (optionnel) : retire de la galerie principale si affichée
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

// Fonction pour fermer la modale proprement
function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
}

function separator(){
    const hr = document.createElement('hr');
    hr.className = 'modal-separator';
}

