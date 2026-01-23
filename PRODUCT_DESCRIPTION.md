# DMT Digital Portal — Full Product Description

## Overview

The DMT Digital Portal is a full-stack web application for vehicle registration, status tracking, ownership transfer, and public vehicle information lookup. It supports multilingual interfaces (English, Sinhala, Tamil) and a comprehensive admin workflow for reviewing registration applications and managing the vehicle registry.

- Purpose: Digitize the end-to-end process of vehicle registration and ownership management
- Frontend: React + Vite, TailwindCSS, lucide-react icons, react-hot-toast, i18n
- Data Domains: Users, Applications, Vehicles, Vehicle Makes/Models, VIP number reservations, Documents, Payments

## Architecture

- Backend entry: `backend/server.js` — Express app, MongoDB connection with fallback, payload limits, routes mounted
- Routes:
  - Auth: `backend/routes/auth.js`
  - Applications: `backend/routes/applications.js`
  - Vehicles: `backend/routes/vehicles.js`
  - Vehicle Makes: `backend/routes/vehiclemakes.js`
- Models:
  - `Application`: `backend/models/Application.js`
  - `Vehicle`: `backend/models/Vehicle.js`
  - `User`: `backend/models/User.js`
  - `VehicleMake`: `backend/models/VehicleMake.js`
- Frontend: `frontend/src` with layouts, pages (Landing, Auth, Dashboard), components, store, and i18n

## Data Models

### Application
Key fields:
- Owner: `ownerEmail`, `ownerName`, `nationalIdNo`, `dateOfBirth`, `permanentAddress`, `phoneNumber`, `emailAddress`, `occupation`
- Vehicle: `registrationNumber (nullable)`, `vehicleClass`, `makeOfVehicle`, `modelOfVehicle`, `yearOfManufacture`, `engineNumber`, `chassisNumber`, `colorOfVehicle`, `fuelType`, `engineCapacity`, `numberOfCylinders`, `importedOrLocal`, `emissionStandard`, `noOfOwners`
- Documents (base64): `nidCopy`, `invoiceProof`, `insuranceDocument`, `emissionTest`, `inspectionReport (optional)`
- Status: `status (Pending|Approved|Rejected|Under Review)`
- Payment: `paymentReference`, `paymentAmount`, `paymentStatus (Pending|Paid)`
- VIP: `vipRequested`, `vipNumber`, `vipFee`
- Admin: `adminNotes`, `reviewedBy`, `reviewedAt`

### Vehicle
Key fields:
- Owner: `ownerEmail`, `fullName`, `nid`, `phone`, `email`, `address`
- Vehicle: `regNumber (unique)`, `vehicleType`, `chassisNumber`, `engineNumber`, `makeModel`, `fuelType`, `year`, `owners`, `ownershipType (Personal|Commercial)`
- Documents (base64): `nid`, `invoice`, `insurance`, `emission`, `approval (optional)`
- Status: `status (Pending|Approved|Rejected|Under Review)`
- Transfer: `transferStatus (None|Pending Transfer|Completed)`

### User
Key fields: `fullName`, `email (unique)`, `phone`, `nationalId`, `address`, `password (hashed)`, `profilePicture`

### VehicleMake
Key fields: `make (unique)`, `models[]`, `createdAt`

## Backend APIs

### Server
- `GET /` — health text
- `GET /api/health/db` — DB readyState (0..3)

### Auth (`/api/auth`)
- `POST /register` — Create user (validates inputs; hashes password)
- `POST /login` — JWT token issuance
- `GET /users` — List users
- `GET /user/:email` — Get user (excluding password)
- `PUT /user/:email` — Update profile; optionally change password with current-password verification; supports profile picture URL/base64

### Applications (`/api/applications`)
- `POST /submit` — Submit registration application
  - Validates all owner/vehicle fields and required documents
  - Computes base fee by vehicle class + optional VIP fee
  - Generates `paymentReference`
- `GET /user/:email` — List applications for a user
- `GET /all` — List all applications (admin)
- `GET /:id` — Get single application
- `PUT /:id/status` — Admin status update
  - On `Approved`, assigns `registrationNumber` (VIP honored if set; else auto-generated) and creates `Vehicle`

