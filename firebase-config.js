// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP9wrNYo4IqXO1fV3ZavNNIcVRItnc4qc",
    authDomain: "test-f048a.firebaseapp.com",
    databaseURL: "https://test-f048a-default-rtdb.firebaseio.com",
    projectId: "test-f048a",
    storageBucket: "test-f048a.firebasestorage.app",
    messagingSenderId: "189044668377",
    appId: "1:189044668377:web:65566dd26170fa8f714bc8",
    measurementId: "G-KH7S9T84V3"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
    } else {
        console.log("Firebase already initialized");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
    alert("Failed to initialize Firebase. Please check your configuration.");
}

// Get a reference to the database
const database = firebase.database();

// Export the database reference
window.database = database;