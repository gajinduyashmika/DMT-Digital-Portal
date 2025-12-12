# 🚀 Quick Start Guide - Vehicle Registration System

## Windows PowerShell Setup

### Step 1: Start the Backend Server
```powershell
cd backend
npm run dev
```
✓ Backend runs on `http://localhost:5000`

### Step 2: Seed the Vehicle Database (PowerShell)
Open a NEW PowerShell window in the project root:
```powershell
./backend/seed.ps1
```

Or manually seed:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicle-makes/seed" -Method POST
```

### Step 3: Start the Frontend
Open another PowerShell window:
```powershell
cd frontend
npm run dev
```
✓ Frontend runs on `http://localhost:5173`

---

## What Was Implemented

### ✅ Occupation Autocomplete
- 500+ occupations in dropdown
- Type to search, click to select
- Step 1: Owner Information

### ✅ Dynamic Vehicle Makes & Models
- 30+ Sri Lankan vehicle makes
- 200+ vehicle models
- Make dropdown → Model dropdown updates automatically
- Step 2: Vehicle Details

### ✅ Vehicle Makes Database
**Sample Vehicles:**
- **Toyota**: Corolla, Vitz, Aqua, Allion, Fielder, Mark X, Prius, Hiace, Land Cruiser, Fortuner, Innova, Yaris, Camry, Alphard, Sienna
- **Honda**: City, Civic, CR-V, Accord, Odyssey, Jazz, Fit, BR-V, Pilot, HR-V, Freed
- **Suzuki**: Swift, Alto, WagonR, Vitara, Jimny, Celerio, Dzire, Ertiga, SX4, Baleno, Margalla
- **Hyundai**: i10, i20, Accent, Elantra, Santa Fe, Tucson, Creta, Grand i10, Xcent, Venue, Kona
- **Motorcycles**: Bajaj, Hero, TVS, Royal Enfield, Harley-Davidson, Yamaha
- **Plus 20+ more makes and 150+ additional models**

### ✅ PDF Generation Fixed
- Proper page breaks
- All vehicle information displays correctly
- Occupation field included
- Multi-language support

---

## Test the Application

### 1. Register a Vehicle
1. Go to Dashboard → Register a Vehicle
2. **Step 1**: 
   - Fill owner details
   - Type "eng" in Occupation → See suggestions
   - Click a suggestion to auto-fill
3. **Step 2**:
   - Select "Toyota" from Make dropdown
   - Model dropdown automatically shows Toyota models
   - Select "Corolla"
4. **Step 3**: Upload documents
5. **Step 4**: Review and submit

### 2. Check Application Status
1. Go to Application Status
2. View your submitted application
3. Click "View Details"
4. Download PDF (should work perfectly)

### 3. Check Database (Optional)
```powershell
# Get all vehicle makes
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicle-makes/makes" -Method GET

# Get models for a specific make
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicle-makes/models/Honda" -Method GET
```

---

## API Endpoints

### Vehicle Makes API
```
GET  /api/vehicle-makes/makes           - Get all vehicle makes
GET  /api/vehicle-makes/models/:make    - Get models for a make
POST /api/vehicle-makes/seed            - Seed database (idempotent)
```

### Example Responses

**Get Makes:**
```json
["Toyota", "Honda", "Suzuki", "Hyundai", ...]
```

**Get Models:**
```json
["Corolla", "Vitz", "Aqua", "Allion", "Fielder", ...]
```

---

## File Structure

```
backend/
├── models/
│   ├── Application.js      (Vehicle applications)
│   ├── Vehicle.js          (Approved vehicles)
│   ├── VehicleMake.js      ✨ NEW - Vehicle makes & models
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── applications.js
│   ├── vehicles.js
│   └── vehiclemakes.js     ✨ NEW - Makes API endpoints
├── seed.ps1                ✨ NEW - PowerShell seeder
├── seed.sh                 (Updated for cross-platform)
└── server.js               (Updated with vehiclemakes route)

frontend/src/pages/dashboard/
├── RegisterVehicle.tsx     ✨ ENHANCED - Occupations + Dynamic makes/models
└── ApplicationStatus.tsx   ✨ FIXED - PDF generation
```

---

## Troubleshooting

### "Database already seeded"
✓ This is normal! It means the database is ready to use.

### "Cannot find backend"
Make sure backend is running:
```powershell
cd backend
npm run dev
```

### Models dropdown shows empty
1. Refresh the page
2. Make sure a Make is selected first
3. Check backend is running

### PDF not downloading
1. Refresh the page
2. Check browser console for errors
3. Ensure application has all required fields

---

## Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Occupation Autocomplete | ✅ Working | Step 1 - Occupation field |
| Vehicle Makes Dropdown | ✅ Working | Step 2 - Make of Vehicle |
| Dynamic Models Loading | ✅ Working | Step 2 - Model of Vehicle |
| PDF Generation | ✅ Fixed | Application Status - Download |
| Multi-language Support | ✅ Working | English, Sinhala, Tamil |
| Dark Mode | ✅ Working | All pages |
| Form Validation | ✅ Working | All steps |
| Tooltip Help | ✅ Working | All form fields |

---

## Next Steps

1. ✅ Test all features in the application
2. ✅ Verify PDF generation works
3. ✅ Check occupation suggestions work
4. ✅ Verify dynamic vehicle models load
5. Ready for production deployment!

---

**Last Updated**: December 10, 2025
**Status**: ✅ All Features Complete
