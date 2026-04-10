// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let allProducts = [];
let allOrders = [];
let allUsers = [];

// ==================== Initialization ====================
function initializeAdmin() {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    document.getElementById('userEmail').textContent = currentUser.email;
    
    loadDashboardStats();
    loadAllProducts();
    loadAllOrders();
    loadAllUsers();
}

function checkAuth() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'index.html';
        return null;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'ADMIN') {
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

// ==================== Dashboard Stats ====================
async function loadDashboardStats() {
    try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
            fetch(`${API_BASE_URL}/admin/products`),
            fetch(`${API_BASE_URL}/admin/orders`),
            fetch(`${API_BASE_URL}/admin/users`)
        ]);
        
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        const users = await usersRes.json();
        
        // Update sidebar stats
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalUsers').textContent = users.length;
        
        // Update dashboard stats
        document.getElementById('dashProductCount').textContent = products.length;
        document.getElementById('dashOrderCount').textContent = orders.length;
        document.getElementById('dashUserCount').textContent = users.length;
        
        // Count pending orders
        const pendingCount = orders.filter(o => o.status === 'PLACED' || o.status === 'PROCESSING').length;
        document.getElementById('dashPendingCount').textContent = pendingCount;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// ==================== Products Management ====================
async function loadAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products`);
        allProducts = await response.json();
        displayProductsTable(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showMessage('Failed to load products', 'error');
    }
}

function displayProductsTable(products) {
    const productsList = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsList.innerHTML = '<p class="loading">No products available</p>';
        return;
    }
    
    productsList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>#${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.brand}</td>
                        <td>$${parseFloat(product.price).toFixed(2)}</td>
                        <td><strong>${product.stock}</strong></td>
                        <td><span class="stock-badge ${getStockClass(product.stock)}">${getStockStatus(product.stock)}</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="showUpdateStockForm(${product.id}, '${product.name}', ${product.stock})">Update Stock</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getStockClass(stock) {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
}

function getStockStatus(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
}

function filterProducts() {
    const searchText = document.getElementById('searchProducts').value.toLowerCase();
    
    const filtered = allProducts.filter(product => {
        return !searchText || 
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText);
    });
    
    displayProductsTable(filtered);
}

async function handleAddProduct(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        brand: document.getElementById('productBrand').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            showMessage('Product added successfully! ✅', 'success');
            closeAddProductForm();
            loadAllProducts();
            loadDashboardStats();
        } else {
            showMessage('Failed to add product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showMessage('Error adding product', 'error');
    }
}

function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'flex';
}

function closeAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productBrand').value = '';
}

function showUpdateStockForm(productId, productName, currentStock) {
    document.getElementById('updateProductId').value = productId;
    document.getElementById('updateProductName').value = productName;
    document.getElementById('updateProductStock').value = currentStock;
    document.getElementById('updateQuantity').value = '';
    document.getElementById('updateStockForm').style.display = 'flex';
}

function closeUpdateStockForm() {
    document.getElementById('updateStockForm').style.display = 'none';
}

async function handleUpdateStock(event) {
    event.preventDefault();
    
    const productId = document.getElementById('updateProductId').value;
    const quantityChange = parseInt(document.getElementById('updateQuantity').value);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/product/${productId}?qty=${quantityChange}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showMessage('Stock updated successfully! ✅', 'success');
            closeUpdateStockForm();
            loadAllProducts();
            loadDashboardStats();
        } else {
            showMessage('Failed to update stock', 'error');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        showMessage('Error updating stock', 'error');
    }
}

// ==================== Orders Management ====================
async function loadAllOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/orders`);
        allOrders = await response.json();
        displayOrdersTable(allOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showMessage('Failed to load orders', 'error');
    }
}

function displayOrdersTable(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="loading">No orders available</p>';
        return;
    }
    
    ordersList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Items</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.user?.email || 'Unknown'}</td>
                        <td>$${parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                        <td><span class="status-badge ${(order.status || 'PLACED').toLowerCase()}">${order.status || 'PLACED'}</span></td>
                        <td><span class="status-badge ${(order.paymentStatus || 'PENDING').toLowerCase()}">${order.paymentStatus || 'PENDING'}</span></td>
                        <td>${order.orderItems?.length || 0}</td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="showUpdateOrderForm(${order.id}, '${order.status}')">Update</button>
                            <button class="btn btn-secondary btn-small" onclick="viewOrderDetails(${order.id})">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    const filtered = statusFilter ? allOrders.filter(order => order.status === statusFilter) : allOrders;
    
    displayOrdersTable(filtered);
}

function showUpdateOrderForm(orderId, currentStatus) {
    document.getElementById('updateOrderId').value = orderId;
    document.getElementById('updateOrderIdDisplay').value = `#${orderId}`;
    document.getElementById('updateOrderStatus').value = currentStatus;
    document.getElementById('updateOrderForm').style.display = 'flex';
}

function closeUpdateOrderForm() {
    document.getElementById('updateOrderForm').style.display = 'none';
}

async function handleUpdateOrderStatus(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('updateOrderId').value;
    const newStatus = document.getElementById('updateOrderStatus').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?status=${newStatus}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showMessage('Order status updated successfully! ✅', 'success');
            closeUpdateOrderForm();
            loadAllOrders();
            loadDashboardStats();
        } else {
            showMessage('Failed to update order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showMessage('Error updating order status', 'error');
    }
}

async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        const order = await response.json();
        
        let itemsHtml = '';
        
        if (order.orderItems && order.orderItems.length > 0) {
            itemsHtml = order.orderItems.map(item => 
                `${item.product?.name || 'Product'} - Qty: ${item.quantity} @ $${parseFloat(item.price).toFixed(2)}`
            ).join('\n');
        }
        
        alert(`Order #${order.id}\nCustomer: ${order.user?.email || 'Unknown'}\nStatus: ${order.status}\nPayment: ${order.paymentStatus}\n\nItems:\n${itemsHtml}\n\nTotal: $${parseFloat(order.totalAmount).toFixed(2)}`);
    } catch (error) {
        console.error('Error fetching order details:', error);
        showMessage('Failed to load order details', 'error');
    }
}

// ==================== Users Management ====================
async function loadAllUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        allUsers = await response.json();
        displayUsersTable(allUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        showMessage('Failed to load users', 'error');
    }
}

function displayUsersTable(users) {
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = '<p class="loading">No users available</p>';
        return;
    }
    
    usersList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>#${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td><span style="background: ${user.role === 'ADMIN' ? '#e74c3c' : '#3498db'}; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px;">${user.role}</span></td>
                        <td>${new Date().toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ==================== Utility Functions ====================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
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
    initializeAdmin();
});
