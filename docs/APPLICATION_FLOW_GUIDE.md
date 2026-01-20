# Family Tree Application - Complete Flow Guide

## 🏗️ Application Architecture Overview

This is a **React-based family tree application** called "Synora" that helps users create, manage, and visualize their family relationships. The app uses **Redux Toolkit** for state management and follows a modern React architecture pattern.

### Tech Stack
- **Frontend**: React 19.2.0 with Vite
- **State Management**: Redux Toolkit + React-Redux
- **Routing**: React Router DOM
- **Styling**: CSS Modules
- **Testing**: Vitest + React Testing Library + Fast-Check (Property-based testing)
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion + GSAP
- **Forms**: React Hook Form + Zod validation

---

## 📱 Application Flow & User Journey

### 1. **Authentication Flow**
```
Landing Page → Sign Up/Sign In → Profile Setup → Dashboard
```

**Pages Involved:**
- `LandingPage.jsx` - Marketing/welcome page
- `SignUpPage.jsx` - User registration
- `SignInPage.jsx` - User login
- `ForgotPasswordPage.jsx` - Password recovery
- `ResetPasswordPage.jsx` - Password reset
- `ProfileSetupPage.jsx` - Initial profile creation
- `OnboardingSuccessPage.jsx` - Welcome confirmation

**Key Features:**
- Email/password authentication
- Google & Apple SSO integration
- Mock mode for development (`VITE_MOCK_API=true`)
- JWT token management (stored in localStorage)

### 2. **Main Application Flow**
```
Dashboard → Family Tree → Add Members → Upload Photos → Events
```

---

## 🗂️ Redux State Management

The application uses **6 main Redux slices** to manage different aspects of the app:

### **1. Auth Slice** (`authSlice.js`)
**Purpose**: Manages user authentication state
```javascript
State: {
  user: null,           // Current authenticated user
  isAuthenticated: false,
  isLoading: false,
  error: null
}
```

**Key Actions:**
- `signUp()` - Register new user
- `signIn()` - Login user
- `signInWithGoogle()` - Google OAuth
- `signInWithApple()` - Apple OAuth
- `signOut()` - Logout user
- `resetPassword()` - Password recovery

### **2. User Slice** (`userSlice.js`)
**Purpose**: Manages user profile information
```javascript
State: {
  profile: null,        // User profile data
  isLoading: false,
  error: null
}
```

**Key Actions:**
- `updateProfile()` - Update user profile
- `uploadProfilePhoto()` - Upload profile picture

### **3. Family Slice** (`familySlice.js`)
**Purpose**: Manages family members and relationships
```javascript
State: {
  members: [],          // Array of family members
  relationships: [],    // Array of family relationships
  isLoading: false,
  error: null
}
```

**Key Actions:**
- `getFamilyMembers()` - Fetch all family members
- `getRelationships()` - Fetch family relationships
- `addFamilyMember()` - Add new family member

### **4. Tree Slice** (`treeSlice.js`)
**Purpose**: Manages family tree visualization state
```javascript
State: {
  selectedMemberId: null,    // Currently selected member
  searchQuery: '',           // Search input
  searchResults: [],         // Search results
  showTooltip: false,        // First-time user tooltip
  zoomLevel: 1               // Tree zoom level
}
```

### **5. Dashboard Slice** (`dashboardSlice.js`)
**Purpose**: Manages dashboard data and widgets
```javascript
State: {
  recentUpdates: [],         // Recent family activities
  upcomingEvents: [],        // Upcoming family events
  onlineUsers: [],           // Currently online family members
  isLoading: false
}
```

### **6. Memory Slice** (`memorySlice.js`)
**Purpose**: Manages photo uploads and family memories
```javascript
State: {
  photos: [],               // Uploaded photos
  uploadingFiles: [],       // Files being uploaded
  isLoading: false
}
```

---

## 📄 Page-by-Page Breakdown

### **Dashboard Page** (`DashboardPage.jsx`)
**Purpose**: Main landing page after login - family activity hub

