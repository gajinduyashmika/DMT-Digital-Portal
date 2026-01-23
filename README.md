# DMT Digital Portal

A comprehensive digital platform for the Department of Motor Traffic (DMT) to streamline vehicle registration, ownership transfers, and citizen services. This repository contains the Frontend, Admin Panel, and Backend API.

## 🚀 Features

### For Citizens (User Portal)
*   **Vehicle Registration**: Online application submission with document uploads.
*   **Ownership Transfers**: Initiate and track transfer requests.
*   **Dashboard**: Real-time status tracking of all vehicles and applications.
*   **Notifications**: Personalized alerts for application updates and transfer approvals.
*   **Announcements**: System-wide updates and news pinned to the dashboard.
*   **Live Chat**: Direct communication with DMT support.
*   **Visual Appeal**: Modern, responsive design with dark mode support.

### For Administrators (Admin Portal)
*   **Dashboard**: High-level overview of system stats (Vehicles, Users, Pending Apps).
*   **Application Review**: Verify documents, approve/reject requests with comments.
*   **Ownership Management**: Oversee and approve transfer of ownership.
*   **User Management**: View user details, vehicle history, and manage access.
*   **Announcements**: Create, pin, and manage public announcements.
*   **Audit Logs**: Comprehensive logs of all admin actions for accountability.
*   **OCR Integration**: (Experimental) Automated document verification features.

## 🛠️ Technology Stack

**Frontend (User & Admin)**
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **State Management**: React Context / Custom Hooks
*   **HTTP Client**: Axios

**Backend**
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens)
*   **AI Integration**: Google Generative AI (for intelligent features)
*   **File Handling**: Multer (for document uploads)

## 📂 Project Structure

```bash
dmt-digital-portal/
├── admin-frontend/     # Admin Dashboard (React + Vite)
├── backend/            # API Server (Node.js + Express)
└── frontend/           # User Portal (React + Vite)
```

## ⚙️ Prerequisites

*   Node.js (v18 or higher)
*   MongoDB (Local or Atlas connection string)
*   npm or yarn

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install

# Create a .env file based on the keys below
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# GEMINI_API_KEY=your_google_ai_key
# ADMIN_EMAIL=admin@dmt.gov.lk

npm run dev
```

### 2. User Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm run dev
```

## 📖 Usage

1.  **Access User Portal**: Open `http://localhost:5173` (default Vite port) to register/login as a citizen.
2.  **Access Admin Portal**: Open `http://localhost:5174` (or allocated port) to login as an administrator.
3.  **API**: The backend runs on `http://localhost:5000`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.

---
*Built for the Department of Motor Traffic Digital Transformation Initiative.*
