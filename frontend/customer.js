// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let allProducts = [];
let cart = {};

// ==================== Initialization ====================
function initializeCustomer() {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    document.getElementById('userEmail').textContent = currentUser.email;
    
    loadProducts();
    loadMyOrders();
    updateCartCount();
}

function checkAuth() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'index.html';
        return null;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'CUSTOMER') {
        window.location.href = 'index.html';
        return null;
    }
    
    return userData;
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// ==================== Products & Shopping ====================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        allProducts = await response.json();
        displayProducts(allProducts);
        populateCategories();
    } catch (error) {
        console.error('Error loading products:', error);
        showMessage('Failed to load products', 'error');
    }
}

function displayProducts(products) {
    const productsList = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsList.innerHTML = '<p class="loading">No products available</p>';
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <h3>${product.name}</h3>
                <div class="product-meta">
                    <span>${product.category}</span>
                    <span>${product.brand}</span>
                </div>
            </div>
            <div class="product-body">
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <div class="product-stock">
                    Stock: <span class="stock-badge ${getStockClass(product.stock)}">${product.stock} units</span>
                </div>
                <div style="margin-top: 20px;">
                    ${product.stock > 0 ? `
                        <button class="btn btn-primary btn-small" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, ${product.stock})">
                            🛒 Add to Cart
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-small" disabled>Out of Stock</button>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

function populateCategories() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const filterSelect = document.getElementById('categoryFilter');
    
    filterSelect.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function filterProducts() {
    const searchText = document.getElementById('searchProducts').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    const filtered = allProducts.filter(product => {
        const matchesSearch = !searchText || 
            product.name.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayProducts(filtered);
}

function getStockClass(stock) {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
}

function addToCart(productId, productName, price, stock) {
    if (!cart[productId]) {
        cart[productId] = {
            id: productId,
            name: productName,
            price: price,
            quantity: 1,
            maxStock: stock
        };
    } else {
        if (cart[productId].quantity < stock) {
            cart[productId].quantity++;
        } else {
            showMessage(`Cannot add more than ${stock} units`, 'error');
            return;
        }
    }
    
    updateCartCount();
    showMessage(`Added ${productName} to cart!`, 'success');
    updateCartDisplay();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartItemCount').textContent = count;
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (Object.keys(cart).length === 0) {
        cartItemsDiv.innerHTML = '<p style="color: var(--secondary-color);">Your cart is empty</p>';
        document.getElementById('orderSummary').innerHTML = '<p>No items</p>';
        document.getElementById('cartTotalPrice').textContent = '0.00';
        document.getElementById('checkoutTotal').textContent = '0.00';
        return;
    }
    
    let total = 0;
    let summaryHtml = '';
    
    cartItemsDiv.innerHTML = Object.values(cart).map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHtml += `${item.name} x${item.quantity} = $${itemTotal.toFixed(2)}\n`;
        
        return `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0;">${item.name}</h4>
                        <p style="margin: 5px 0; color: var(--secondary-color);">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button class="btn btn-small" style="width: 30px; padding: 5px;" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span style="width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                        <button class="btn btn-small" style="width: 30px; padding: 5px;" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, ${item.maxStock})">+</button>
                        <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 10px; font-weight: bold;">Subtotal: $${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('cartTotalPrice').textContent = total.toFixed(2);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
    document.getElementById('orderSummary').innerHTML = `<pre>${summaryHtml}Total: $${total.toFixed(2)}</pre>`;
}

function updateCartQuantity(productId, newQuantity, maxStock = null) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (maxStock && newQuantity > maxStock) {
        showMessage(`Cannot exceed available stock (${maxStock})`, 'error');
        return;
    }
    
    cart[productId].quantity = newQuantity;
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    const productName = cart[productId].name;
    delete cart[productId];
    updateCartCount();
    updateCartDisplay();
    showMessage(`${productName} removed from cart`, 'info');
}

// ==================== Orders ====================
async function handlePlaceOrder(event) {
    event.preventDefault();
    
    if (Object.keys(cart).length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    
    if (!paymentMethod || !shippingAddress) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    const orderItems = Object.values(cart).map(item => ({
        product: { id: item.id },
        quantity: item.quantity,
        price: item.price
    }));
    
    const totalAmount = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
        totalAmount: totalAmount,
        status: 'PLACED',
        paymentStatus: 'PENDING',
        user: { id: currentUser.id },
        orderItems: orderItems
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        if (response.ok) {
            const createdOrder = await response.json();
            
            // Process payment
            const payment = {
                order: { id: createdOrder.id },
                amount: totalAmount,
                paymentMethod: paymentMethod,
                status: 'SUCCESS'
            };
            
            await fetch(`${API_BASE_URL}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payment)
            });
            
            showMessage('Order placed successfully! 🎉', 'success');
            cart = {};
            updateCartCount();
            updateCartDisplay();
            document.getElementById('paymentMethod').value = '';
            document.getElementById('shippingAddress').value = '';
            
            setTimeout(() => {
                showSection('myOrders');
                loadMyOrders();
            }, 500);
        } else {
            showMessage('Failed to place order', 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showMessage('Error placing order', 'error');
    }
}

async function loadMyOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const allOrders = await response.json();
        
        // Filter orders for current user
        const myOrders = allOrders.filter(order => order.user?.id === currentUser.id);
        
        const ordersList = document.getElementById('ordersList');
        
        if (myOrders.length === 0) {
            ordersList.innerHTML = '<p class="loading">You haven\'t placed any orders yet</p>';
            return;
        }
        
        ordersList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                        <th>Items</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${myOrders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>$${parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                            <td><span class="status-badge ${(order.status || 'PLACED').toLowerCase()}">${order.status || 'PLACED'}</span></td>
                            <td><span class="status-badge ${(order.paymentStatus || 'PENDING').toLowerCase()}">${order.paymentStatus || 'PENDING'}</span></td>
                            <td>${order.orderItems?.length || 0}</td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="viewMyOrderDetails(${order.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading orders:', error);
        showMessage('Failed to load orders', 'error');
    }
}

async function viewMyOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        const order = await response.json();
        
        let itemsHtml = '';
        let total = 0;
        
        if (order.orderItems && order.orderItems.length > 0) {
            itemsHtml = order.orderItems.map(item => {
                const itemTotal = item.quantity * item.price;
                total += itemTotal;
                return `${item.product?.name || 'Product'} - Qty: ${item.quantity} @ $${parseFloat(item.price).toFixed(2)} = $${itemTotal.toFixed(2)}`;
            }).join('\n');
        }
        
        alert(`Order #${order.id}\n\nStatus: ${order.status}\nPayment Status: ${order.paymentStatus}\n\nItems:\n${itemsHtml}\n\nTotal: $${parseFloat(order.totalAmount).toFixed(2)}`);
    } catch (error) {
        console.error('Error fetching order details:', error);
        showMessage('Failed to load order details', 'error');
    }
}

// ==================== Utility Functions ====================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'checkout') {
        updateCartDisplay();
    }
}

function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message show ${type}`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// ==================== Page Load ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeCustomer();
});
