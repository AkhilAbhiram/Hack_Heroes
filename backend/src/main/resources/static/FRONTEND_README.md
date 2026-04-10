# Order Management Frontend

A modern, responsive web frontend for the Order Management System built with vanilla HTML, CSS, and JavaScript.

## Features

### 🔐 Authentication
- **Login**: Users can log in with their email and password
- **Registration**: New users can create an account
- **Session Management**: User data is stored in browser's local storage
- Secure JWT token handling

### 📦 Product Management
- **View Products**: Browse all available products with pricing and stock information
- **Add Products**: Admin functionality to add new products
- **Product Details**: See detailed information including:
  - Product name, category, and brand
  - Price and available stock
  - Stock status badges (In Stock, Low Stock, Out of Stock)

### 🛒 Order Management
- **Create Orders**: Select multiple products and quantities to create orders
- **View Orders**: See all orders with their details
- **Order Tracking**: Monitor order status (PLACED, DELIVERED, etc.)
- **Payment Status**: Track payment status (PENDING, SUCCESS)
- **Order Details**: View detailed information about each order

### 📊 Dashboard
- **Quick Stats**: View total products and orders at a glance
- **User Information**: Display logged-in user's email
- **Navigation**: Easy navigation between different sections

## File Structure

```
src/main/resources/static/
├── index.html      # Authentication page (Login/Register)
├── dashboard.html  # Main application dashboard
├── style.css       # Styling and responsive design
└── app.js          # JavaScript functionality and API calls
```

## Setup Instructions

### Prerequisites
- Spring Boot backend running on `http://localhost:8080`
- MySQL database configured
- All backend endpoints properly configured

### Running the Application

1. **Start the Backend**:
   ```bash
   mvn spring-boot:run
   ```
   The application will run on `http://localhost:8080`

2. **Access the Frontend**:
   - Open your browser
   - Navigate to `http://localhost:8080`
   - You'll be redirected to the login page

3. **Create an Account or Login**:
   - Click "Register here" to create a new account
   - Or use existing credentials to log in

## API Endpoints

The frontend communicates with the following backend APIs:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Add new product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status

## Features in Detail

### Login Page
- Clean, modern design with gradient background
- Email and password input fields
- Toggle between login and registration forms
- Validation and error messages

### Dashboard
- **Top Navigation Bar**: Quick access to Dashboard, Products, Orders, and Logout
- **Sidebar**: Display current user information
- **Main Content Area**: Different sections for different features

### Products Section
- Grid view of all products
- Each product card shows:
  - Product name
  - Category and brand
  - Price
  - Stock availability with color-coded badges
  - "Add to Order" button
- Add Product modal for creating new products

### Orders Section
- Table view of all orders
- Columns include:
  - Order ID
  - Total amount
  - Status
  - Payment Status
  - Number of items
  - Details button
- Create Order modal to place new orders
- Multi-select product ordering with quantity control
- Real-time total calculation

### Dashboard Stats
- Total number of products
- Total number of orders
- Quick overview of system status

## Styling Highlights

- **Color Scheme**: Professional blue and gray palette
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Card-based Layout**: Products displayed in intuitive card format
- **Status Badges**: Color-coded indicators for order and stock status
- **Smooth Animations**: Fade-in and slide-in effects for better UX
- **Hover Effects**: Interactive elements provide visual feedback

## JavaScript Features

### Local Storage
- User data persistence across page reloads
- Authentication token management

### Real-time Updates
- Live order total calculation
- Dynamic product list loading
- Instant stats updates

### Error Handling
- User-friendly error messages
- Network error handling
- Validation feedback

### Form Management
- Automatic form clearing after submission
- Input field validation
- Modal dialog management

## Customization

### Changing API URL
In `app.js`, modify the API_BASE_URL constant:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Styling
All styles are in `style.css` with CSS variables for easy customization:
```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
}
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ❌ Not supported (uses ES6+)

## Security Note

**For Development/Demo Only**: This frontend stores authentication tokens in localStorage for simplicity. For production applications, consider:
- Using secure HttpOnly cookies
- Implementing proper token refresh mechanisms
- Adding CSRF protection
- Using HTTPS

## Troubleshooting

### Frontend not loading
- Ensure backend is running on port 8080
- Check browser console for errors
- Clear browser cache and reload

### Login fails
- Verify backend database has user records
- Check MySQL connection in backend
- Review server logs for errors

### Products not loading
- Ensure you're logged in
- Check CORS configuration in backend
- Verify database has product records

### Orders not saving
- Check order status validation
- Ensure selected products have sufficient stock
- Review backend service logs

## Future Enhancements

- JWT token integration
- User profile management
- Order history and filtering
- Search and filtering for products
- Shopping cart persistence
- Payment gateway integration
- Inventory management
- Admin dashboard
- Order notifications
- Product reviews and ratings
