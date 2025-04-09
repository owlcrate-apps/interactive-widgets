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

// DOM elements
const button = document.getElementById("like-button");
const countEl = document.getElementById("like-count");

// Check if user has already liked
const hasLiked = localStorage.getItem("has-liked-blog") === "true";

// Disable the button and update label if already liked
if (hasLiked) {
  button.disabled = true;
  button.textContent = "❤️ Liked";
}

// Load the like count
likeRef.on("value", (snapshot) => {
  const count = snapshot.val() || 0;
  countEl.textContent = count;
});