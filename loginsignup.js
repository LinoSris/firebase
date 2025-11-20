// --- Firebase ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhd7oIl79GGEgo3B9YpLXwFudciddE-xM",
  authDomain: "loginsignup-6f695.firebaseapp.com",
  projectId: "loginsignup-6f695",
  storageBucket: "loginsignup-6f695.firebasestorage.app",
  messagingSenderId: "45063161138",
  appId: "145063161138web0e9b818462a0721589432b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const formTitle = document.getElementById("form-title");

showSignup?.addEventListener("click", () => {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
  formTitle.textContent = "Sign Up";
  clearMessages();
});
showLogin?.addEventListener("click", () => {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
  formTitle.textContent = "Login";
  clearMessages();
});

function clearMessages() {
  document.getElementById("login-error").textContent = "";
  document.getElementById("signup-error").textContent = "";
  document.getElementById("signup-success").textContent = "";
}

// --- Signup ---
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  if (!name || !email || !password) {
    document.getElementById("signup-error").textContent =
      "Please fill in all fields.";
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
    document.getElementById("signup-success").textContent =
      "Signup successful! You can now log in.";
    signupForm.reset();
  } catch (error) {
    document.getElementById("signup-error").textContent = error.message;
  }
});

// --- Login ---
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  if (!email || !password) {
    document.getElementById("login-error").textContent =
      "Please fill in both fields.";
    return;
  }
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    window.location.href = "ToDo/todo.html";
  } catch (error) {
    document.getElementById("login-error").textContent = error.message;
  }
});

