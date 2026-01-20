# Roots - Family Tree Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Specifications](#specifications)
5. [Code Structure](#code-structure)
6. [Key Components](#key-components)
7. [Services & Contexts](#services--contexts)
8. [Getting Started](#getting-started)
9. [Development Guide](#development-guide)

---

## Project Overview

**Roots** is a React-based family tree application that allows users to:
- Create and manage their family tree
- Add family members with relationships
- Visualize family connections
- Organize family events
- Share memories and photos

### Tech Stack
- **Frontend**: React 18+ with Vite
- **State Management**: Redux Toolkit
- **Styling**: CSS3 with responsive design
- **Testing**: Property-based testing with fast-check
- **Build Tool**: Vite

### Color Scheme
- **Primary Green**: `#0d7377` (used for active states, borders, highlights)
- **Light Green**: `#f0fdfa` (backgrounds)
- **Gray**: `#64748b` (text), `#e2e8f0` (borders)
- **Background**: `#f5f7f5` (light gray)

---

## Architecture

### High-Level Structure

```
Roots App
├── Redux Store (Centralized State)
│   ├── Auth Slice
│   ├── User Slice
│   ├── Family Slice
│   ├── Memory Slice
│   ├── Dashboard Slice
│   └── Tree Slice
├── Authentication Layer
├── User Management
├── Family Data Layer
├── Dashboard
├── Family Tree Visualization
├── Events Management
├── Photo Gallery
└── Messaging
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Dispatch Redux Action
    ↓
Redux Thunk (Async)
    ↓
Service/API Call
    ↓
Redux Store Update
    ↓
Component Re-render (via useSelector)
```

---

## Features

### 1. Family Tree Visualization
- Interactive canvas with pan and zoom
- Hierarchical tree layout (parents above, children below)
- Root member highlighted with green border
- Placeholder cards for adding new members
- Search functionality to highlight members

### 2. Member Management
- Add family members with relationships
- Edit member information
- Support for multiple relationship types:
  - Parent/Child
  - Spouse
  - Sibling
- Optional tags/labels for members

### 3. Events Management
- Create family events
- Invite family members
- Invite external guests from other trees
- Event categories (Celebration, Reunion, Dinner, Trip, Memorial)
- Pending invitations tracking

### 4. Photo Management
- Upload family photos
- Organize photos by member
- Photo gallery view

### 5. Dashboard
- Quick actions for common tasks
- Recent updates feed
- Family statistics
- Greeting message

---

## Specifications

### 1. Landing & Authentication Spec
**Location**: `.kiro/specs/landing-auth-onboarding/`

**Features**:
- User registration and login
- Email verification
- Password reset
- Onboarding flow
- SSO integration

**Key Components**:
- `LandingPage.jsx` - Marketing landing page
- `SignUpPage.jsx` - User registration
- `SignInPage.jsx` - User login
- `ForgotPasswordPage.jsx` - Password recovery
- `OnboardingSuccessPage.jsx` - Post-signup confirmation

### 2. Dashboard Spec
**Location**: `.kiro/specs/dashboard/`

**Features**:
- Welcome greeting
- Quick action buttons
- Recent activity feed
- Family statistics
- Navigation to other sections

**Key Components**:
- `DashboardPage.jsx` - Main dashboard
- `Greeting.jsx` - Welcome message
- `QuickActions.jsx` - Action buttons
- `RecentUpdates.jsx` - Activity feed

### 3. Family Tree Spec
**Location**: `.kiro/specs/family-tree/`

**Features**:
- Interactive tree visualization
- Member cards with photos
- Relationship connections
- Add/edit members
- Search and filter
- Zoom and pan controls

**Key Components**:
- `FamilyTreePage.jsx` - Main page
- `TreeCanvas.jsx` - Canvas for rendering
- `TreeNode.jsx` - Individual node
- `MemberCard.jsx` - Member display
- `PlaceholderCard.jsx` - Add member placeholder
- `TreeOwnerProfile.jsx` - Current user profile

### 4. Quick Actions Spec
**Location**: `.kiro/specs/quick-actions/`

**Features**:
- Add family member
- Create event
- Upload photos
- Send message
- View statistics

**Key Components**:
- `QuickActions.jsx` - Action buttons
- `AddRelativeModal.jsx` - Add member modal
- `CreateEventModal.jsx` - Create event modal

---

## Code Structure

### Directory Layout

```
src/
├── components/          # Reusable UI components
│   ├── MemberCard.jsx
│   ├── TreeCanvas.jsx
│   ├── AddRelativeModal.jsx
│   ├── CreateEventModal.jsx
│   ├── NavigationBar.jsx
│   └── ...
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   ├── FamilyTreePage.jsx
│   ├── EventsPage.jsx
│   ├── LandingPage.jsx
│   └── ...
├── redux/              # Redux store and slices
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       ├── userSlice.js
│       ├── familySlice.js
│       ├── memorySlice.js
│       ├── dashboardSlice.js
│       └── treeSlice.js
├── services/           # API and business logic
│   ├── AuthService.js
│   ├── UserService.js
│   ├── FamilyService.js
│   ├── InviteService.js
│   └── MemoryService.js
├── utils/              # Utility functions
│   ├── treeLayout.js   # Tree layout algorithm
│   ├── relationshipPath.js
│   └── ...
├── hooks/              # Custom React hooks
├── theme/              # Theme configuration
└── App.jsx             # Main app component
```

---

## Key Components

### 1. TreeCanvas Component
**Purpose**: Renders the interactive family tree visualization

**Props**:
```javascript
{
  members: Array,           // Family members
  relationships: Array,     // Relationships between members
  rootMemberId: String,     // ID of tree owner
  onMemberClick: Function,  // Click handler
  onPlaceholderClick: Function, // Add member handler
  rootCardRef: Ref          // Reference to root card
}
```

**Features**:
- Pan and zoom with mouse/touch
- Keyboard navigation
- Search highlighting
- Responsive layout

### 2. MemberCard Component
**Purpose**: Displays individual family member

**Props**:
```javascript
{
  member: Object,           // Member data
  relationshipLabel: String, // e.g., "Father", "Me / Root"
  isRoot: Boolean,          // Is this the tree owner?
  isSelected: Boolean,      // Is this selected?
  isHighlighted: Boolean,   // Is this in search results?
  isDimmed: Boolean,        // Should this be dimmed?
  onClick: Function         // Click handler
}
```

**Styling**:
- Root card: Green border (3px), light green background
- Selected: Green border, shadow effect
- Highlighted: Orange border, animation
- Hover: Lift effect, enhanced shadow

### 3. AddRelativeModal Component
**Purpose**: Modal for adding new family members

**Props**:
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  onSubmit: Function,
  relationshipType: String,  // 'parent', 'spouse', 'child'
  relatedToMember: Object    // Member being related to
}
```

**Form Fields**:
- First Name (required)
- Last Name (required)
- Birth Year (optional)
- Status (Living/Deceased)
- Tag/Label (optional)
- Profile Photo (optional)

### 4. CreateEventModal Component
**Purpose**: Modal for creating family events

**Props**:
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  onSubmit: Function
}
```

**Form Fields**:
- Event Name
- Category (Celebration, Reunion, Dinner, Trip, Memorial)
- Date and Time
- Location
- Guest Selection (All members or specific people)
- Invite from other trees option

### 5. TreeOwnerProfile Component
**Purpose**: Displays current user profile in sidebar

**Props**:
```javascript
{
  treeOwner: Object,
  onAddParents: Function,
  onAddSpouse: Function,
  onAddChildren: Function,
  hasSpouse: Boolean
}
```

**Sections**:
- Profile photo and name
- "Tree Owner" badge with crown emoji
- "GROW YOUR TREE" section with action buttons

---

## Services & Redux State Management

### Redux Store
**Purpose**: Centralized state management for the entire application

**Configuration**: `src/redux/store.js`

**Slices**:
- `authSlice` - Authentication state
- `userSlice` - User profile state
- `familySlice` - Family members and relationships
- `memorySlice` - Photos and memories
- `dashboardSlice` - Dashboard data
- `treeSlice` - Tree UI state (zoom, pan, selection)

**DevTools**: Redux DevTools are automatically enabled in development mode for debugging

### Using Redux in Components

**Basic Pattern**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectFamilyMembers, addFamilyMember } from '../redux/slices/familySlice';

function MyComponent() {
  const dispatch = useDispatch();
  const familyMembers = useSelector(selectFamilyMembers);
  
  const handleAdd = async (memberData) => {
    await dispatch(addFamilyMember(memberData)).unwrap();
  };
}
```

### Auth Slice
**Purpose**: Manages authentication state

**State**:
```javascript
{
  user: null | User,
  isAuthenticated: Boolean,
  isLoading: Boolean,
  error: String | null
}
```

**Actions**:
- `signUp(email, password, fullName)` - Register new user
- `signIn(email, password)` - User login
- `signInWithGoogle()` - Google OAuth
- `signInWithApple()` - Apple OAuth
- `signOut()` - User logout
- `resetPassword(email)` - Password reset
- `updatePassword(token, newPassword)` - Update password
- `clearError()` - Clear error state

**Selectors**:
- `selectUser(state)` - Get current user
- `selectIsAuthenticated(state)` - Get auth status
- `selectAuthLoading(state)` - Get loading state
- `selectAuthError(state)` - Get error message

**Usage**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { signIn, selectUser, selectAuthError } from '../redux/slices/authSlice';

function LoginComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const error = useSelector(selectAuthError);
  
  const handleLogin = async (email, password) => {
    try {
      await dispatch(signIn({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

### Family Slice
**Purpose**: Manages family data and relationships

**State**:
```javascript
{
  familyMembers: Array,
  relationships: Array,
  isLoading: Boolean,
  error: String | null
}
```

**Actions**:
- `addFamilyMember(memberData)` - Add new member
- `updateFamilyMember({ memberId, memberData })` - Update member
- `getFamilyMembers(forceRefresh)` - Fetch all members
- `getRelationships(forceRefresh)` - Fetch all relationships
- `clearError()` - Clear error state

**Selectors**:
- `selectFamilyMembers(state)` - Get all family members
- `selectRelationships(state)` - Get all relationships
- `selectFamilyLoading(state)` - Get loading state
- `selectFamilyError(state)` - Get error message
- `selectMemberById(state, memberId)` - Get specific member (memoized)

**Usage**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectFamilyMembers, 
  selectRelationships,
  addFamilyMember,
  getFamilyMembers 
} from '../redux/slices/familySlice';

function FamilyComponent() {
  const dispatch = useDispatch();
  const familyMembers = useSelector(selectFamilyMembers);
  const relationships = useSelector(selectRelationships);
  
  useEffect(() => {
    dispatch(getFamilyMembers());
    dispatch(getRelationships());
  }, [dispatch]);
  
  const handleAdd = async (memberData) => {
    await dispatch(addFamilyMember(memberData)).unwrap();
  };
}
```

**Mock Mode**:
- Set `VITE_MOCK_API=true` in `.env`
- Returns mock data without API calls
- Useful for development without backend

### Tree Slice
**Purpose**: Manages tree visualization state

**State**:
```javascript
{
  selectedMemberId: String | null,
  searchQuery: String,
  searchResults: Array,
  zoomLevel: Number,      // 10-200%
  panOffset: { x: Number, y: Number },
  showFirstTimeTooltip: Boolean
}
```

**Actions**:
- `setSelectedMember(memberId)` - Select member
- `setSearchQuery(query)` - Set search query
- `performSearch({ query, members })` - Search members
- `setZoomLevel(level)` - Set zoom level
- `zoomIn()` - Zoom in
- `zoomOut()` - Zoom out
- `setPanOffset({ x, y })` - Set pan offset
- `resetTreeView()` - Reset zoom, pan, and selection
- `dismissTooltip()` - Dismiss first-time tooltip
- `checkFirstTimeVisit()` - Check if first visit

**Selectors**:
- `selectSelectedMemberId(state)` - Get selected member ID
- `selectSearchQuery(state)` - Get search query
- `selectSearchResults(state)` - Get search results
- `selectZoomLevel(state)` - Get zoom level
- `selectPanOffset(state)` - Get pan offset
- `selectShowTooltip(state)` - Get tooltip visibility

**Usage**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectZoomLevel,
  selectPanOffset,
  zoomIn,
  zoomOut,
  setPanOffset 
} from '../redux/slices/treeSlice';

function TreeComponent() {
  const dispatch = useDispatch();
  const zoomLevel = useSelector(selectZoomLevel);
  const panOffset = useSelector(selectPanOffset);
  
  const handleZoomIn = () => dispatch(zoomIn());
  const handleZoomOut = () => dispatch(zoomOut());
  const handlePan = (deltaX, deltaY) => {
    dispatch(setPanOffset({ 
      x: panOffset.x + deltaX, 
      y: panOffset.y + deltaY 
    }));
  };
}
```

### User Slice
**Purpose**: Manages user profile data

**State**:
```javascript
{
  profile: null | Profile,
  isLoading: Boolean,
  error: String | null
}
```

**Actions**:
- `updateProfile(data)` - Update user profile
- `uploadProfilePhoto(file)` - Upload profile photo
- `clearError()` - Clear error state

**Selectors**:
- `selectProfile(state)` - Get user profile
- `selectProfileLoading(state)` - Get loading state
- `selectProfileError(state)` - Get error message

### Dashboard Slice
**Purpose**: Manages dashboard data

**State**:
```javascript
{
  dashboardData: null | DashboardData,
  isLoading: Boolean,
  error: String | null,
  sectionLoading: Object,
  sectionErrors: Object
}
```

**Actions**:
- `loadDashboardData()` - Load dashboard data
- `refreshDashboard()` - Refresh dashboard
- `setSectionError({ section, error })` - Set section error
- `clearSectionError(section)` - Clear section error

**Selectors**:
- `selectDashboardData(state)` - Get dashboard data
- `selectDashboardLoading(state)` - Get loading state
- `selectSectionLoading(state, section)` - Get section loading state
- `selectSectionError(state, section)` - Get section error

### Memory Slice
**Purpose**: Manages photos and memories

**State**:
```javascript
{
  memories: Array,
  albums: Array,
  isLoading: Boolean,
  uploadProgress: Number,
  error: String | null
}
```

**Actions**:
- `uploadPhotos({ files, memoryData, onProgress })` - Upload photos
- `createMemory(memoryData)` - Create memory
- `getAlbums()` - Get albums
- `setUploadProgress(progress)` - Set upload progress
- `clearError()` - Clear error state

**Selectors**:
- `selectMemories(state)` - Get memories
- `selectAlbums(state)` - Get albums
- `selectMemoryLoading(state)` - Get loading state
- `selectUploadProgress(state)` - Get upload progress
- `selectMemoryError(state)` - Get error message

---

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Ananthcodz/Roots_frontend.git
cd Roots_frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Set environment variables
VITE_MOCK_API=true  # Use mock data for development
VITE_API_BASE_URL=http://localhost:3000/api  # Backend URL
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Environment Variables

```env
# Mock API mode (no backend required)
VITE_MOCK_API=true

# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api

# Other configurations
VITE_APP_NAME=Roots
VITE_APP_VERSION=1.0.0
```

---

## Development Guide

### Adding a New Family Member

**Step 1**: User clicks "Add Parents", "Add Spouse", or "Add Children"

**Step 2**: Modal opens with form

**Step 3**: User fills form and submits

**Step 4**: `handleAddRelativeSubmit` is called:
```javascript
const handleAddRelativeSubmit = async (formData) => {
  try {
    await dispatch(addFamilyMember({
      ...formData,
      relatedTo: addRelativeRelatedTo,
      relationshipType: addRelativeType,
    })).unwrap();
    handleCloseAddRelativeModal();
    // Refresh data
    await dispatch(getFamilyMembers(true)).unwrap();
    await dispatch(getRelationships(true)).unwrap();
  } catch (err) {
    console.error('Failed to add family member:', err);
  }
};
```

**Step 5**: Redux store updates state

**Step 6**: TreeCanvas re-renders with new member

### Tree Layout Algorithm

**File**: `src/utils/treeLayout.js`

**How it works**:
1. Build tree structure from members and relationships
2. Calculate generation levels (parents = -1, root = 0, children = +1)
3. Position nodes by level and index
4. Calculate spacing based on card dimensions

**Key Functions**:
- `buildTreeStructure()` - Creates tree from data
- `calculateTreeLayout()` - Positions nodes
- `calculateLevels()` - Assigns generation levels

### Styling Guidelines

**Color Usage**:
- Primary Green (`#0d7377`): Active states, borders, highlights
- Light Green (`#f0fdfa`): Backgrounds, hover states
- Gray (`#64748b`): Text, secondary info
- Light Gray (`#e2e8f0`): Borders, dividers

**Transitions**:
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth animations
- Duration: 0.15s-0.3s for UI interactions
- Use `will-change: transform` for performance

**Responsive Design**:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

### Testing

**Property-Based Tests**:
- Located in `*.property.test.jsx` files
- Use fast-check library
- Test universal properties across many inputs

**Unit Tests**:
- Located in `*.test.jsx` files
- Test specific examples and edge cases
- Use React Testing Library

**Running Tests**:
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Common Tasks

#### Adding a New Component

1. Create component file: `src/components/MyComponent.jsx`
2. Create styles: `src/components/MyComponent.css`
3. Create tests: `src/components/MyComponent.test.jsx`
4. Export from component index if needed

#### Adding a New Page

1. Create page file: `src/pages/MyPage.jsx`
2. Create styles: `src/pages/MyPage.css`
3. Add route in `App.jsx`
4. Add navigation link in `NavigationBar.jsx`

#### Using Redux in a New Component

1. Import hooks: `import { useSelector, useDispatch } from 'react-redux'`
2. Import actions and selectors from slice
3. Use `useSelector` to read state
4. Use `useDispatch` to dispatch actions
5. Handle async actions with `.unwrap()` for error handling

**Example**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectFamilyMembers, addFamilyMember } from '../redux/slices/familySlice';

function MyComponent() {
  const dispatch = useDispatch();
  const members = useSelector(selectFamilyMembers);
  
  const handleAdd = async (data) => {
    try {
      await dispatch(addFamilyMember(data)).unwrap();
      // Success
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  
  return <div>{/* Component JSX */}</div>;
}
```

#### Adding a New Redux Slice

1. Create slice file: `src/redux/slices/mySlice.js`
2. Define initial state
3. Create reducers and async thunks
4. Export actions and selectors
5. Add reducer to store in `src/redux/store.js`

**Example Slice**:
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  isLoading: false,
  error: null
};

export const fetchData = createAsyncThunk(
  'mySlice/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyService.getData();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = mySlice.actions;
export const selectData = (state) => state.mySlice.data;
export const selectLoading = (state) => state.mySlice.isLoading;
export const selectError = (state) => state.mySlice.error;
export default mySlice.reducer;
```

#### Adding a New Service

1. Create service file: `src/services/MyService.js`
2. Define API methods
3. Add error handling
4. Export service functions

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to GitHub Pages

```bash
npm run build
git add dist/
git commit -m "Build for production"
git push origin main
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## Troubleshooting

### Family Tree Not Showing

**Issue**: Tree canvas is blank

**Solutions**:
1. Check if `VITE_MOCK_API=true` is set in `.env`
2. Verify Redux Provider is wrapping the app in `main.jsx`
3. Check browser console for errors
4. Ensure `familyMembers` array is not empty
5. Check Redux DevTools to inspect state

### Modal Not Opening

**Issue**: Add Relative modal doesn't appear

**Solutions**:
1. Check if `showAddRelativeModal` state is true
2. Verify modal component is rendered in JSX
3. Check z-index CSS (should be > 1000)
4. Ensure click handler is properly bound

### Styling Issues

**Issue**: Colors or spacing look wrong

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Rebuild CSS: `npm run build`
3. Check CSS file for typos
4. Verify color hex codes match design

---

## Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Vite Documentation](https://vitejs.dev)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "Add my feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request

---

## License

This project is licensed under the MIT License.

---

**Last Updated**: December 2024
**Version**: 1.0.0
