document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("edit-projects-btn");
    if (editBtn) {
        editBtn.addEventListener("click", openModal);
    }
});

function openModal() {
    closeModal();

    const overlay = createOverlay();
    const modal = createModalContent();

    const closeBtn = createCloseButton(() => closeModal());
    const backBtn = createBackButton();
    const title = createTitle("Galerie photo");
    const galleryContainer = createGalleryContainer();
    const hr = createSeparator();
    const addBtn = createAddButton();

    modal.append(closeBtn, backBtn, title, galleryContainer, hr, addBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    loadModalGallery(galleryContainer);

    addBtn.addEventListener("click", () => {
        title.innerText = "Ajout photo";
        galleryContainer.style.display = hr.style.display = addBtn.style.display = 'none';
        backBtn.style.display = 'block';
        showAddPhotoForm({ modal, title, galleryContainer, hr, addBtn, backBtn });
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    return overlay;
}

function createModalContent() {
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    return modal;
}

function createCloseButton(callback) {
    const btn = document.createElement('button');
    btn.className = 'close-modal';
    btn.setAttribute('aria-label', 'Fermer');
    btn.innerHTML = '&times;';
    btn.addEventListener('click', callback);
    return btn;
}

function createBackButton() {
    const btn = document.createElement('button');
    btn.className = 'back-button';
    btn.setAttribute('aria-label', 'Retour');
    btn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    btn.style.display = 'none';
    return btn;
}

function createTitle(text) {
    const title = document.createElement('h3');
    title.className = 'modal-title';
    title.innerText = text;
    return title;
}

function createGalleryContainer() {
    const div = document.createElement('div');
    div.className = 'modal-gallery';
    return div;
}

function createSeparator() {
    const hr = document.createElement('hr');
    hr.className = 'modal-separator';
    return hr;
}

function createAddButton() {
    const btn = document.createElement('button');
    btn.className = 'add-photo';
    btn.innerText = 'Ajouter une photo';
    return btn;
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
}

function updateMainGallery() {
    fetch("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(works => {
            const mainGallery = document.querySelector(".gallery");
            if (!mainGallery) return;
            mainGallery.innerHTML = "";
            works.forEach(work => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                img.src = work.imageUrl;
                img.alt = work.title;
                const caption = document.createElement("figcaption");
                caption.innerText = work.title;
                figure.append(img, caption);
                mainGallery.appendChild(figure);
            });
        });
}

function loadModalGallery(galleryContainer) {
    fetch("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(works => {
            galleryContainer.innerHTML = "";
            works.forEach(work => {
                const figure = document.createElement("figure");
                figure.style.position = "relative";

                const img = document.createElement("img");
                img.src = work.imageUrl;
                img.alt = work.title;

                const trashIcon = document.createElement("i");
                trashIcon.className = "fa-solid fa-trash-can trash-icon";
                trashIcon.dataset.id = work.id;
                trashIcon.addEventListener("click", () => handleDelete(work.id, figure, galleryContainer));

                figure.append(img, trashIcon);
                galleryContainer.appendChild(figure);
            });
        })
        .catch(() => {
            galleryContainer.innerHTML = "<p>Erreur lors du chargement de la galerie.</p>";
        });
}

function handleDelete(workId, figure, galleryContainer) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vous devez être connecté pour supprimer une photo.");
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.ok) {
            figure.remove();
            updateMainGallery();
            loadModalGallery(galleryContainer);
        } else {
            alert("Suppression échouée.");
        }
    })
    .catch(() => alert("Erreur serveur ou réseau."));
}

function showAddPhotoForm({ modal, title, galleryContainer, hr, addBtn, backBtn }) {

    const formContainer = document.createElement('div');
    formContainer.className = 'modal-add-container';
    modal.appendChild(formContainer);

    const form = document.createElement('form');
    form.id = 'add-work-form';
    formContainer.appendChild(form);

    const imageUpload = document.createElement('div');
    imageUpload.className = 'image-upload';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'photo-input';
    fileInput.name = 'image';
    fileInput.style.display = 'none';

    const imageLabel = document.createElement('label');
    imageLabel.setAttribute('for', 'photo-input');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-image placeholder-icon';
    imageLabel.appendChild(icon);

    const addPhotoText = document.createElement('span');
    addPhotoText.className = 'image-upload-btn';
    addPhotoText.textContent = '+ Ajouter photo';
    imageLabel.appendChild(addPhotoText);

    const infoText = document.createElement('p');
    infoText.className = 'image-hint';
    infoText.innerText = 'jpg, png : 4mo max';
    imageLabel.appendChild(infoText);

    imageUpload.appendChild(imageLabel);
    imageUpload.appendChild(fileInput);
    form.appendChild(imageUpload);

    const titleLabel = document.createElement('label');
    titleLabel.innerText = 'Titre';
    titleLabel.className = 'form-label';
    form.appendChild(titleLabel);
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    form.appendChild(titleInput);

    const catLabel = document.createElement('label');
    catLabel.innerText = 'Catégorie';
    catLabel.className = 'form-label';
    form.appendChild(catLabel);
    const catSelect = document.createElement('select');
    catSelect.name = 'category';
    form.appendChild(catSelect);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choisir une catégorie';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    catSelect.appendChild(defaultOption);

    fetch('http://localhost:5678/api/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.innerText = cat.name;
                catSelect.appendChild(option);
            });
        });

    const hr2 = document.createElement('hr');
    hr2.className = 'modal-separator2';
    form.appendChild(hr2);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Valider';
    submitBtn.className = 'submit-btn';
    submitBtn.disabled = true;
    form.appendChild(submitBtn);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    form.appendChild(errorDiv);

    function updateSubmitState() {
        const valid = fileInput.files.length > 0 && titleInput.value.trim() && catSelect.value;
        submitBtn.disabled = !valid;
    }

    fileInput.addEventListener('change', function () {
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageUpload.innerHTML = '';
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.className = 'image-preview';
                imageUpload.appendChild(imgPreview);
                imageUpload.appendChild(fileInput);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
        updateSubmitState();
    });

    titleInput.addEventListener('input', updateSubmitState);
    catSelect.addEventListener('change', updateSubmitState);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.textContent = '';

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vous devez être connecté pour ajouter un projet.");
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value.trim());
        formData.append('category', catSelect.value);

        try {
            const res = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error("Erreur lors de l'ajout du projet.");
            await res.json();

            form.reset();
            formContainer.remove();
            title.innerText = 'Galerie photo';
            galleryContainer.style.display = '';
            hr.style.display = '';
            addBtn.style.display = '';
            backBtn.style.display = 'none';
            updateMainGallery();
            loadModalGallery(galleryContainer);
        } catch (err) {
            errorDiv.textContent = err.message || 'Erreur serveur.';
        }
    });

    backBtn.addEventListener('click', () => {
        formContainer.remove();
        title.innerText = 'Galerie photo';
        galleryContainer.style.display = '';
        hr.style.display = '';
        addBtn.style.display = '';
        backBtn.style.display = 'none';
    });
}