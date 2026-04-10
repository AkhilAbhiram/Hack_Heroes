# Order Management System - Frontend Documentation

## 🎯 Overview

This frontend now features **role-based access control** with separate dashboards for **Customers** and **Admins**. The authentication system automatically redirects users to their appropriate dashboard based on their role.

## 🔐 Authentication & Role-Based Access

### Login & Registration
- Users register with their name, email, password, and **account type** (Customer or Admin)
- The `role` field is stored in the User entity and used for authentication
- After login, users are automatically redirected to their respective dashboard

### User Roles

#### 👥 **Customer Role**
- Browse and search products
- View product details and availability
- Add products to shopping cart
- Manage cart (add, remove, update quantities)
- Proceed to checkout
- Place orders
- View order history and tracking
- Track payment status

#### ⚙️ **Admin Role**
- View comprehensive dashboard with statistics
- **Inventory Management**:
  - Add new products
  - View all products with stock levels
  - Update product stock quantities
  - Monitor low-stock items
- **Order Management**:
  - View all customer orders
  - Update order status (PLACED → PROCESSING → SHIPPED → DELIVERED)
  - Filter orders by status
  - View order details and items
- **User Management**:
  - View all registered users
  - See user information (name, email, role)
- **Real-time Dashboard**:
  - Total products, orders, and users
  - Pending orders count
  - Quick statistics overview

---

## 📱 Customer Dashboard

### Features

#### 1. **Shop Section**
- Browse all available products in a responsive grid layout
- Search by product name or brand
- Filter by product category
- View product details:
  - Name, category, brand
  - Price
  - Available stock with color-coded badges
  - Add to Cart button (disabled if out of stock)

#### 2. **Shopping Cart**
- Sidebar shows real-time item count
- Add products with adjustable quantities
- Manage cart from checkout page:
  - Increase/decrease quantities
  - Remove items
  - View subtotals for each item
  - See cart Total

#### 3. **Checkout Section**
- Review all cart items
- View order summary
- Select payment method:
  - Credit/Debit Card
  - UPI
  - Net Banking
  - Cash on Delivery
- Enter shipping address
- Place order with total calculation

#### 4. **My Orders Section**
- View all placed orders
- See order ID, total amount, status, payment status
- View detailed order items and quantities
- Track delivery status

### Customer Navigation
```
Login → Customer Dashboard → Shop
                          → Checkout
                          → My Orders
                          → Logout
```

### API Endpoints Used (Customer)
```
GET    /api/products              - Get all products
POST   /api/orders                - Create new order
GET    /api/orders                - Get all orders (filtered by user)
GET    /api/orders/{id}           - Get order details
POST   /api/payments              - Process payment
```

---

## ⚙️ Admin Dashboard

### Features

#### 1. **Dashboard Section**
Statistics overview with 4 key metrics:
- 📦 Total Products
- 🛒 Total Orders
- 👥 Total Users
- 📊 Pending Orders

#### 2. **Inventory Management**
**Products List:**
- View all products in table format
- Product details: ID, Name, Category, Brand, Price, Stock
- Color-coded stock status badges:
  - 🟢 In Stock (green)
  - 🟡 Low Stock (yellow) - <= 10 units
  - 🔴 Out of Stock (red) - 0 units
- Search/filter products by name, category, or brand

**Add Product:**
- Modal form to add new products
- Fields: Name, Category, Price, Stock, Brand
- Real-time dashboard update after adding

**Update Stock:**
- Click "Update Stock" button for any product
- Modal form for inventory adjustment
- Supports both adding and removing quantities
- Negative values reduce stock, positive values increase

#### 3. **Order Management**
**Orders List:**
- View all customer orders in table format
- Display: Order ID, Customer Email, Total Amount, Status, Payment Status
- Color-coded status badges
- Filter orders by status:
  - PLACED
  - PROCESSING
  - SHIPPED
  - DELIVERED
  - CANCELLED

**Update Order Status:**
- Click "Update" button on any order
- Modal to change order status
- Drop-down with available status options
- Real-time dashboard update

**View Order Details:**
- Quick view of order items and amounts
- Customer email and order totals

#### 4. **User Management**
**Users List:**
- View all registered users in table format
- Display: User ID, Name, Email, Role, Join Date
- Color-coded role badges:
  - Red: Admin
  - Blue: Customer

### Admin Navigation
```
Login → Admin Dashboard → Dashboard
                      → Inventory (Products)
                      → Orders
                      → Users
                      → Logout
```

