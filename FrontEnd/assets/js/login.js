// Récupération du formulaire de connexion
const form = document.querySelector('form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs du formulaire
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginData = {
    email: email,
    password: password
  };

  try {
    // Envoi de la requête POST à l'API
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();

      // Stockage du token dans le localStorage
      localStorage.setItem('token', data.token);

      // Mise à jour de l'UI dynamiquement sans recharger
      updateLoginLink();

      // Redirection éventuelle si nécessaire
      window.location.href = 'index.html';
    } else {
      // Affichage du message d'erreur si login invalide
      displayError('Email ou mot de passe incorrect.');
    }
  } catch (error) {
    console.error('Erreur réseau ou serveur :', error);
    displayError('Une erreur est survenue. Veuillez réessayer plus tard.');
  }
});

// Fonction d'affichage d'un message d'erreur
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

// Fonction de mise à jour du lien login/logout
function updateLoginLink() {
  const loginLink = document.getElementById('login-link');
  if (!loginLink) return;

  if (localStorage.getItem('token')) {
    loginLink.textContent = 'logout';
    loginLink.removeAttribute('href');
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      location.reload();
    });
  } else {
    loginLink.textContent = 'login';
    loginLink.setAttribute('href', 'login.html');
  }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', updateLoginLink);
