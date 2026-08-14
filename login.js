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

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        if (isRegistering) {
          const confirmVal = confirmPassword ? confirmPassword.value : '';
          if (password !== confirmVal) {
            alert('Le password non coincidono.');
            return;
          }
          const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
          await userCred.user.sendEmailVerification();
          await firebase.auth().signOut();
          alert('Registrazione completata! Controlla la tua email per verificare l\'account.');
          if (toggleBtn) toggleBtn.click();
        } else {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
          if (!userCredential.user.emailVerified) {
            await firebase.auth().signOut();
            alert("Accesso negato: devi prima verificare la tua email.");
            return;
          }
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', userCredential.user.email);
          window.location.href = 'index.html';
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') alert("Questa email è già registrata.");
        else if (error.code === 'auth/invalid-email') alert("Formato email non valido.");
        else if (error.code === 'auth/weak-password') alert("La password deve avere almeno 6 caratteri.");
        else alert('Errore: ' + error.message);
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
        alert('Errore Google Login: ' + error.message);
      });
  }
}