**What it shows:**
- Personalized greeting with user's name
- **Recent Updates**: Latest family activities (birthdays, new photos, new members)
- **Quick Actions**: Shortcuts to common tasks (Add relative, Upload photos, etc.)
- **Upcoming Events**: Family events and birthdays
- **Online Now**: Currently active family members

**Data Sources:**
- Uses `dashboardSlice` for main data
- Currently uses mock data (will be replaced with real API calls)
- Loads data on component mount via `loadDashboardData()`

**Key Components:**
- `RecentUpdates` - Shows family activity feed
- `QuickActions` - Action buttons for common tasks
- `UpcomingEvents` - Calendar widget
- `OnlineNow` - Active users widget

### **Family Tree Page** (`FamilyTreePage.jsx`)
**Purpose**: Interactive family tree visualization - the core feature

**What it shows:**
- **Visual family tree** with connected member cards
- **Search functionality** to find specific family members
- **Member detail panel** when someone is selected
- **Tree owner profile** (current user) in sidebar
- **Add relative functionality** via placeholders and modals

**Data Flow:**
1. Loads family members via `getFamilyMembers()`
2. Loads relationships via `getRelationships()`
3. Renders tree using `TreeCanvas` component
4. Handles member selection via `setSelectedMember()`
5. Manages search via `performSearch()`

**Key Components:**
- `TreeCanvas` - Main tree visualization (uses Three.js)
- `SearchInput` - Member search functionality
- `ZoomControls` - Tree zoom in/out
- `TreeOwnerProfile` - Current user's profile card
- `MemberDetailPanel` - Selected member details
- `AddRelativeModal` - Form to add new family members

**State Management:**
- Uses `familySlice` for member/relationship data
- Uses `treeSlice` for UI state (selection, search, zoom)

### **Add Family Member Page** (`AddFamilyMemberPage.jsx`)
**Purpose**: Form to add new family members with full details

**What it collects:**
- **Relationship info**: How they're related to current user
- **Personal info**: Name, date of birth, gender, photo
- **Contact info**: Email address (optional)
- **Status**: Living/deceased, invite to join network

**Form Validation:**
- Real-time validation as user types
- Required field checking
- Email format validation
- Date format validation (DD/MM/YYYY)
- File size validation for photos

**Data Flow:**
1. Gets URL params for relationship type and related person
2. Validates form data in real-time
3. Submits via `addFamilyMember()` action
4. Redirects back to family tree or dashboard

### **Upload Photos Page** (`UploadPhotosPage.jsx`)
**Purpose**: Bulk photo upload for family memories

**Features:**
- Drag & drop photo upload
- Photo preview grid
- Batch upload processing
- Photo tagging and categorization

### **Events Page** (`EventsPage.jsx`)
**Purpose**: Family calendar and event management

**Features:**
- View upcoming family events
- Create new events
- Birthday reminders
- Event invitations

---

## 🔄 Data Flow Patterns

### **1. Authentication Flow**
```
User Action → Auth Service → Redux Action → State Update → UI Update
```

Example: User logs in
1. User submits login form
2. `signIn()` action dispatched
3. `AuthService.login()` called
4. JWT tokens stored in localStorage
5. User data stored in Redux state
6. UI redirects to dashboard

### **2. Family Data Flow**
```
Page Load → Redux Action → Service Call → Mock/API Response → State Update → Component Re-render
```

Example: Loading family tree
1. `FamilyTreePage` mounts
2. `getFamilyMembers()` and `getRelationships()` dispatched
3. `FamilyService` methods called
4. Mock data returned (or real API in production)
5. Redux state updated with family data
6. `TreeCanvas` re-renders with new data

### **3. Form Submission Flow**
```
Form Input → Validation → Redux Action → Service Call → Success/Error → UI Update
```

Example: Adding family member
1. User fills out form in `AddFamilyMemberPage`
2. Real-time validation checks form validity
3. On submit, `addFamilyMember()` action dispatched
4. `FamilyService.addMember()` called
5. Success: redirect to family tree, Error: show error message
6. Family tree refreshes with new member