### Vehicles (`/api/vehicles`)
- `POST /register` — Direct vehicle creation with validation (used mainly by admin or system)
- `GET /all` — List all vehicles
- `GET /owner/:email` — List vehicles by owner email
- `GET /reg/:regNumber` — Get vehicle by registration number
- `GET /check-number/:number` — Check VIP registration number availability across Vehicles & Applications
- `PUT /status/:id` — Update vehicle status
- `DELETE /:id` — Delete vehicle

### Vehicle Makes (`/api/vehicle-makes`)
- `GET /makes` — Get all makes
- `GET /models/:make` — Get models for a make
- `POST /seed` — Seed Sri Lankan vehicle makes/models (one-time)

## Frontend Structure

### Layouts
- DashboardLayout — `Sidebar`, `TopBarDashboard`, `ChatWidget` (token check guard)
- AuthLayout — `TopBar`, `Navigation` + inline `Routes` for Login/Register
- LandingLayout — `TopBar`, `Navigation`, `Footer` with landing routes

### Routing (key paths)
- Landing: `/`, `/about`, `/privacy`, `/support`, `/check-details`, `/vehicleinfo/:regNumber`
- Auth: `/login`, `/register`
- Dashboard: `/dashboard`, `/register-vehicle`, `/transfer`, `/my-vehicles`, `/status`, `/settings`

## Landing Screens

### Home
- Hero CTA: Go to Dashboard (if logged in) or Register
- Features: Fast processing, secure verification, QR verification
- How It Works: 4-step explainer

### Vehicle Search
- Validates SL plate formats (e.g., `CAY-5555`, `32-7674`)
- Google reCAPTCHA gate (`VITE_RECAPTCHA_SITE_KEY`)
- Navigates to Vehicle Info

### Vehicle Info
- Displays vehicle details (mock data demo)
- Sections: owner, type/model, year, chassis/engine, registration dates, status with iconography

### About Us, Privacy Policy, Support, NotFound
- Static information and support

## Auth Screens

### Register
- Form: full name, email, phone (with country code), NIC/Passport, address, password
- Client-side validation; on success `POST /api/auth/register`; toast & redirect to Login

### Login
- Email/password validation; `POST /api/auth/login`
- Stores `token` and `userEmail`; success toast; redirect to Home

## Dashboard Screens

### Dashboard
- Stats from `GET /api/vehicles/owner/:email`: Total Vehicles, Pending Applications, Transfer Requests, Approved Applications
- Recent Activity: last 5 vehicles (make/model and status)
- Quick Actions: Register New Vehicle, Transfer Ownership, Check Status

### Register Vehicle (Application Submit)
Stepper with 5 stages:
1. Owner Information — personal and contact details
2. Vehicle Details — class, make, model, year, engine/chassis, fuel, capacity, cylinders, origin, emission, owners count
3. Upload Documents — NIC, invoice, insurance, emission, optional inspection (base64)
4. VIP Number — optional desired number; availability check via `/api/vehicles/check-number/:number`
5. Confirmation — review & submit via `POST /api/applications/submit` (backend computes fees & payment reference)

### Application Status
- Lists user applications via `GET /api/applications/user/:email`
- Detail modal: owner & vehicle info, document viewer (image/PDF), status icons
- PDF export for application via jsPDF
- Refresh control

### Transfer Vehicle
- Stepper: details, documents, confirmation
- Collects seller/buyer info and transfer documents
- (Current state) Frontend-only; backend endpoints required for persistence

### My Vehicles
- Searchable table with modal details
- (Current state) Sample data; can be wired to `GET /api/vehicles/owner/:email`

### Settings
- Profile settings: view/update profile and photo; notifications (client state)
- Security: change password (current password required)
- Login activity: sample entries
- Uses `GET/PUT /api/auth/user/:email`

## User Flows

### Registration & Application
1. Register account → Login
2. Go to Dashboard → Register Vehicle
3. Fill details, upload documents, optionally request VIP number
4. Submit application → Receive `paymentReference` & amount → Pay via post office (external)
5. Track status in Application Status
6. On `Approved`, vehicle entry created with assigned registration number

### VIP Number
- Check availability in Register Vehicle
- If requested and later approved, VIP number is assigned and vehicle created accordingly

### Status & Documents
- Application details with inline document viewer
- Downloadable PDF of application summary (user side)

### Profile Management
- Update profile details, upload profile picture (URL/base64)
- Change password with current password verification

