# CoachOps Frontend Redux Setup - Testing Guide

## Project Status

### ✅ Completed
1. **Redux Core Infrastructure**
   - RTK Query baseApi with JWT header injection
   - Auth slice with setCredentials, updateAccessToken, logout actions
   - Auth API endpoints (login, register, logout, getMe)
   - Redux store configuration with middleware

2. **Layout & Navigation**
   - Sidebar with role-based navigation (admin/teacher/parent)
   - Topbar with user profile and notifications
   - AdminLayout wrapper component
   - Tailwind CSS configuration with extended surface color palette

3. **Authentication**
   - Login page with Redux integration
   - Auth guard component for route protection
   - Role-based access control

4. **Basic Pages**
   - Dashboard (welcome page with stat cards)
   - Students list placeholder
   - Batches list placeholder
   - Attendance marking placeholder
   - Tests/Marks management placeholder

5. **App Configuration**
   - React Router v6 setup with role-based routing
   - Redux Provider in main.jsx
   - Toast notifications with react-hot-toast
   - Environment file (.env) with API URL

## How to Test Locally

### Prerequisites
- PostgreSQL 15+ running locally or accessible
- Node.js 18+
- Backend running on port 5000

### 1. Start Backend
```bash
cd Backend
npm install
npm run migrate  # Creates database schema
npm run dev     # Starts server on port 5000
```

### 2. Start Frontend
```bash
cd Frontend
npm install --legacy-peer-deps  # Already done
npm run dev  # Starts dev server (typically on port 5173)
```

### 3. Test Login Flow
1. Open http://localhost:5173
2. Should redirect to /login
3. Enter any email/password and click "Sign In"
4. Backend will validate and return user + tokens
5. Frontend Redux will store in state + localStorage
6. Should redirect to /admin dashboard
7. Sidebar should show role-based navigation

### 4. Test Navigation
- Click sidebar items to navigate between pages
- Click user profile to see logout button
- Logout should clear Redux state and localStorage, redirect to /login

## Architecture Highlights

### Frontend Stack
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod (to be added)
- **UI**: Lucide React icons, custom components

### File Structure
```
Frontend/src/
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── authApi.js
│   │   ├── authGuard.jsx
│   │   └── pages/
│   │       └── LoginPage.jsx
│   ├── dashboard/
│   │   └── DashboardPage.jsx
│   ├── students/
│   │   └── StudentsPage.jsx
│   ├── batches/
│   │   └── BatchesPage.jsx
│   ├── attendance/
│   │   └── AttendancePage.jsx
│   ├── tests/
│   │   └── TestsPage.jsx
│   └── ... other features
├── shared/
│   ├── store/
│   │   ├── baseApi.js
│   │   └── store.js
│   └── components/
│       └── layout/
│           ├── Sidebar.jsx
│           ├── Topbar.jsx
│           └── AdminLayout.jsx
├── App.jsx
├── main.jsx
└── ...
```

### Key Components

#### Redux Store (`shared/store/store.js`)
```javascript
configureStore({
  reducer: { auth, api },
  middleware: [api.middleware]
})
```

#### API Integration (`shared/store/baseApi.js`)
```javascript
createApi({
  baseQuery: fetchBaseQuery with JWT headers
  tagTypes: [Student, Batch, Attendance, Test, ...]
})
```

#### Auth Flow
1. User submits login form
2. RTK Query calls POST /api/v1/auth/login
3. Backend returns `{ success, data: { user, access_token, refresh_token } }`
4. Frontend dispatches `setCredentials(response.data)`
5. Redux stores in state + localStorage
6. AuthGuard checks selectIsAuthenticated
7. Navigation redirects based on user.role

## Next Steps

### Phase 1: Form Infrastructure (Next)
- Add react-hook-form integration
- Add Zod validation schemas
- Create reusable Input, Select, Button components

### Phase 2: CRUD Pages
- Students: List, Add, Edit, Delete
- Batches: List, Add, Edit, Delete
- Attendance: Mark, View history
- Tests: Create, Edit, View results

### Phase 3: Advanced Features
- Analytics dashboard with charts
- Biometric device integration
- Email/WhatsApp notifications
- Report generation

### Phase 4: Deployment
- Build optimization (code splitting, lazy loading)
- Environment-specific configs
- CI/CD pipeline setup

## Common Issues & Solutions

### 1. Redux DevTools
- Install Redux DevTools browser extension for debugging
- View store state and dispatch actions in real-time

### 2. CORS Errors
- Ensure backend has proper CORS headers
- Check `Backend/src/app.js` middleware configuration

### 3. Auth Token Expired
- RTK Query will auto-retry failed requests
- Implement refresh token flow to get new access token (to be added)

### 4. Styling Issues
- Verify Tailwind CSS is generating classes correctly
- Check `tailwind.config.js` theme colors
- Clear Vite cache if classes don't apply: `rm -rf dist && npm run dev`

## Testing Credentials

Since authentication is delegated to the backend, test with:
- Email: test@example.com
- Password: password123

Backend will validate and create institute + user on first registration.
