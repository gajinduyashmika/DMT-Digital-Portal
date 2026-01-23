# DMT Digital Portal - Department of Motor Traffic Digitization

## 📋 Project Overview

The **DMT Digital Portal** is a state-of-the-art web platform developed for the Department of Motor Traffic (DMT). It aims to completely digitize the vehicle registration and ownership transfer process, reducing physical paperwork, wait times, and administrative burden. The system provides two distinct experiences:
1.  **Citizen Portal**: For users to register vehicles, request transfers, and track status.
2.  **Admin Portal**: For DMT officials to review applications, verify documents, and manage system operations.

## ✨ Key Features

### 🚗 For Citizens (User Portal)
*   **End-to-End Online Registration**: Submit vehicle details, upload documents (NIC, Invoice, Insurance), and pay fees online.
*   **Ownership Transfers**: Initiate transfer requests, which the seller can approve/reject via their own dashboard.
*   **Real-time Dashboard**: Track the status of all your applications and vehicles (Pending, Under Review, Approved).
*   **Notification Center**: Receive instant alerts for application updates, transfer requests, and general announcements.
*   **Pinned Announcements**: Important public service announcements are highlighted at the top of the dashboard.
*   **Live Chat**: Direct support channel to communicate with DMT administration.
*   **VIP Number Request**: Option to check availability and request special/VIP vehicle registration numbers.

### 🛡️ For Administrators (Admin Portal)
*   **Operational Dashboard**: Real-time statistics on total vehicles, pending applications, active users, and system health.
*   **Application Management**: Detailed review interface for new registrations. View documents side-by-side, verify info, and correct/reject with comments.
*   **Ownership Transfer Oversight**: Review and final approval workflow for vehicle transfers between citizens.
*   **User Management**: centralized view of all registered citizens, with the ability to block/unblock users.
*   **Announcement Management**: Create, edit, and pin public announcements to the citizen dashboard.
*   **Audit Logs**: Comprehensive, immutable logs of every action taken within the system for security and accountability.
*   **Automated Verification**: Integrated AI/OCR tools to assist in verifying uploaded document authenticity (Proof of Concept).

## 🛠️ Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | High performance, component-based architecture. |
| **Styling** | **Tailwind CSS** | Rapid UI development with a consistent, modern design system. |
| **Icons** | **Lucide React** | Lightweight, consistent icon set. |
| **Backend** | **Node.js + Express** | Scalable, event-driven RESTful API. |
| **Database** | **MongoDB (Mongoose)** | Flexible schema for complex vehicle/application data. |
| **Authentication** | **JWT (JSON Web Tokens)** | Stateless, secure user authentication. |
| **AI Integration** | **Google Generative AI** | Used for intelligent features and document analysis. |
| **File Storage** | **Multer / Local** | Handling document and image uploads. |

## 📂 Project Structure

```bash
dmt-digital-portal/
├── admin-frontend/     # Admin Dashboard Source
│   ├── src/
│   │   ├── components/ # Reusable UI components (Announcements, Dashboard, etc.)
│   │   ├── contexts/   # AuthContext for state management
│   │   └── pages/      # Route pages
├── backend/            # REST API Server
│   ├── models/         # Mongoose Schemas (User, Vehicle, Application, etc.)
│   ├── routes/         # API Endpoints (Auth, Admin, Vehicles, etc.)
│   └── middleware/     # Auth verification, upload handling
└── frontend/           # Citizen Portal Source
    ├── src/
    │   ├── pages/      # Dashboard, Registration, Transfer pages
    │   └── components/ # UI Elements
```

## ⚙️ Configuration & Environment Variables

This project requires environment variables to be set in the `backend` folder. Create a `.env` file in `dmt-digital-portal/backend/`:

```env
# Server Configuration
PORT=5000

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dmt_db

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# AI Integration (Optional)
GEMINI_API_KEY=your_google_gemini_api_key

# Admin Setup (Initial Admin)
ADMIN_EMAIL=admin@dmt.gov.lk
```

## 🚀 Installation & Run Guide

### 1. Backend Setup
The backend is the heart of the application. It must be running for the frontends to work.

```bash
cd backend
npm install                 # Install dependencies
npm run dev                 # Start server with Nodemon (auto-restart)
# Server runs on http://localhost:5000
```

### 2. User Frontend Setup (Citizen Portal)

```bash
cd frontend
npm install                 # Install dependencies
npm run dev                 # Start Vite dev server
# App runs on http://localhost:5173
```

### 3. Admin Frontend Setup (Admin Portal)

```bash
cd admin-frontend
npm install                 # Install dependencies
npm run dev                 # Start Vite dev server
# App runs on http://localhost:5174
```

## � API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new citizen account. |
| `POST` | `/login` | Authenticate user and return JWT. |
| `GET` | `/user/:email` | Get current user profile details. |

### Vehicles (`/api/vehicles`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/owner/:email` | Get all vehicles owned by a specific user. |
| `POST` | `/register` | Register an existing vehicle (Migration). |
| `GET` | `/check-number/:num` | Check availability of a specific registration number. |
| `POST` | `/public-search` | Publicly query vehicle status (Limited data). |

### Applications (`/api/applications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/submit` | Submit a new vehicle registration application. |
| `GET` | `/user/:email` | Get all applications for a user. |
| `GET` | `/:id` | Get details of a specific application. |

### Admin (`/api/admin`) - *Requires Admin Token*
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/stats` | Fetch aggregated dashboard statistics. |
| `GET` | `/applications` | List all applications with filtering. |
| `PUT` | `/applications/:id/approve` | Approve an application and generate vehicle record. |
| `PUT` | `/applications/:id/reject` | Reject an application with comments. |
| `GET` | `/users` | List all registered users. |
| `PUT` | `/users/:id/block` | Block a user account. |

### Announcements (`/api/announcements`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Fetch active announcements (supports `?target=all`). |
| `POST` | `/` | Admin: Create a new announcement (supports pinning). |

## 🤝 Contribution Workflow

1.  **Fork** the repository to your GitHub account.
2.  **Clone** your fork locally.
3.  **Branch** for your feature: `git checkout -b feature/NewFeature`.
4.  **Commit** your changes: `git commit -m 'Add NewFeature'`.
5.  **Push** to your branch: `git push origin feature/NewFeature`.
6.  Open a **Pull Request** on the main repository.

## 📄 License
This project is proprietary software developed for the Department of Motor Traffic. Unauthorized duplication or distribution is prohibited.

---
*Generated by the DMT Digital Transformation Team.*
