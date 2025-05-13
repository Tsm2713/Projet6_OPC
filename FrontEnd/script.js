fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {

        const gallery = document.querySelector(".gallery");  // sélectionne le conteneur de la galerie
        works.forEach(work => {
            // Créer les éléments HTML
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const caption = document.createElement("figcaption");

            // Renseigner les attributs et le contenu
            img.src = work.imageUrl;
            img.alt = work.title;               // texte alternatif de l’image
            caption.innerText = work.title;     // texte du figcaption = titre du projet

            // Assembler l'élément figure
            figure.appendChild(img);
            figure.appendChild(caption);

            // Injecter le figure dans la galerie
            gallery.appendChild(figure);
        });


    })
    .catch(error => console.error("Erreur lors de la récupération des travaux :", error));

