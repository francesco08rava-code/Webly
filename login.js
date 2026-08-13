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

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      isRegistering = !isRegistering;
      
      if (isRegistering) {
        if (formTitle) formTitle.textContent = 'Registrazione';
        if (formSubtitle) formSubtitle.textContent = 'Crea un nuovo account';
        if (submitBtn) submitBtn.textContent = 'Registrati';
        toggleBtn.textContent = 'Hai già un account? Accedi';
        if (googleSection) googleSection.style.display = 'none';
        if (confirmGroup) confirmGroup.style.display = 'block';
        if (confirmPassword) confirmPassword.setAttribute('required', 'true');
      } else {
        if (formTitle) formTitle.textContent = 'Accesso';
        if (formSubtitle) formSubtitle.textContent = 'Entra per gestire il tuo spazio';
        if (submitBtn) submitBtn.textContent = 'Accedi';
        toggleBtn.textContent = 'Non hai un account? Registrati';
        if (googleSection) googleSection.style.display = 'block';
        if (confirmGroup) confirmGroup.style.display = 'none';
        if (confirmPassword) confirmPassword.removeAttribute('required');
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;

      if (isRegistering) {
        if (confirmPassword && password !== confirmPassword.value) {
          alert('Le password non coincidono.');
          return;
        }
        localStorage.setItem('regEmail', email);
        localStorage.setItem('regPassword', password);
        alert('Registrazione completata! Ora puoi effettuare il login.');
        if (toggleBtn) toggleBtn.click();
      } else {
        const savedEmail = localStorage.getItem('regEmail');
        const savedPassword = localStorage.getItem('regPassword');

        if (savedEmail && (email !== savedEmail || password !== savedPassword)) {
          alert('Email o password errati.');
          return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        window.location.href = 'index.html';
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
      });
  } else {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', 'google.user@gmail.com');
    window.location.href = 'index.html';
  }
}