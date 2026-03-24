# Inventory Management System (MERN Stack)

## Final Year BCA Project
A complete, industry-level Inventory Management System built with MongoDB, Express.js, React.js, and Node.js.
Features Role-Based Access Control, Stock Tracking, Barcode Generation, PDF Invoicing, Eco-Analytics, and AI-powered Chat.

## 🚀 Features
- **Role-Based Access**: Admin, Inventory Manager, Sales.
- **Stock Management**: Track Stock IN (Purchases) and Stock OUT (Sales).
- **Barcode System**: Auto-generate Code128 barcodes for products.
- **Eco Analytics**: Track carbon footprint of inventory.
- **AI Assistant**: Chat bot able to query stock levels and sales data.
- **Dark Mode**: Fully responsive UI with theme toggle.
- **Secure Auth**: JWT Authentication + Auto-Logout.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Axios.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **Tools**: jsPDF (Invoices), bwip-js (Barcodes), bcryptjs (Security).

## 📂 Project Structure
\`\`\`
inventory-management-system/
├── backend/          # REST API Server
│   ├── models/       # Database Schemas
│   ├── controllers/  # Business Logic
│   └── routes/       # API Endpoints
├── frontend/         # React Client
│   ├── src/
│   │   ├── components/ # Reusable UI
│   │   ├── pages/      # Views (Dashboard, Products...)
│   │   └── context/    # Auth & Theme State
\`\`\`

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file (copy `.env.example`):
   \`\`\`env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/inventory_db
   JWT_SECRET=your_super_secret_key
   \`\`\`
4. Start Server: `npm start` (or `npm run dev`)
   - Server runs on `http://localhost:5000`

### 2. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start Client: `npm run dev`
   - App runs on `http://localhost:5173`

### 3. Usage Guide
1. **Signup**: Register a new user (default role is 'Sales').
2. **Login**: Use credentials to access Dashboard.
3. **Admin Rights**: Manually change user role to 'admin' in MongoDB to access full features.
   - Or use the Signup form dropdown (enabled for demo purposes).
4. **Flow**:
   - Create Supplier -> Create Product (Barcode generated).
   - Create Purchase Order (Increases Stock).
   - Create Sales Order (Decreases Stock, Generates Invoice).
   - Check Reports for Analytics.

## 🧪 Testing Account
- You can create any account via Signup page.
- Select "Admin" role during signup to test all features.

