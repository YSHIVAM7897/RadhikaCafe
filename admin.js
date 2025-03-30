// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    // Login System
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logout-btn');

    // Admin credentials (in a real app, this would be handled server-side)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "cafe123";

    // Check if user is already logged in
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('cafeAdminLoggedIn') === 'true';
        if (isLoggedIn) {
            showDashboard();
        } else {
            showLoginScreen();
        }
    }

    // Show login screen
    function showLoginScreen() {
        loginContainer.style.display = 'flex';
        dashboard.style.display = 'none';
    }

    // Show dashboard
    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // Successful login
                localStorage.setItem('cafeAdminLoggedIn', 'true');
                showDashboard();
                loginError.textContent = '';
            } else {
                // Failed login
                loginError.textContent = 'Invalid username or password';
                localStorage.removeItem('cafeAdminLoggedIn');
            }
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('cafeAdminLoggedIn');
            showLoginScreen();
        });
    }

    // Check login status on page load
    checkLoginStatus();

    // DOM Elements - Add null checks for all elements
    const ordersList = document.getElementById('orders-list');
    const statusFilter = document.getElementById('status-filter');
    const orderModal = document.getElementById('order-modal');
    const orderDetails = document.getElementById('order-details');
    const closeModal = document.querySelector('.close-modal');

    // Check if all required elements exist
    if (!ordersList || !statusFilter || !orderModal || !orderDetails || !closeModal) {
        console.error("Required DOM elements not found:", {
            ordersList: !!ordersList,
            statusFilter: !!statusFilter,
            orderModal: !!orderModal,
            orderDetails: !!orderDetails,
            closeModal: !!closeModal
        });
        return; // Exit if elements are missing
    }

    // App State
    let orders = [];

    // Firebase Configuration - Replace with your actual Firebase config
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

    // Initialize Firebase with error handling
    let firebase;
    try {
        firebase = window.firebase;
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        showErrorMessage("Failed to initialize Firebase. Please check your configuration.");
        return;
    }

    // Get a reference to the database
    const database = firebase.database();

    // Initialize the app
    function init() {
        console.log("Initializing app");
        setupEventListeners();
        listenForOrders();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        console.log("Setting up event listeners");

        // Status Filter
        statusFilter.addEventListener('change', () => {
            renderOrders();
        });

        // Close Modal
        closeModal.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });

        // Close Modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === orderModal) {
                orderModal.style.display = 'none';
            }
        });
    }

    // Listen for Orders from Firebase with improved error handling
    function listenForOrders() {
        console.log("Setting up Firebase listener");

        try {
            const ordersRef = database.ref('orders');

            // Show loading indicator
            ordersList.innerHTML = '<div class="loading-indicator">Loading orders...</div>';

            ordersRef.on('value', (snapshot) => {
                console.log("Received data from Firebase");
                orders = [];

                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const order = childSnapshot.val();
                        orders.push(order);
                    });

                    // Sort orders by timestamp (newest first)
                    orders.sort((a, b) => b.timestamp - a.timestamp);

                    console.log(`Loaded ${orders.length} orders`);
                    renderOrders();
                } else {
                    console.log("No orders found in database");
                    ordersList.innerHTML = '<div class="no-orders">No orders found in the database</div>';
                }
            }, (error) => {
                console.error("Error fetching orders:", error);
                showErrorMessage("Failed to fetch orders from the database. " + error.message);
            });
        } catch (error) {
            console.error("Error setting up Firebase listener:", error);
            showErrorMessage("Failed to connect to the database. " + error.message);
        }
    }

    // Show error message in the UI
    function showErrorMessage(message) {
        if (ordersList) {
            ordersList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    // Render Orders with null checks
    function renderOrders() {
        if (!ordersList) return;

        ordersList.innerHTML = '';

        const selectedStatus = statusFilter.value;
        let filteredOrders = orders;

        if (selectedStatus !== 'all') {
            filteredOrders = orders.filter(order => order.status === selectedStatus);
        }

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">No orders to display</div>';
            return;
        }

        filteredOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.setAttribute('data-order-id', order.orderId);

            // Format timestamp
            const orderDate = new Date(order.timestamp);
            const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Get first 3 items to display in card
            const itemsToShow = order.items.slice(0, 3);
            const itemsHtml = itemsToShow.map(item =>
                `<div class="order-item">
                    <span>${item.name}</span>
                    <span>x${item.quantity}</span>
                </div>`
            ).join('');

            // Show "and X more" if there are more items
            const moreItemsHtml = order.items.length > 3
                ? `<div class="more-items">and ${order.items.length - 3} more items...</div>`
                : '';

            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-id">${order.orderId}</div>
                    <div class="order-time">${formattedTime}</div>
                </div>
                <div class="order-table">Table ${order.tableNumber}</div>
                <div class="order-items">
                    ${itemsHtml}
                    ${moreItemsHtml}
                </div>
                <div class="order-total">Total: ₹${order.total}</div>
                <div class="order-actions">
                    <div class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</div>
                    <button class="action-button next-status-btn" data-order-id="${order.orderId}">
                        ${getNextStatusButtonText(order.status)}
                    </button>
                </div>
            `;

            ordersList.appendChild(orderCard);

            // Add event listener to view order details
            orderCard.addEventListener('click', (event) => {
                // Don't open modal if clicking on the status button
                if (!event.target.classList.contains('next-status-btn')) {
                    showOrderDetails(order);
                }
            });
        });

        // Add event listeners to status buttons
        const statusButtons = document.querySelectorAll('.next-status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent opening the modal
                const orderId = button.getAttribute('data-order-id');
                const order = orders.find(o => o.orderId === orderId);
                updateOrderStatus(orderId, getNextStatus(order.status));
            });
        });
    }

    // Show Order Details
    function showOrderDetails(order) {
        if (!orderDetails || !orderModal) return;

        orderDetails.innerHTML = '';

        // Format timestamp
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString();
        const formattedTime = orderDate.toLocaleTimeString();

        // Create order info section
        const orderInfo = document.createElement('div');
        orderInfo.innerHTML = `
            <h3>Order Information</h3>
            <div class="detail-item">
                <span>Order ID:</span>
                <span>${order.orderId}</span>
            </div>
            <div class="detail-item">
                <span>Table Number:</span>
                <span>${order.tableNumber}</span>
            </div>
            <div class="detail-item">
                <span>Date:</span>
                <span>${formattedDate}</span>
            </div>
            <div class="detail-item">
                <span>Time:</span>
                <span>${formattedTime}</span>
            </div>
            <div class="detail-item">
                <span>Status:</span>
                <span class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</span>
            </div>
        `;

        // Create items section
        const itemsSection = document.createElement('div');
        itemsSection.innerHTML = `<h3>Order Items</h3>`;

        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'detail-item';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            `;
            itemsSection.appendChild(itemElement);
        });

        // Create total section
        const totalSection = document.createElement('div');
        totalSection.className = 'detail-item';
        totalSection.innerHTML = `
            <span><strong>Total</strong></span>
            <span><strong>₹${order.total}</strong></span>
        `;

        // Create status actions
        const statusActions = document.createElement('div');
        statusActions.className = 'status-actions';

        if (order.status !== 'delivered') {
            statusActions.innerHTML = `
                <button class="status-btn ${getStatusButtonClass(order.status)}" data-order-id="${order.orderId}">
                    Mark as ${capitalizeFirstLetter(getNextStatus(order.status))}
                </button>
            `;
        }

        // Append all sections
        orderDetails.appendChild(orderInfo);
        orderDetails.appendChild(itemsSection);
        orderDetails.appendChild(totalSection);

        if (order.status !== 'delivered') {
            orderDetails.appendChild(statusActions);

            // Add event listener to status button
            const statusBtn = statusActions.querySelector('.status-btn');
            if (statusBtn) {
                statusBtn.addEventListener('click', () => {
                    const orderId = statusBtn.getAttribute('data-order-id');
                    updateOrderStatus(orderId, getNextStatus(order.status));
                    orderModal.style.display = 'none';
                });
            }
        }

        // Show modal
        orderModal.style.display = 'block';
    }

    // Update Order Status with improved error handling
    function updateOrderStatus(orderId, newStatus) {
        if (!database) {
            console.error("Database not initialized");
            return;
        }

        // Show loading indicator on the button
        const statusBtn = document.querySelector(`.next-status-btn[data-order-id="${orderId}"]`);
        if (statusBtn) {
            statusBtn.classList.add('loading');
            statusBtn.disabled = true;
        }

        database.ref('orders/' + orderId).update({
            status: newStatus
        })
            .then(() => {
                console.log(`Order ${orderId} updated to ${newStatus}`);
                // Remove loading state
                if (statusBtn) {
                    statusBtn.classList.remove('loading');
                    statusBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error("Error updating order: ", error);
                alert("There was an error updating the order status. Please try again.");
                // Remove loading state
                if (statusBtn) {
                    statusBtn.classList.remove('loading');
                    statusBtn.disabled = false;
                }
            });
    }

    // Helper Functions
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getNextStatus(currentStatus) {
        switch (currentStatus) {
            case 'pending':
                return 'preparing';
            case 'preparing':
                return 'ready';
            case 'ready':
                return 'delivered';
            default:
                return currentStatus;
        }
    }

    function getNextStatusButtonText(currentStatus) {
        switch (currentStatus) {
            case 'pending':
                return 'Start Preparing';
            case 'preparing':
                return 'Mark Ready';
            case 'ready':
                return 'Mark Delivered';
            case 'delivered':
                return 'Completed';
            default:
                return 'Update';
        }
    }

    function getStatusButtonClass(currentStatus) {
        switch (currentStatus) {
            case 'pending':
                return 'preparing-btn';
            case 'preparing':
                return 'ready-btn';
            case 'ready':
                return 'delivered-btn';
            default:
                return '';
        }
    }

    // Initialize the app
    init();
});