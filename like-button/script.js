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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const likeRef = db.ref("likes/blog-like-button");

const button = document.getElementById("like-button");
const liked = localStorage.getItem("has-liked-blog") === "true";

// Update button label based on current state
function updateButton() {
  button.textContent = liked ? "💔 Unlike" : "❤️ Like";
}

updateButton();

// Toggle on click
button.addEventListener("click", () => {
  const hasLiked = localStorage.getItem("has-liked-blog") === "true";

  if (hasLiked) {
    // Unlike: decrement count
    likeRef.transaction((current) => Math.max((current || 1) - 1, 0));
    localStorage.setItem("has-liked-blog", "false");
    button.textContent = "❤️ Like";
  } else {
    // Like: increment count
    likeRef.transaction((current) => (current || 0) + 1);
    localStorage.setItem("has-liked-blog", "true");
    button.textContent = "💔 Unlike";
  }
});