### API Endpoints Used (Admin)
```
POST   /api/admin/product              - Add new product
GET    /api/admin/products             - Get all products
PUT    /api/admin/product/{id}         - Update product stock
GET    /api/admin/orders               - Get all orders
PUT    /api/admin/orders/{id}/status   - Update order status
GET    /api/admin/users                - Get all users
GET    /api/orders/{id}                - Get order details
```

---

## 🔄 Workflow Examples

### Customer Workflow
1. **Register/Login** → Selects "Customer" account type
2. **Browse Products** → Search and filter products
3. **Add to Cart** → Adjust quantities
4. **Checkout** → Fill payment info and shipping address
5. **Place Order** → Order created with status "PLACED"
6. **Track Order** → View in "My Orders" section

### Admin Workflow
1. **Register/Login** → Selects "Admin" account type
2. **View Dashboard** → Check overall statistics
3. **Manage Inventory** → Add products or update stock
4. **Process Orders** → View orders and update status
5. **Monitor Users** → View customer accounts
6. **Update Status** → Change order status as it progresses

---

## 🗄️ Database Schema Changes

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    private String name;
    private String email;
    private String password;
    
    @Column(nullable = false)
    private String role; // "CUSTOMER" or "ADMIN"
}
```

### Supported Roles
- `CUSTOMER` - Regular customer account
- `ADMIN` - Administrative account with full access

---

## 📁 File Structure

```
src/main/resources/static/
├── index.html                 # Authentication page
├── customer-dashboard.html    # Customer interface
├── admin-dashboard.html       # Admin interface
├── app.js                     # Shared auth logic
├── customer.js               # Customer-specific functions
├── admin.js                  # Admin-specific functions
├── style.css                 # All styling (shared + role-specific)
└── FRONTEND_README.md        # Original documentation
```

---

## 🎨 UI Features

### Common Elements
- **Responsive Design** - Works on desktop, tablet, mobile
- **Color-coded Status** - Easy visual identification
- **Real-time Updates** - Dashboard stats update immediately
- **Form Validation** - Client-side validation with feedback
- **Error Messages** - User-friendly error notifications
- **Success Feedback** - Confirmation messages for actions

### Customer UI
- Shopping grid layout for products
- Cart sidebar with item count
- Search and filter functionality
- Checkout form with multiple payment options
- Order history table

### Admin UI
- Dashboard with 4 statistics cards
- Modal forms for adding/updating
- Comprehensive data tables
- Status filters for orders
- Quick action buttons

---

## 🔒 Security Considerations

**Current Implementation** (Development):
- Basic authentication with localStorage
- Token-based session management
- Role-based access control in frontend

**Production Recommendations**:
- Use secure HttpOnly cookies instead of localStorage
- Implement JWT tokens from backend
- Add CSRF protection
- Use HTTPS for all communications
- Server-side role validation
- Rate limiting for API calls

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- MySQL database
- Spring Boot backend running on port 8080

### Setup Steps

1. **Update User Entity** (done ✅)
   - Role field added to User class
   - Default role set to "CUSTOMER"

2. **Start Backend**
   ```bash
   mvn spring-boot:run
   ```

3. **Access Application**
   ```
   http://localhost:8080
   ```

4. **Create Test Accounts**
   - Register as Customer (test@customer.com)
   - Register as Admin (admin@test.com)

5. **Test Each Role**
   - Login as customer to see customer dashboard
   - Login as admin to see admin dashboard

---

## 🧪 Testing Checklist

### Customer Features
- ✅ Browse products
- ✅ Search/filter products
- ✅ Add to cart
- ✅ Update quantities
- ✅ Checkout process
- ✅ Place order
- ✅ View order history
- ✅ Track orders

### Admin Features
- ✅ View dashboard stats
- ✅ Add new products
- ✅ Update product stock
- ✅ View all orders
- ✅ Update order status
- ✅ Filter orders by status
- ✅ View user list
- ✅ View order details

---

## 🐛 Troubleshooting

### Login Issues
- **Wrong page after login**: Check browser console for role value
- **Data not loading**: Ensure backend is running and accessible
- **CORS errors**: Verify CORS configuration in backend

### Page Not Displaying
- Clear browser cache
- Check localStorage for user data
- Verify JavaScript files are loading (browser F12 → Network tab)

### Orders Not Saving
- Check console for API errors
- Verify order data structure matches backend expectations
- Check database connectivity

---

## 📞 Support

For issues or questions:
1. Check browser console (F12 → Console)
2. Review backend server logs
3. Verify database connection
4. Check API endpoint responses

---

## 📝 Future Enhancements

- Payment gateway integration
- Order cancellation
- Order return/refund management
- Product reviews and ratings
- Wishlist functionality
- Admin reports and analytics
- Email notifications
- SMS order tracking
- Multi-language support
- Advanced inventory forecasting
