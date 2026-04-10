# 🎨 Order Management System - Frontend

This is the **complete frontend** for the Order Management System with role-based access control for customers and admins.

---

## 📁 Folder Structure

```
frontend/
├── index.html                    # Authentication page (Login/Register)
├── customer-dashboard.html       # Customer dashboard (Shop, Checkout, Orders)
├── admin-dashboard.html          # Admin dashboard (Stats, Inventory, Orders, Users)
├── dashboard.html                # Legacy dashboard (deprecated)
├── app.js                        # Shared authentication & utility functions
├── customer.js                   # Customer-specific functionality
├── admin.js                      # Admin-specific functionality
├── style.css                     # All styling (shared + role-specific)
├── FRONTEND_README.md            # Original frontend documentation
├── ROLE_BASED_SYSTEM.md          # Detailed workflow & feature documentation
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Backend server running on `http://localhost:8080`
- MySQL database connected and configured
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Frontend

#### Option 1: Via Backend Server (Recommended)
The frontend is served automatically by the Spring Boot backend when you run:
```bash
mvn spring-boot:run
```
Then access: `http://localhost:8080`

#### Option 2: Using a Local HTTP Server
To run the frontend independently:

**Using Python 3:**
```bash
cd frontend
python -m http.server 8081
```
Then access: `http://localhost:8081`

**Using Node.js (http-server):**
```bash
cd frontend
npx http-server -p 8081
```

**Using Node.js (any version):**
```bash
cd frontend
node -e "require('http').createServer((q,s)=>require('fs').createReadStream(require('path').join('.', q.url==='/'?'index.html':q.url)).pipe(s)).listen(8081)"
```

---

## 🔐 Authentication

### Login
1. Enter your email and password
2. Click "Login"
3. System redirects based on your role:
   - **CUSTOMER** → Customer Dashboard
   - **ADMIN** → Admin Dashboard

### Registration
1. Click "Register"
2. Enter name, email, password, and select account type
3. Account types:
   - **Customer** - Can browse products and place orders
   - **Admin** - Can manage inventory and orders
4. Login with your new credentials

---

## 👥 User Roles & Features

### 🛍️ Customer Dashboard

**Features:**
- **Shop Section**
  - Browse all products with grid layout
  - Search by name or brand
  - Filter by category
  - View stock availability
  - Add items to cart

- **Shopping Cart**
  - Real-time item count in sidebar
  - View cart contents
  - Update quantities
  - Remove items
  - See cart total

- **Checkout**
  - Review order items
  - Select payment method:
    - Credit/Debit Card
    - UPI
    - Net Banking
    - Cash on Delivery
  - Enter shipping address
  - Place order

- **My Orders**
  - View order history
  - Track order status
  - View payment status
  - See order details

**Navigation:**
- Shop → Add to Cart → Checkout → Order Confirmation
- My Orders → View Status & Details

---

### ⚙️ Admin Dashboard

**Features:**
- **Dashboard**
  - Total products count
  - Total orders count
  - Total users count
  - Pending orders count
  - Real-time statistics

- **Inventory Management**
  - View all products with stock levels
  - Add new products
  - Update product stock (increase/decrease quantities)
  - Search and filter products
  - Stock status badges (In Stock, Low Stock, Out of Stock)

- **Order Management**
  - View all customer orders
  - Filter orders by status
  - Update order status:
    - PLACED → PROCESSING → SHIPPED → DELIVERED
    - Can also cancel orders
  - View customer email and order totals

- **User Management**
  - View all registered users
  - See user roles (Admin/Customer)
  - Display user information

**Navigation:**
- Dashboard (Statistics)
- Inventory (Product Management)
- Orders (Order Management)
- Users (User Directory)
- Logout

---

## 📱 Responsive Design

- **Desktop** (1200px+): Full-featured layout with all panels visible
- **Tablet** (768px - 1199px): Optimized grid and table layouts
- **Mobile** (< 768px): Stacked layout with accessible navigation

All components are fully responsive and work great on any device!

---

## 🔌 API Integration

