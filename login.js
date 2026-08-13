// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8XNpPwDLJXPyTJLbQr5vfpXdA27YARvw",
  authDomain: "login-9bace.firebaseapp.com",
  projectId: "login-9bace",
  storageBucket: "login-9bace.firebasestorage.app",
  messagingSenderId: "750647370002",
  appId: "1:750647370002:web:340e7552852bf0e6d0d3cb",
  measurementId: "G-4CV1N6JHWY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Gestione form e interfaccia
let isRegistering = false;

const toggleBtn = document.getElementById('toggle-mode');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitBtn = document.getElementById('submit-btn');
const googleSection = document.getElementById('google-section');
const authForm = document.getElementById('auth-form');
const confirmGroup = document.getElementById('confirm-group');
const confirmPassword = document.getElementById('confirm-password');

toggleBtn.addEventListener('click', function(e) {
  e.preventDefault();
  isRegistering = !isRegistering;
  
  if (isRegistering) {
    formTitle.textContent = 'Registrazione';
    formSubtitle.textContent = 'Crea un nuovo account';
    submitBtn.textContent = 'Registrati';
    toggleBtn.textContent = 'Hai già un account? Accedi';
    googleSection.style.display = 'none';
    confirmGroup.style.display = 'block';
    confirmPassword.setAttribute('required', 'true');
  } else {
    formTitle.textContent = 'Accesso';
    formSubtitle.textContent = 'Entra per gestire il tuo spazio';
    submitBtn.textContent = 'Accedi';
    toggleBtn.textContent = 'Non hai un account? Registrati';
    googleSection.style.display = 'block';
    confirmGroup.style.display = 'none';
    confirmPassword.removeAttribute('required');
  }
});

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Nascondi';
  } else {
    input.type = 'password';
    btn.textContent = 'Mostra';
  }
}

authForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isRegistering) {
    if (password !== confirmPassword.value) {
      alert('Le password non coincidono.');
      return;
    }
    localStorage.setItem('regEmail', email);
    localStorage.setItem('regPassword', password);
    alert('Registrazione completata! Ora puoi effettuare il login.');
    toggleBtn.click();
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

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then((result) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', result.user.email);
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Errore Google Login:", error);
      alert("Impossibile accedere con Google: " + error.message);
    });
}