// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDw30UTh3QzwvHOjyFZuKfc3_xQMoFfTxU",
  authDomain: "blog-content-likes.firebaseapp.com",
  databaseURL: "https://blog-content-likes-default-rtdb.firebaseio.com",
  projectId: "blog-content-likes",
  storageBucket: "blog-content-likes.firebasestorage.app",
  messagingSenderId: "355435366561",
  appId: "1:355435366561:web:ecf1d89db5a237828b08e0"
};

// --- Get ID from URL ---
const params = new URLSearchParams(window.location.search);
const buttonID = params.get("id") || "default";
const localStorageKey = `has-liked-${buttonID}`;

// --- Firebase Init ---
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const likeRef = db.ref(`likes/${buttonID}`);

// --- Button Setup ---
const button = document.getElementById("like-button");

function updateButtonUI(hasLiked) {
  button.textContent = hasLiked ? "💔 Unlike" : "❤️ Like";
}

let hasLiked = localStorage.getItem(localStorageKey) === "true";
updateButtonUI(hasLiked);

button.addEventListener("click", () => {
  hasLiked = localStorage.getItem(localStorageKey) === "true";

  if (hasLiked) {
    likeRef.transaction((current) => Math.max((current || 1) - 1, 0));
    localStorage.setItem(localStorageKey, "false");
  } else {
    likeRef.transaction((current) => (current || 0) + 1);
    localStorage.setItem(localStorageKey, "true");
  }

  updateButtonUI(!hasLiked);
});