---

## 🛠️ Services Layer

The app uses a **services layer** to handle API calls and business logic:

### **AuthService.js**
- Handles all authentication-related API calls
- Manages JWT token refresh
- Provides mock responses in development mode

### **FamilyService.js**
- Manages family member CRUD operations
- Handles relationship management
- Processes family tree data

### **UserService.js**
- User profile management
- Photo upload handling
- Profile updates

### **MemoryService.js**
- Photo upload and management
- Memory/album creation
- Photo tagging and search

### **ValidationService.js**
- Form validation utilities
- Data sanitization
- Business rule validation

---

## 🎨 Component Architecture

### **Layout Components**
- `NavigationBar` - Main app navigation
- `ErrorBoundary` - Error handling wrapper
- `ProtectedRoute` - Authentication guard
- `PublicRoute` - Redirect if authenticated

### **Form Components**
- `Input` - Text input with validation
- `Select` - Dropdown selection
- `DateInput` - Date picker with formatting
- `Toggle` - On/off switch
- `Button` - Styled button component
- `ImageUpload` - File upload with preview

### **Tree Visualization Components**
- `TreeCanvas` - Main tree rendering (Three.js)
- `TreeNode` - Individual family member card
- `ConnectionLines` - Relationship lines between members
- `ZoomControls` - Tree navigation controls
- `PlaceholderCard` - Empty slots for adding members

### **Dashboard Components**
- `RecentUpdates` - Activity feed
- `QuickActions` - Action shortcuts
- `UpcomingEvents` - Calendar widget
- `OnlineNow` - Active users
- `Greeting` - Personalized welcome message

---

## 🧪 Testing Strategy

The app uses **dual testing approach**:

### **Unit Tests** (`.test.jsx`)
- Test specific component behavior
- Test form validation
- Test utility functions
- Use React Testing Library

### **Property-Based Tests** (`.property.test.jsx`)
- Test universal properties across many inputs
- Use Fast-Check library for random input generation
- Test data transformations and business logic
- Validate correctness properties

**Example Property Test:**
```javascript
// Tests that adding a task always increases list length
fc.assert(fc.property(
  fc.array(fc.string()),
  fc.string().filter(s => s.trim().length > 0),
  (taskList, newTask) => {
    const originalLength = taskList.length;
    const newList = addTask(taskList, newTask);
    return newList.length === originalLength + 1;
  }
));
```

---

## 🔧 Development Features

### **Mock Mode**
- Set `VITE_MOCK_API=true` in `.env`
- All API calls return mock data
- Enables development without backend
- Simulates realistic delays and responses

### **Hot Reloading**
- Vite provides instant updates during development
- Redux DevTools for state debugging
- React DevTools for component inspection

### **Build Process**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run all tests
- `npm run test:watch` - Watch mode testing

---

## 🚀 Key User Interactions

### **Adding a Family Member**
1. User clicks "Add Relative" from dashboard or family tree
2. Modal opens or navigates to `AddFamilyMemberPage`
3. User selects relationship type and fills form
4. Form validates in real-time
5. On submit, member is added to Redux state
6. Family tree updates to show new member
7. User can immediately see and interact with new member

### **Viewing Family Tree**
1. User navigates to family tree page
2. App loads all family members and relationships
3. `TreeCanvas` renders interactive tree visualization
4. User can search, zoom, and click on members
5. Clicking a member shows detailed information
6. User can add relatives directly from tree view

### **Uploading Photos**
1. User drags photos to upload area
2. Photos are validated and previewed
3. User can tag photos with family members
4. Photos are uploaded and added to family memories
5. Photos appear in dashboard recent updates

---

## 📊 State Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │───▶│  Auth Pages     │───▶│   Dashboard     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │  Family Tree    │◀────────────┘
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │ Add Member Page │
                       └─────────────────┘
```

This guide should give you a complete understanding of how the application works, from the high-level architecture down to specific user interactions and data flows. Each component has a specific purpose and fits into the larger family tree management system.