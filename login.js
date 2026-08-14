const firebaseConfig = {
  apiKey: "AIzaSyC8XNpPwDLJXPyTJLbQr5vfpXdA27YARvw",
  authDomain: "login-9bace.firebaseapp.com",
  projectId: "login-9bace",
  storageBucket: "login-9bace.firebasestorage.app",
  messagingSenderId: "750647370002",
  appId: "1:750647370002:web:340e7552852bf0e6d0d3cb",
  measurementId: "G-4CV1N6JHWY"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', () => {
  let isRegistering = false;

  const toggleBtn = document.getElementById('toggle-mode');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const submitBtn = document.getElementById('submit-btn');
  const googleSection = document.getElementById('google-section');
  const authForm = document.getElementById('auth-form');
  const confirmGroup = document.getElementById('confirm-group');
  const confirmPassword = document.getElementById('confirm-password');

  // Gestione cambio tra Accesso e Registrazione
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      isRegistering = !isRegistering;
      
      if (isRegistering) {
        if (formTitle) formTitle.textContent = 'Registrazione';
        if (formSubtitle) formSubtitle.textContent = 'Crea il tuo nuovo account';
        if (submitBtn) submitBtn.textContent = 'Registrati';
        toggleBtn.textContent = 'Hai già un account? Accedi';
        if (confirmGroup) confirmGroup.style.display = 'block';
        if (confirmPassword) confirmPassword.setAttribute('required', 'true');
        if (googleSection) googleSection.style.display = 'none';
      } else {
        if (formTitle) formTitle.textContent = 'Accesso';
        if (formSubtitle) formSubtitle.textContent = 'Entra per gestire il tuo spazio';
        if (submitBtn) submitBtn.textContent = 'Accedi';
        toggleBtn.textContent = "Non hai un account? Registrati";
        if (confirmGroup) confirmGroup.style.display = 'none';
        if (confirmPassword) confirmPassword.removeAttribute('required');
        if (googleSection) googleSection.style.display = 'block';
      }
    });
  }

  // Invio Form (Login o Registrazione manuale via Firebase)
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        if (isRegistering) {
          const confirmVal = confirmPassword ? confirmPassword.value : '';
          if (password !== confirmVal) {
            alert('Le password non coincidono.');
            return;
          }
          await firebase.auth().createUserWithEmailAndPassword(email, password);
          alert('Registrazione completata con successo! Ora puoi effettuare il login.');
          if (toggleBtn) toggleBtn.click(); // Ritorna alla schermata di accesso
        } else {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', userCredential.user.email);
          window.location.href = 'index.html';
        }
      } catch (error) {
        alert('Errore: ' + error.message);
      }
    });
  }
});

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Nascondi';
  } else {
    input.type = 'password';
    btn.textContent = 'Mostra';
  }
}

// Accesso rapido con Google
function googleLogin() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', result.user.email);
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error("Errore Google Login:", error);
        alert('Errore Google Login: ' + error.message);
      });
  }
}