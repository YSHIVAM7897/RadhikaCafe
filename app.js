// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
    const welcomeScreen = document.getElementById('welcome-screen');
    const menuScreen = document.getElementById('menu-screen');
    const cartScreen = document.getElementById('cart-screen');
    const confirmationScreen = document.getElementById('confirmation-screen');
    const loginScreen = document.getElementById('login-screen');

    const tableNumberInput = document.getElementById('table-number');
    const startOrderBtn = document.getElementById('start-order-btn');
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const filterBtn = document.getElementById('filter-btn');
    const categoryDropdown = document.getElementById('category-dropdown');
    const menuItemsContainer = document.getElementById('menu-items');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const confirmationTable = document.getElementById('confirmation-table');
    const confirmationOrderId = document.getElementById('confirmation-order-id');
    const newOrderBtn = document.getElementById('new-order-btn');
    const staffLoginLink = document.getElementById('staff-login-link');
    const loginForm = document.getElementById('login-form');
    const backToWelcomeBtn = document.getElementById('back-to-welcome');

    // App State
    let currentTableNumber = null;
    let currentCategory = "All"; // Default to "All"
    let cart = [];
    let currentOrderId = null;

    // Initialize Firebase
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
    const firebase = window.firebase; // Assuming firebase is loaded globally
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Sample menu data (replace with your actual data source)
    // This file contains the menu data
    const menuData = {
        "menu": [
            {
                "category": "Continental",
                "items": [
                    {
                        "name": "Cheese Balls",
                        "price": 99
                    },
                    {
                        "name": "French Fries",
                        "price": 49
                    },
                    {
                        "name": "Paneer Tikka",
                        "price": 149
                    }
                ]
            },
            {
                "category": "Maharastrian Foods",
                "items": [
                    {
                        "name": "Vada pav (2 pcs)",
                        "price": 99
                    },
                    {
                        "name": "Cheese Vada pav (2 pcs)",
                        "price": 149
                    },
                    {
                        "name": "Dabeli (2 pcs)",
                        "price": 139
                    },
                    {
                        "name": "Cheese Dabeli (2 pcs)",
                        "price": 159
                    },
                    {
                        "name": "Pav bhaji with 3Pav & butter",
                        "price": 159
                    },
                    {
                        "name": "Misal Pav with 3Pav",
                        "price": 139
                    },
                    {
                        "name": "Ragda Samosa",
                        "price": 99
                    },
                    {
                        "name": "Bhel puri",
                        "price": 99
                    },
                    {
                        "name": "Extra Pav",
                        "price": 20
                    }
                ]
            },
            {
                "category": "Noodles",
                "items": [
                    {
                        "name": "Veg chilli garlic noodles",
                        "price": 139
                    },
                    {
                        "name": "Veg Hakka noodles",
                        "price": 149
                    },
                    {
                        "name": "Veg Hakka noodles (half)",
                        "price": 100
                    },
                    {
                        "name": "Veg chawmein full",
                        "price": 129
                    },
                    {
                        "name": "Veg chawmein full",
                        "price": 79
                    },
                    {
                        "name": "Veg Shingapuri noodles",
                        "price": 199
                    }
                ]
            },
            {
                "category": "Momos",
                "items": [
                    {
                        "name": "Veg momos (8 pcs)- Stream",
                        "price": 99
                    },
                    {
                        "name": "Veg momos (8 pcs)- Fried",
                        "price": 119
                    },
                    {
                        "name": "Paneer momos (8 pcs)- Stream",
                        "price": 119
                    },
                    {
                        "name": "Paneer momos (8 pcs)- Fried",
                        "price": 139
                    },
                    {
                        "name": "Cheese corn momos (8 pcs)- Stream",
                        "price": 119
                    },
                    {
                        "name": "Cheese corn momos (8 pcs)- Fried",
                        "price": 139
                    }
                ]
            },
            {
                "category": "Roll",
                "items": [
                    {
                        "name": "Veg Spring Roll (2 pcs)",
                        "price": 119
                    },
                    {
                        "name": "Paneer Spring Roll (2 pcs)",
                        "price": 199
                    },
                    {
                        "name": "Mix Veg Kathi Roll",
                        "price": 79
                    },
                    {
                        "name": "Paneer Kathi Roll",
                        "price": 99
                    }
                ]
            },
            {
                "category": "Garlic Bread",
                "items": [
                    {
                        "name": "Cheese Garlic Bread",
                        "price": 80
                    },
                    {
                        "name": "Cheese Dip",
                        "price": 25
                    }
                ]
            },
            {
                "category": "Stater's",
                "items": [
                    {
                        "name": "Chilli Paneer - Dry",
                        "price": 199
                    },
                    {
                        "name": "Chilli Paneer - Gravy",
                        "price": 249
                    },
                    {
                        "name": "Chilli potato",
                        "price": 119
                    },
                    {
                        "name": "Honey Chilli Potato",
                        "price": 139
                    },
                    {
                        "name": "Veg Manchurian",
                        "price": 149
                    },
                    {
                        "name": "Crispy Veg",
                        "price": 149
                    },
                    {
                        "name": "Veg Fried Rice",
                        "price": 119
                    },
                    {
                        "name": "French Fries",
                        "price": 99
                    }
                ]
            },
            {
                "category": "Main Course",
                "items": [
                    {
                        "name": "Paneer Butter Masala (half)",
                        "price": 149
                    },
                    {
                        "name": "Paneer Butter Masala (Full)",
                        "price": 259
                    },
                    {
                        "name": "Sahi paneer (half)",
                        "price": 159
                    },
                    {
                        "name": "Sahi paneer (Full)",
                        "price": 269
                    },
                    {
                        "name": "Mattar Paneer (half)",
                        "price": 149
                    },
                    {
                        "name": "Matar Paneer (Full)",
                        "price": 259
                    },
                    {
                        "name": "Dal Makhani (half)",
                        "price": 149
                    },
                    {
                        "name": "Dal Makhani (Full)",
                        "price": 259
                    },
                    {
                        "name": "Kari Pakoda (half)",
                        "price": 89
                    },
                    {
                        "name": "Kari Pakora (Full)",
                        "price": 159
                    },
                    {
                        "name": "Rajma Masala (half)",
                        "price": 149
                    },
                    {
                        "name": "Rajma Masala (Full)",
                        "price": 259
                    },
                    {
                        "name": "Palak Paneer (half)",
                        "price": 149
                    },
                    {
                        "name": "Palak Paneer (Full)",
                        "price": 259
                    },
                    {
                        "name": "Aloo Gobhi Masala (half)",
                        "price": 99
                    },
                    {
                        "name": "Aloo Gobhi Masala (Full)",
                        "price": 179
                    },
                    {
                        "name": "Jeera Aloo (half)",
                        "price": 89
                    },
                    {
                        "name": "Jeera Aloo (Full)",
                        "price": 149
                    },
                    {
                        "name": "Mix Veg(half)",
                        "price": 99
                    },
                    {
                        "name": "Mix Veg (Full)",
                        "price": 179
                    },
                    {
                        "name": "Yellow Dal Tadka (Full)",
                        "price": 99
                    },
                    {
                        "name": "Yello Dal Tadka (Full)",
                        "price": 169
                    },
                    {
                        "name": "Jeera Rice",
                        "price": 99
                    },
                    {
                        "name": "Raita",
                        "price": 39
                    }
                ]
            },
            {
                "category": "Radhika Special Thali",
                "items": [
                    {
                        "name": "Tawa Roti 4pc + Rice + Paneer butter masala + Dal Tadka + Mix veg + Raita + Ice cream ",
                        "price": 239
                    }
                ]
            },
            {
                "category": "Mini thali",
                "items": [
                    {
                        "name": "Tawa Roti 2pc + Rice + Paneer butter masala + Dal Tadka + Raita + Ice cream ",
                        "price": 159
                    }
                ]
            },
            {
                "category": "Bread",
                "items": [
                    {
                        "name": "Tawa Roti ",
                        "price": 15
                    },
                    {
                        "name": "Tandoori Roti ",
                        "price": 20
                    },
                    {
                        "name": "Tandoori butter Roti",
                        "price": 15
                    },
                    {
                        "name": "Luchha Paratha",
                        "price": 15
                    },
                    {
                        "name": "Butter Naan",
                        "price": 15
                    }
                ]
            },
            {
                "category": "Mini Meal",
                "items": [
                    {
                        "name": "Kadhi & Rice",
                        "price": 129
                    },
                    {
                        "name": "Rajma & Rice",
                        "price": 129
                    },
                    {
                        "name": "Choley + Rice",
                        "price": 139
                    },
                    {
                        "name": "Dal & Rise",
                        "price": 129
                    },
                    {
                        "name": "Sahi paneer & Rice",
                        "price": 149
                    }
                ]
            },
            {
                "category": "Combo Offer",
                "items": [
                    {
                        "name": "Fried rice with chilli Paneer",
                        "price": 199
                    },
                    {
                        "name": "Veg Noodles with Chilli Paneer",
                        "price": 199
                    },
                    {
                        "name": "Veg. Manchurian with fried Rice",
                        "price": 199
                    },
                    {
                        "name": "Veg. Manchurian with Noodles",
                        "price": 199
                    },
                    {
                        "name": "Paneer Curry with Rice",
                        "price": 199
                    },
                    {
                        "name": "Veg Triple Fried Rice",
                        "price": 199
                    },
                    {
                        "name": "Fried rice with Raita",
                        "price": 119
                    },
                    {
                        "name": "Vada pav with Dabeli(2Pc each)",
                        "price": 229
                    },
                    {
                        "name": "Vada pav (2 pcs) with Pav Bhaji(3 pav)",
                        "price": 229
                    }
                ]
            },
            {
                "category": "Panjabi Tadka",
                "items": [
                    {
                        "name": "Chole Bhature(2pcs)",
                        "price": 119
                    },
                    {
                        "name": "Puri sabzi (5pcs)",
                        "price": 99
                    },
                    {
                        "name": "Pyaz Pakoda",
                        "price": 99
                    },
                    {
                        "name": "Samosa with Chutney(2pcs)",
                        "price": 39
                    }
                ]
            },
            {
                "category": "Snake ",
                "items": [
                    {
                        "name": "Banana Shake",
                        "price": 99
                    },
                    {
                        "name": "Oreo Shake",
                        "price": 99
                    },
                    {
                        "name": "Chocolate Shake",
                        "price": 99
                    },
                    {
                        "name": "KitKat Shake",
                        "price": 99
                    }
                ]
            },
            {
                "category": "Soups ",
                "items": [
                    {
                        "name": "Veg. Manchurian soup",
                        "price": 129
                    },
                    {
                        "name": "Veg. hot& sour soup",
                        "price": 129
                    },
                    {
                        "name": "Tomato soup",
                        "price": 119
                    },
                    {
                        "name": "Veg lemon coriander soup",
                        "price": 119
                    },
                    {
                        "name": "Veg sweet corn soup",
                        "price": 119
                    }
                ]
            },
            {
                "category": "Beverage ",
                "items": [
                    {
                        "name": "Ginger Masala tea",
                        "price": 39
                    },
                    {
                        "name": "Lemon tea",
                        "price": 49
                    },
                    {
                        "name": "Kokum Masala soda",
                        "price": 49
                    },
                    {
                        "name": "Lemon soda",
                        "price": 49
                    },
                    {
                        "name": "Desi filter coffee",
                        "price": 69
                    },
                    {
                        "name": "Cold Coffee",
                        "price": 79
                    },
                    {
                        "name": "Water ",
                        "price": 20
                    },
                    {
                        "name": "Soft Drink",
                        "price": 40
                    }
                ]
            }
        ]
    };

    // Initialize the app
    function init() {
        setupCategoryFilter();
        setupEventListeners();
        console.log("App initialized");
    }

    // Setup Category Filter
    function setupCategoryFilter() {
        if (!categoryDropdown) return;

        // Add "All" option
        const allOption = document.createElement('div');
        allOption.className = 'category-option';
        allOption.textContent = 'All';
        allOption.setAttribute('data-category', 'All');
        categoryDropdown.appendChild(allOption);

        // Add all categories from menu data
        menuData.menu.forEach(category => {
            const option = document.createElement('div');
            option.className = 'category-option';
            option.textContent = category.category;
            option.setAttribute('data-category', category.category);
            categoryDropdown.appendChild(option);
        });

        // Add event listeners to category options
        const categoryOptions = document.querySelectorAll('.category-option');
        categoryOptions.forEach(option => {
            option.addEventListener('click', () => {
                const category = option.getAttribute('data-category');
                selectCategory(category);

                // Hide dropdown after selection
                categoryDropdown.classList.remove('show');

                // Update filter button text
                if (filterBtn) {
                    filterBtn.textContent = `Filter: ${category}`;
                }
            });
        });
    }

    // Setup Event Listeners
    function setupEventListeners() {
        console.log("Setting up event listeners");

        // Start Order Button
        startOrderBtn.addEventListener('click', function () {
            console.log("Start order button clicked");
            const tableNumber = tableNumberInput.value.trim();
            if (tableNumber) {
                if(tableNumber < 10 && tableNumber > 0) {
                    currentTableNumber = tableNumber;
                    showScreen(menuScreen);
                    selectCategory("All"); // Show all items by default
                }else{
                    alert('Please enter a valid table number (1-9)');

                }
            } else {
                alert('Please enter a table number');
            }
        });

        // Also add enter key support for table number input
        tableNumberInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                startOrderBtn.click();
            }
        });

        // Filter Button
        if (filterBtn) {
            filterBtn.addEventListener('click', function () {
                categoryDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function (e) {
                if (!filterBtn.contains(e.target) && !categoryDropdown.contains(e.target)) {
                    categoryDropdown.classList.remove('show');
                }
            });
        }

        // Cart Icon
        cartIcon.addEventListener('click', function () {
            renderCartItems();
            showScreen(cartScreen);
        });

        // Back to Menu Button
        backToMenuBtn.addEventListener('click', function () {
            showScreen(menuScreen);
        });

        // Place Order Button
        placeOrderBtn.addEventListener('click', function () {
            if (cart.length > 0) {
                placeOrder();
            } else {
                alert('Your cart is empty');
            }
        });

        // New Order Button
        newOrderBtn.addEventListener('click', function () {
            resetOrder();
            showScreen(welcomeScreen);
        });

        // Staff Login Link
        if (staffLoginLink) {
            staffLoginLink.addEventListener('click', function (e) {
                e.preventDefault();
                showScreen(loginScreen);
            });
        }

        // Back to Welcome from Login
        if (backToWelcomeBtn) {
            backToWelcomeBtn.addEventListener('click', function () {
                showScreen(welcomeScreen);
            });
        }

        // Login Form Submit
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Simple authentication - in a real app, use proper authentication
                if (username === 'LadliShyama' && password === 'radha@7897') {
                    // Redirect to admin page
                    window.location.href = 'admin.html';
                } else {
                    alert('Invalid username or password');
                }
            });
        }
    }

    // Select Category
    function selectCategory(categoryName) {
        currentCategory = categoryName;
        renderMenuItems(categoryName);
    }

    // Render Menu Items for a Category - UPDATED to handle "All" category
    function renderMenuItems(categoryName) {
        if (!menuItemsContainer) return;

        menuItemsContainer.innerHTML = '';

        // Get items based on category
        let itemsToRender = [];

        if (categoryName === "All") {
            // Get all items from all categories
            menuData.menu.forEach(category => {
                category.items.forEach(item => {
                    itemsToRender.push({
                        ...item,
                        category: category.category
                    });
                });
            });
        } else {
            // Get items from the selected category
            const category = menuData.menu.find(cat => cat.category === categoryName);
            if (category) {
                itemsToRender = category.items.map(item => ({
                    ...item,
                    category: categoryName
                }));
            }
        }

        // Render each item
        itemsToRender.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';

            const cartItem = cart.find(cartItem =>
                cartItem.name === item.name && cartItem.category === item.category);
            const quantity = cartItem ? cartItem.quantity : 0;

            // Create the button text based on whether item is in cart
            const buttonText = quantity > 0 ? `Add (${quantity})` : 'Add';

            menuItem.innerHTML = `
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="item-category">${item.category}</div>
                    <div class="item-price">₹${item.price}</div>
                </div>
                <div class="item-actions">
                    <button class="add-to-cart-btn" data-name="${item.name}" data-category="${item.category}" data-price="${item.price}">
                        ${buttonText}
                    </button>
                </div>
            `;

            menuItemsContainer.appendChild(menuItem);
        });

        // Add event listeners to add buttons
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                const category = button.getAttribute('data-category');
                const price = parseInt(button.getAttribute('data-price'));
                addToCart(name, category, price);

                // Update button text
                const cartItem = cart.find(item => item.name === name && item.category === category);
                if (cartItem) {
                    button.textContent = `Add (${cartItem.quantity})`;
                }
            });
        });
    }

    // Add to Cart
    function addToCart(name, category, price) {
        const existingItem = cart.find(item => item.name === name && item.category === category);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                category,
                price,
                quantity: 1
            });
        }

        updateCartCount();
    }

    // Remove from Cart
    function removeFromCart(name, category) {
        const existingItemIndex = cart.findIndex(item => item.name === name && item.category === category);

        if (existingItemIndex !== -1) {
            if (cart[existingItemIndex].quantity > 1) {
                cart[existingItemIndex].quantity -= 1;
            } else {
                cart.splice(existingItemIndex, 1);
            }
        }

        updateCartCount();

        // If we're on the menu screen, update the button text
        if (menuScreen.classList.contains('active')) {
            renderMenuItems(currentCategory);
        }
    }

    // Update Cart Count
    function updateCartCount() {
        if (!cartCount) return;

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Render Cart Items
    function renderCartItems() {
        if (!cartItemsContainer || !cartTotal) return;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '₹0';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-category">${item.category}</div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="cart-quantity-btn minus" data-name="${item.name}" data-category="${item.category}">-</div>
                    <div class="quantity">${item.quantity}</div>
                    <div class="cart-quantity-btn plus" data-name="${item.name}" data-category="${item.category}" data-price="${item.price}">+</div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `₹${total}`;

        // Add event listeners to cart quantity buttons
        const plusButtons = document.querySelectorAll('.cart-item .cart-quantity-btn.plus');
        const minusButtons = document.querySelectorAll('.cart-item .cart-quantity-btn.minus');

        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                const category = button.getAttribute('data-category');
                const price = parseInt(button.getAttribute('data-price'));
                addToCart(name, category, price);
                renderCartItems();
            });
        });

        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                const category = button.getAttribute('data-category');
                removeFromCart(name, category);
                renderCartItems();
            });
        });
    }

    // Place Order
    function placeOrder() {
        // Generate a unique order ID
        currentOrderId = generateOrderId();

        // Create order object
        const order = {
            orderId: currentOrderId,
            tableNumber: currentTableNumber,
            items: cart,
            total: calculateTotal(),
            status: 'pending',
            timestamp: Date.now()
        };

        // Save to Firebase
        database.ref('orders/' + currentOrderId).set(order)
            .then(() => {
                // Show confirmation screen
                confirmationTable.textContent = currentTableNumber;
                confirmationOrderId.textContent = currentOrderId;
                showScreen(confirmationScreen);
            })
            .catch(error => {
                console.error("Error saving order: ", error);
                alert("There was an error placing your order. Please try again.");
            });
    }

    // Calculate Total
    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Generate Order ID
    function generateOrderId() {
        return 'ORD-' + Date.now().toString().slice(-6);
    }

    // Reset Order
    function resetOrder() {
        currentTableNumber = null;
        cart = [];
        updateCartCount();
    }

    // Show Screen
    function showScreen(screen) {
        console.log("Showing screen:", screen.id);

        // Hide all screens
        welcomeScreen.classList.remove('active');
        menuScreen.classList.remove('active');
        cartScreen.classList.remove('active');
        confirmationScreen.classList.remove('active');

        // Hide login screen if it exists
        if (loginScreen) {
            loginScreen.classList.remove('active');
        }

        // Show the requested screen
        screen.classList.add('active');
    }

    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Disable F12, Ctrl+Shift+I, and Ctrl+U
    document.addEventListener("keydown", (e) => {
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            e.preventDefault();
        }
    });
    // Initialize the app
    init();
});
