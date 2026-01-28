# FreshLocal - Local Farmer Marketplace MVP

A full-stack marketplace platform connecting farmers in Maharashtra with local buyers within a 10 km radius using GPS-based distance filtering.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Payments**: Razorpay (Test Mode) + Cash on Delivery
- **Location**: Browser Geolocation API

## ✨ Features

### For Buyers
- 🗺️ GPS-based product discovery (10 km radius)
- 🛒 Shopping cart functionality
- 💳 Dual payment options (COD + Razorpay)
- 📦 Order tracking
- 🔍 Category filtering (Fruit, Vegetable, Grain, Rice)
- 📍 Maharashtra location restriction

### For Farmers
- 🌾 Product management (Add/Edit/Delete)
- 📍 Manual GPS coordinate input
- 📊 Order management
- ✅ Admin approval workflow
- 📦 Order status updates (New/Packed)

### For Admins
- 👨‍🌾 Farmer approval system
- 📊 Dashboard with statistics
- 👥 User management
- 🗑️ Content moderation

## 🔐 Demo Credentials

### Admin
- Email: `admin@freshlocal.com`
- Password: `admin123`

### Farmer
- Email: `farmer1@example.com`
- Password: `farmer123`
- Location: Mumbai (19.0760, 72.8777)

### Buyer
- Email: `buyer@example.com`
- Password: `buyer123`
- Location: Mumbai (19.1136, 72.8697)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Yarn package manager

### Environment Variables

The `.env` file is already configured with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/farmer_marketplace?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
RAZORPAY_KEY_ID=rzp_test_S7q3CO3nDQNDu4
RAZORPAY_KEY_SECRET=5jMPeQpMt0V25E5vIHDnS6Ds
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S7q3CO3nDQNDu4
```

### Database Setup

```bash
# PostgreSQL is already running
# Database and tables are already created
# Seed data is already loaded
```

### Running the Application

```bash
# Install dependencies (already done)
yarn install

# Start development server
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products?latitude={lat}&longitude={lon}&category={category}` - Get products (filtered by location)
- `GET /api/products/my` - Get farmer's products
- `POST /api/products` - Create product (farmer only)
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/buyer` - Get buyer orders
- `GET /api/orders/farmer` - Get farmer orders
- `PUT /api/orders/{id}` - Update order status

### Admin
- `GET /api/admin/farmers/pending` - Get pending farmer approvals
- `PUT /api/admin/farmers/{id}` - Approve/reject farmer
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/stats` - Get platform statistics

## 🧪 Testing

### Buyer Flow
1. Login as buyer: `buyer@example.com / buyer123`
2. Allow location access (GPS)
3. Browse products within 10 km
4. Add items to cart
5. Checkout with COD or Razorpay
6. View order history

### Farmer Flow
1. Login as farmer: `farmer1@example.com / farmer123`
2. View your products
3. Add new products
4. View received orders
5. Update order status to "Packed"

### Admin Flow
1. Login as admin: `admin@freshlocal.com / admin123`
2. View dashboard statistics
3. Approve/reject pending farmers
4. Manage users

## 🗺️ GPS Distance Calculation

The platform uses the **Haversine formula** to calculate distances between GPS coordinates:

```javascript
// Located in: /app/lib/gps.js
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Returns distance in kilometers
}
```

### Maharashtra Boundaries
- Latitude: 15.6° to 22.0° N
- Longitude: 72.6° to 80.9° E

## 💳 Payment Integration

### Razorpay Test Mode
- Test cards work in test mode
- No actual charges
- Payment verification with signature validation

### Cash on Delivery
- Always available
- Order marked as "paid" immediately

## 🎨 Design System

### Colors
- Primary: Green (#16a34a)
- Background: White & Gray-50
- Text: Gray-900, Gray-600

### Components
- All components from shadcn/ui
- Mobile-first responsive design
- Clean, professional aesthetic

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js  # Backend API routes
│   ├── page.js                    # Frontend UI
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── lib/
│   ├── prisma.js                  # Prisma client
│   ├── auth.js                    # Authentication helpers
│   └── gps.js                     # GPS utilities
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.js                    # Seed data
├── components/ui/                 # shadcn components
└── .env                           # Environment variables
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Admin approval for farmers
- Payment signature verification
- Maharashtra location restriction

## 📊 Database Schema

### User
- Basic auth fields
- Role (buyer/farmer/admin)
- Approval status

### BuyerProfile
- Address details
- GPS coordinates (optional)

### FarmerProfile
- GPS coordinates (required)
- Phone number

### Product
- Name, category, price
- Quantity, image
- Farmer relation

### Order & OrderItem
- Payment details
- Order status
- Item-level tracking

## 🚧 Known Limitations (MVP Scope)

- No chat functionality
- No delivery tracking
- No reviews/ratings
- No multilingual support
- Test mode payments only
- No email notifications

## 🔄 Future Enhancements

- Real-time order tracking
- In-app chat
- Product reviews
- Multiple language support
- SMS notifications
- Advanced analytics
- Image upload for products
- Delivery partner integration

## 📝 Notes

- Razorpay script loads from CDN
- Location access required for buyers
- Farmers need admin approval
- 10 km radius is fixed
- Maharashtra restriction enforced

## 🐛 Troubleshooting

### Location Not Working
- Ensure HTTPS or localhost
- Allow browser location access
- Check Maharashtra boundaries

### Payment Failed
- Verify Razorpay credentials
- Check signature validation
- Use Razorpay test cards

### Products Not Showing
- Verify buyer GPS location
- Check 10 km radius
- Ensure farmer is approved

## 📄 License

This is an MVP project for demonstration purposes.

---

Built with ❤️ for Maharashtra's farmers
