const form = document.querySelector('form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault(); // empêche le rechargement automatique de la page lors de la soumission

  // récupération des valeurs saisies par l'utilisateur
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Création d’un objet contenant les données de connexion à envoyer
  const loginData = {
    email: email,
    password: password
  };

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'     // envoie des données JSON
      },
      body: JSON.stringify(loginData)          // Convertit l’objet JS en JSON pour l’envoi
    });

    if (response.ok) {
      const data = await response.json();         // récupère la réponse contenant le token

      localStorage.setItem('token', data.token);  // stocke le token dans le localStorage

      updateLoginLink();

      window.location.href = 'index.html';
    } else {

      displayError('Email ou mot de passe incorrect.');
    }
  } catch (error) { //sert à afficher un message d'erreur au cas où il y a un problème avec le try
    console.error('Erreur réseau ou serveur :', error);
    displayError('Une erreur est survenue. Veuillez réessayer plus tard.');
  }
});

// fonction d'affichage d'un message d’erreur
function displayError(message) {
  let errorElement = document.getElementById('error-message');

  if (!errorElement) {
    errorElement = document.createElement('p');
    errorElement.id = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '10px';
    form.appendChild(errorElement);
  }

  errorElement.innerText = message;
  errorElement.style.display = 'block';
}


function updateLoginLink() {
  const loginLink = document.getElementById('login-link');
  if (!loginLink) return;                                  // Si pas trouvé, on arrête

  if (localStorage.getItem('token')) {
    //  Si l'utilisateur est connecté 
    loginLink.textContent = 'logout';
    loginLink.removeAttribute('href');
    loginLink.addEventListener('click', (e) => {          // si l'utilisateur clique sur logout
      e.preventDefault();
      localStorage.removeItem('token');                    // supprime le token 
      location.reload();                                   // recharge la page pour revenir à l'état non connecté
    });
  } else {
    loginLink.textContent = 'login';
    loginLink.setAttribute('href', 'login.html');          // Lien vers la page de connexion
  }
}

// Exécute updateLoginLink des que tout le dom à était charger
document.addEventListener('DOMContentLoaded', updateLoginLink);