## Admin Module (Features & Screens)

> Note: Admin UI is not yet implemented in the frontend. The backend already supports admin actions (e.g., reviewing applications). This section defines the complete admin experience aligned with current backend capabilities.

### Admin Login
- Admin credentials → JWT with role claim; session expiry and refresh policy

### Admin Dashboard
- Metrics: Pending, Approved, Rejected, Under Review counts; VIP request count; Today’s submissions
- System Health: DB readyState via `/api/health/db`
- Quick Actions: Review Queue, Vehicles, Users, Makes/Models, Reports

### Application Review Queue
- Fetch all via `GET /api/applications/all`
- Filters: status, date range, vehicle class, VIP request
- Sort: newest first, status, fee amount

### Application Details (Review)
- Sections: Owner info, Vehicle info, Documents (image/PDF), Payment (reference, amount, VIP fee, status), Admin notes
- Actions:
  - Approve — assigns registration number (VIP honored, else auto-generated) and creates `Vehicle`
  - Under Review — sets status; add `adminNotes`, `reviewedBy`
  - Reject — sets status with reason
- Audit: set `reviewedBy` and `reviewedAt`

### Vehicle Registry Management
- Search: `regNumber`, owner email, status
- View: full vehicle details and documents
- Actions:
  - Update Status via `PUT /api/vehicles/status/:id`
  - Delete Vehicle via `DELETE /api/vehicles/:id` (with safeguards)
  - Transfer Requests: handle vehicles with `transferStatus = 'Pending Transfer'` (future endpoints)

### VIP Number Management
- Check availability via `/api/vehicles/check-number/:number`
- View reservation queue from applications (`vipRequested`, `vipNumber`)
- Configure VIP fee and policy (future config endpoints)

### Makes/Models Catalog
- Browse, add, edit, remove makes & models
- Seed tool via `POST /api/vehicle-makes/seed` (one-time)

### User Management
- List users via `GET /api/auth/users`
- View profile; reset password; deactivate/reactivate accounts
- Admin action log (future): approvals, rejections, deletions

### Payments & Receipts
- Payment fields: `paymentReference`, `paymentAmount`, `paymentStatus`
- Mark payment `Paid` after external verification
- Export receipts/PDF for approved applications (admin-side PDF generation)

### Reports
- Export CSV/PDF for:
  - Applications by status/class/time
  - VIP allocations
  - Vehicles created in period
  - User registrations

### Admin Settings
- Profile, theme, language
- Security: 2FA (future), session management

### Audit & Security
- Role-based route guards (future middleware)
- Structured logging of admin actions (future)

## Internationalization
- Languages: English (`en`), Sinhala (`si`), Tamil (`ta`)
- Centralized i18n config with locale dictionaries

## Documents Handling
- Base64 storage for NIC, invoice, insurance, emission (optional inspection/report)
- Payload limits raised to 50MB (JSON & urlencoded) for uploads
- Inline viewer for images/PDF on user application details; similar viewers planned for admin

## Payment Flow
- Base fee by `vehicleClass` + VIP fee (if requested)
- `paymentReference` generated server-side (`DMT-<timestamp>-<emailHex>`)
- External payment (post office); application indicates steps to pay using reference
- `paymentStatus` toggled to `Paid` after back-office verification (future admin action)

## Security
- Bcrypt password hashing; JWT issuance on login
- Profile updates validate current password when changing password
- Server-side validation: NIC formats, phone, email, year ranges, required documents, VIP availability
- CORS enabled; controlled payload limits

## Known Gaps & Next Steps
- My Vehicles currently uses sample data — wire to `GET /api/vehicles/owner/:email`
- Transfer Vehicle lacks backend endpoints — add transfer request model and routes
- Admin UI not implemented — scaffold React admin app and integrate existing endpoints
- Role-based access control — add middleware to protect admin-only routes

## Quick Start & References
- Setup guides: `IMPLEMENTATION_GUIDE.md`, `QUICK_START.md`
- Backend scripts: `backend/seed.ps1`, `backend/seed.sh`
- Verify backend running: `GET /` → "DMT Digital Portal Backend is running"; `GET /api/health/db` for DB state

---

If you’d like, we can scaffold the Admin UI next (Dashboard, Queue, Details, Registry, Reports) and add role-based guards to the backend.