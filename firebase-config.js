// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEnEXoKjRG6rsppjkTQp7wgO2-d5F69ws",
    authDomain: "radhika-cafe.firebaseapp.com",
    databaseURL: "https://radhika-cafe-default-rtdb.firebaseio.com",
    projectId: "radhika-cafe",
    storageBucket: "radhika-cafe.firebasestorage.app",
    messagingSenderId: "524293061829",
    appId: "1:524293061829:web:e0431056ef98caea3944ac",
    measurementId: "G-Q8HC4F0K0Z"
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