### Backend Requirements
The frontend communicates with backend API endpoints at `http://localhost:8080`:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

**Products (Customer & Admin):**
- `GET /api/products` - Get all products
- `GET /api/admin/products` - Get all products (admin endpoint)

**Orders (Customer):**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

**Payments:**
- `POST /api/payments` - Process payment

**Admin Operations:**
- `POST /api/admin/product` - Add new product
- `PUT /api/admin/product/{id}` - Update product stock
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/users` - Get all users

---

## 🎨 Styling

### Colors & Design
- **Primary Color:** Blue (#007bff)
- **Success Color:** Green (#28a745)
- **Warning Color:** Orange (#ffc107)
- **Danger Color:** Red (#dc3545)
- **Background:** Light gray (#f8f9fa)

### Key Components
- Responsive grid layouts (CSS Grid & Flexbox)
- Modal dialogs for forms
- Status badges with color coding
- Table views with sorting/filtering
- Navigation bars and sidebars
- Form validation styling

### Animation
- Fade-in animations for page loads
- Smooth transitions on hover
- Loading states for buttons

---

## 🛠️ File Descriptions

### Index Files
- **index.html** - Entry point with login and register forms

### Dashboard Files
- **customer-dashboard.html** - Customer workspace (Shop, Cart, Checkout, Orders)
- **admin-dashboard.html** - Admin control panel (Dashboard, Inventory, Orders, Users)
- **dashboard.html** - Legacy unified dashboard (deprecated)

### JavaScript Files
- **app.js** - Shared authentication logic, utility functions, localStorage management
- **customer.js** - Customer-specific functions (cart, orders, checkout)
- **admin.js** - Admin-specific functions (inventory, order management, statistics)

### Styling
- **style.css** - All CSS including:
  - Authentication page styles
  - Dashboard layouts
  - Component styling
  - Animations
  - Responsive breakpoints
  - Role-specific customizations

### Documentation
- **FRONTEND_README.md** - Original frontend setup guide
- **ROLE_BASED_SYSTEM.md** - Comprehensive feature documentation
- **README.md** - This file

---

## 🔒 Security Features

### Current Implementation
- JWT token-based authentication
- Role-based access control (RBAC)
- localStorage for session management
- CORS-enabled API communication

### Production Recommendations
- Use HttpOnly cookies instead of localStorage
- Implement HTTPS/TLS encryption
- Add CSRF protection tokens
- Server-side role validation
- Rate limiting on API endpoints
- Input validation and sanitization

---

## 🧪 Testing Checklist

### Customer Workflow
- [ ] Register as Customer
- [ ] Login with customer credentials
- [ ] Verify redirected to customer dashboard
- [ ] Browse products
- [ ] Search/filter products
- [ ] Add items to cart
- [ ] View cart contents
- [ ] Proceed to checkout
- [ ] Enter shipping address
- [ ] Select payment method
- [ ] Place order
- [ ] View in "My Orders"
- [ ] Logout and re-login to verify persistence

### Admin Workflow
- [ ] Register as Admin
- [ ] Login with admin credentials
- [ ] Verify redirected to admin dashboard
- [ ] View dashboard statistics
- [ ] Add new product
- [ ] Update product stock
- [ ] View all products
- [ ] View all orders
- [ ] Filter orders by status
- [ ] Update order status
- [ ] View user list
- [ ] Logout and re-login to verify persistence

### Cross-Functional
- [ ] Multiple users can login simultaneously
- [ ] Cart persists across page navigation
- [ ] Orders appear in admin view when customer places order
- [ ] Role-based separation is enforced
- [ ] Backend API errors are handled gracefully

---

## 🐛 Troubleshooting

### Page Not Loading
1. Check browser console (F12 → Console)
2. Verify backend server is running on localhost:8080
3. Check network tab for failed API requests
4. Clear cache and refresh (Ctrl+Shift+R)

### Login Issues
- **Wrong credentials**: Verify user registration
- **Stuck on login page**: Check console for errors
- **Wrong dashboard shown**: Verify user role in database

### Cart Not Saving
- Check browser localStorage (F12 → Application → Storage)
- Verify JavaScript is enabled
- Try clearing cache and re-adding items

### API Errors
- 404: Endpoint not found - verify backend endpoints
- 500: Server error - check backend logs
- CORS error: Verify CORS configuration in backend
- 401: Unauthorized - check JWT token validity

### Database Connection
- Verify MySQL is running
- Check database status in backend logs
- Verify orderdb database exists

---

## 📊 Performance Tips

- Use browser's developer tools to check load times
- Images and assets are cached by browser
- Local storage reduces API calls for user data
- Lazy load product images if numerous

---

## 🚀 Deployment

### Frontend Separation From Backend
You can deploy the frontend independently:

1. **Separate Frontend Server** (recommended for scaling):
   - Deploy to Vercel, Netlify, AWS S3 + CloudFront, etc.
   - Update API_BASE_URL in app.js to point to backend API

2. **Combined Deployment**:
   - Keep frontend in `src/main/resources/static/`
   - Deploy entire Spring Boot application

### For Separate Frontend Hosting:
1. Update backend URLs in JavaScript files
2. Ensure CORS is properly configured
3. Deploy frontend to CDN/hosting service
4. Update API endpoints

---

## 📚 Documentation Files

- **FRONTEND_README.md** - Original setup and integration guide
- **ROLE_BASED_SYSTEM.md** - Complete feature documentation with workflows
- **README.md** - This file

---

## 🔄 Backend Folder Location

The corresponding backend is located at:
```
../order/
```

With the folder structure:
```
order/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/order/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── entity/
│   │   │       ├── repository/
│   │   │       ├── dto/
│   │   │       ├── config/
│   │   │       ├── exceptions/
│   │   │       └── utils/
│   │   └── resources/
│   │       ├── static/      (Original frontend location)
│   │       └── application.properties
│   └── test/
├── pom.xml
└── target/
```

---

## 📞 Support & Debugging

### Enable Debug Logging
Add to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

### Check API Responses
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action to trigger API call
4. Click on API request to see details
5. View Response tab for data/errors

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| 404 errors | Verify backend is running on port 8080 |
| CORS errors | Check backend CORS configuration |
| Blank page | Open console (F12) and check for JS errors |
| Cart not working | Check localStorage is enabled in browser |
| Orders not saving | Verify database connection in backend |

---

## 📝 Notes

- Frontend files are duplicated in both locations for flexibility:
  - Backend: `order/src/main/resources/static/` (served by Spring Boot)
  - Separate: `frontend/` (for independent frontend development)

- To keep both in sync during development:
  - Edit files in the `frontend/` folder
  - Copy changes to `order/src/main/resources/static/` for backend serving

- Or develop the `frontend/` folder with npm/build tools if preferred

---

## ✨ Features Summary

✅ **Role-based authentication** (Customer vs Admin)  
✅ **Customer shopping interface** (Browse, Cart, Checkout, Orders)  
✅ **Admin management panel** (Inventory, Orders, Users, Stats)  
✅ **Responsive design** (Mobile, Tablet, Desktop)  
✅ **Real-time updates** (Dashboard stats, cart count)  
✅ **Payment integration** (Multiple payment methods)  
✅ **Order tracking** (Status updates and history)  
✅ **Inventory management** (Stock control)  
✅ **User management** (View all users)  
✅ **Data persistence** (localStorage + backend)  

---

## 🎯 Next Steps

1. **For Development:**
   - Edit files in this `frontend/` folder
   - Run a local HTTP server or use backend
   - Test with different user roles
   - Debug using browser DevTools

2. **For Learning:**
   - Review ROLE_BASED_SYSTEM.md for workflows
   - Explore app.js, customer.js, admin.js for logic
   - Study style.css for responsive design

3. **For Production:**
   - Follow deployment guidelines above
   - Update security configurations
   - Set up HTTPS/TLS
   - Configure proper database
   - Enable logging and monitoring

---

**Happy coding! 🚀**
