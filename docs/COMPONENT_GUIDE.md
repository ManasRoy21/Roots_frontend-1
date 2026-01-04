# Component Guide - Roots Application

## Overview
This guide provides detailed documentation for all major components in the Roots application.

---

## Table of Contents
1. [Page Components](#page-components)
2. [Layout Components](#layout-components)
3. [Modal Components](#modal-components)
4. [Card Components](#card-components)
5. [Input Components](#input-components)
6. [Utility Components](#utility-components)

---

## Page Components

### DashboardPage
**File**: `src/pages/DashboardPage.jsx`

**Purpose**: Main dashboard showing user overview and quick actions

**Features**:
- Welcome greeting with user name
- Quick action buttons
- Recent activity feed
- Family statistics

**Usage**:
```jsx
import DashboardPage from './pages/DashboardPage';

// In App.jsx routes
<Route path="/dashboard" element={<DashboardPage />} />
```

**State Management**:
- Uses Redux `dashboardSlice` for dashboard data
- Uses Redux `authSlice` for user information

**Redux Integration**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardData, loadDashboardData } from '../redux/slices/dashboardSlice';
import { selectUser } from '../redux/slices/authSlice';

function DashboardPage() {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);
  const user = useSelector(selectUser);
  
  useEffect(() => {
    dispatch(loadDashboardData());
  }, [dispatch]);
}
```

---

### FamilyTreePage
**File**: `src/pages/FamilyTreePage.jsx`

**Purpose**: Interactive family tree visualization

**Features**:
- Tree canvas with pan/zoom
- Sidebar with member details
- Search functionality
- Add member modal

**Key Props**:
```javascript
// Passed to TreeCanvas
{
  members: familyMembers,
  relationships: relationships,
  rootMemberId: user?.id,
  onMemberClick: handleMemberClick,
  onPlaceholderClick: handlePlaceholderClick
}
```

**State**:
```javascript
const [initialLoadComplete, setInitialLoadComplete] = useState(false);
const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);
const [addRelativeType, setAddRelativeType] = useState(null);
const [addRelativeRelatedTo, setAddRelativeRelatedTo] = useState(null);
```

**Redux Integration**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectFamilyMembers, 
  selectRelationships,
  selectFamilyLoading,
  addFamilyMember,
  getFamilyMembers,
  getRelationships 
} from '../redux/slices/familySlice';
import { selectUser } from '../redux/slices/authSlice';
import { 
  selectSelectedMemberId,
  setSelectedMember 
} from '../redux/slices/treeSlice';

function FamilyTreePage() {
  const dispatch = useDispatch();
  const familyMembers = useSelector(selectFamilyMembers);
  const relationships = useSelector(selectRelationships);
  const isLoading = useSelector(selectFamilyLoading);
  const user = useSelector(selectUser);
  const selectedMemberId = useSelector(selectSelectedMemberId);
  
  useEffect(() => {
    dispatch(getFamilyMembers());
    dispatch(getRelationships());
  }, [dispatch]);
  
  const handleMemberClick = (memberId) => {
    dispatch(setSelectedMember(memberId));
  };
}
```

**Key Methods**:
```javascript
// Open modal for adding relative
const openAddRelativeModal = (type, relatedTo) => {
  setAddRelativeType(type);
  setAddRelativeRelatedTo(relatedTo);
  setShowAddRelativeModal(true);
};

// Handle form submission
const handleAddRelativeSubmit = async (formData) => {
  try {
    await dispatch(addFamilyMember({
      ...formData,
      relatedTo: addRelativeRelatedTo,
      relationshipType: addRelativeType,
    })).unwrap();
    handleCloseAddRelativeModal();
    await dispatch(getFamilyMembers(true)).unwrap();
    await dispatch(getRelationships(true)).unwrap();
  } catch (err) {
    console.error('Failed to add family member:', err);
  }
};
```

---

### EventsPage
**File**: `src/pages/EventsPage.jsx`

**Purpose**: Display and manage family events

**Features**:
- Event list with cards
- Pending invitations section
- Create event button
- Event details display

**Event Card Structure**:
```javascript
{
  id: String,
  title: String,
  date: Date,
  location: String,
  description: String,
  image: String,
  attendees: Array,
  status: 'pending' | 'upcoming' | 'past'
}
```

---

### LandingPage
**File**: `src/pages/LandingPage.jsx`

**Purpose**: Marketing landing page for unauthenticated users

**Features**:
- Hero section
- Feature highlights
- Call-to-action buttons
- Navigation to login/signup

---

## Layout Components

### NavigationBar
**File**: `src/components/NavigationBar.jsx`

**Purpose**: Top navigation bar with logo and menu

**Features**:
- Logo/branding
- Navigation links (Tree, Events, Messages, Photos)
- User profile dropdown
- Responsive mobile menu

**Props**:
```javascript
{
  // No required props - uses Redux internally
}
```

**Redux Integration**:
```javascript
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

function NavigationBar() {
  const user = useSelector(selectUser);
  
  return (
    <nav>
      {/* Navigation content */}
    </nav>
  );
}
```

**Navigation Links**:
- `/dashboard` - Dashboard
- `/family-tree` - Family Tree
- `/events` - Events
- `/messages` - Messages
- `/photos` - Photos

---

### TreeOwnerProfile
**File**: `src/components/TreeOwnerProfile.jsx`

**Purpose**: Sidebar component showing current user profile

**Features**:
- Profile photo
- User name and title
- "Tree Owner" badge with crown emoji
- "GROW YOUR TREE" section with action buttons

**Props**:
```javascript
{
  treeOwner: {
    id: String,
    firstName: String,
    lastName: String,
    photoUrl: String,
    dateOfBirth: String
  },
  onAddParents: Function,
  onAddSpouse: Function,
  onAddChildren: Function,
  hasSpouse: Boolean
}
```

**Styling**:
- Centered layout
- Profile photo: 80px circular
- White background
- Green accent color for buttons

---

### MemberDetailPanel
**File**: `src/components/MemberDetailPanel.jsx`

**Purpose**: Sidebar component showing selected member details

**Features**:
- Member information
- Relationship to tree owner
- Related members list
- Action buttons (Edit, Add Relative)

**Props**:
```javascript
{
  selectedMember: Object,
  allMembers: Array,
  relationships: Array,
  treeOwner: Object,
  onProfileClick: Function,
  onEditClick: Function,
  onAddRelativeClick: Function,
  onRelatedMemberClick: Function,
  onTracePath: Function
}
```

---

## Modal Components

### AddRelativeModal
**File**: `src/components/AddRelativeModal.jsx`

**Purpose**: Modal for adding new family members

**Features**:
- Form for member details
- Relationship type selection
- Photo upload
- Status selection (Living/Deceased)
- Optional tag/label field

**Props**:
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  onSubmit: Function,
  relationshipType: String,  // 'parent', 'spouse', 'child', 'sibling'
  relatedToMember: Object    // Member being related to
}
```

**Form Data Structure**:
```javascript
{
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  status: 'living' | 'deceased',
  specificLabel: String,
  photoUrl: String
}
```

**Styling**:
- Modal overlay with backdrop
- Centered content
- Z-index: 1000
- Smooth animations

---

### CreateEventModal
**File**: `src/components/CreateEventModal.jsx`

**Purpose**: Modal for creating family events

**Features**:
- Event details form
- Category selection
- Date/time picker
- Guest selection
- Invite external guests option

**Props**:
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  onSubmit: Function
}
```

**Form Data Structure**:
```javascript
{
  eventName: String,
  category: 'Celebration' | 'Reunion' | 'Dinner' | 'Trip' | 'Memorial',
  date: Date,
  time: String,
  location: String,
  guestSelection: 'all' | 'specific',
  selectedGuests: Array,
  description: String
}
```

---

### InviteExternalGuestsModal
**File**: `src/components/InviteExternalGuestsModal.jsx`

**Purpose**: Modal for inviting guests from other family trees

**Features**:
- Search for people from other trees
- Suggested connections
- Invite button for each person
- Status tracking (Invited/Sent)

**Props**:
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  onInvite: Function
}
```

**Suggested Person Structure**:
```javascript
{
  id: String,
  name: String,
  avatar: String,
  treeName: String,
  relationship: String
}
```

---

## Card Components

### MemberCard
**File**: `src/components/MemberCard.jsx`

**Purpose**: Display individual family member in tree

**Features**:
- Member photo (circular)
- Name and relationship label
- Hover effects
- Selection state
- Search highlighting

**Props**:
```javascript
{
  member: {
    id: String,
    firstName: String,
    lastName: String,
    photoUrl: String,
    gender: String
  },
  relationshipLabel: String,  // e.g., "Father", "Me / Root"
  isRoot: Boolean,
  isSelected: Boolean,
  isHighlighted: Boolean,
  isDimmed: Boolean,
  onClick: Function
}
```

**Styling States**:
- **Default**: Gray border, white background
- **Root**: Green border (3px), light green background
- **Selected**: Green border, shadow effect
- **Highlighted**: Orange border, animation
- **Dimmed**: Reduced opacity, grayscale

**Dimensions**:
- Width: 140px
- Height: Auto
- Photo: 80px circular

---

### PlaceholderCard
**File**: `src/components/PlaceholderCard.jsx`

**Purpose**: Placeholder for adding new family members

**Features**:
- Plus icon
- Label text
- Hover effects
- Dashed border

**Props**:
```javascript
{
  type: 'father' | 'mother' | 'spouse' | 'child',
  label: String,  // e.g., "Add Father"
  onClick: Function
}
```

**Styling**:
- Dashed border
- Light gray color
- Hover: Solid border, green color
- Dimensions: 140px x 100px

---

## Input Components

### SearchInput
**File**: `src/components/SearchInput.jsx`

**Purpose**: Search bar for finding family members

**Features**:
- Debounced search
- Results count display
- Clear button
- Keyboard shortcuts

**Props**:
```javascript
{
  value: String,
  onChange: Function,
  placeholder: String,
  debounceMs: Number,
  resultsCount: Number
}
```

**Usage**:
```jsx
<SearchInput
  value={searchQuery}
  onChange={handleSearchChange}
  placeholder="Search tree..."
  debounceMs={300}
  resultsCount={searchQuery ? searchResults.length : null}
/>
```

---

### DateInput
**File**: `src/components/DateInput.jsx`

**Purpose**: Date picker input

**Features**:
- Calendar picker
- Date validation
- Format handling
- Keyboard support

**Props**:
```javascript
{
  value: Date,
  onChange: Function,
  placeholder: String,
  minDate: Date,
  maxDate: Date
}
```

---

### Input
**File**: `src/components/Input.jsx`

**Purpose**: Generic text input component

**Features**:
- Label support
- Error messages
- Placeholder text
- Disabled state

**Props**:
```javascript
{
  label: String,
  value: String,
  onChange: Function,
  placeholder: String,
  type: String,
  error: String,
  disabled: Boolean
}
```

---

### Select
**File**: `src/components/Select.jsx`

**Purpose**: Dropdown select component

**Features**:
- Option list
- Default selection
- Disabled state
- Custom styling

**Props**:
```javascript
{
  label: String,
  value: String,
  onChange: Function,
  options: Array,
  placeholder: String,
  disabled: Boolean
}
```

---

## Utility Components

### TreeCanvas
**File**: `src/components/TreeCanvas.jsx`

**Purpose**: Main canvas for rendering family tree

**Features**:
- Pan and zoom
- Touch support
- Keyboard navigation
- Responsive layout

**Props**:
```javascript
{
  members: Array,
  relationships: Array,
  rootMemberId: String,
  onMemberClick: Function,
  onPlaceholderClick: Function,
  rootCardRef: Ref
}
```

**Interactions**:
- **Mouse**: Drag to pan, scroll to zoom
- **Touch**: Single finger to pan, two fingers to zoom
- **Keyboard**: Arrow keys to navigate

---

### TreeNode
**File**: `src/components/TreeNode.jsx`

**Purpose**: Recursive component for rendering tree nodes

**Features**:
- Hierarchical rendering
- Connection lines
- Relationship labels
- Placeholder cards

**Props**:
```javascript
{
  node: Object,
  allMembers: Array,
  relationships: Array,
  isRoot: Boolean,
  isSelected: Boolean,
  isHighlighted: Boolean,
  onMemberClick: Function,
  onPlaceholderClick: Function,
  showPlaceholders: Boolean,
  zoomLevel: Number,
  searchResults: Array,
  rootCardRef: Ref
}
```

---

### ConnectionLines
**File**: `src/components/ConnectionLines.jsx`

**Purpose**: SVG lines connecting family members

**Features**:
- Parent-child connections
- Spouse connections
- Smooth curves
- Responsive sizing

**Props**:
```javascript
{
  node: Object,
  zoomLevel: Number
}
```

---

### ZoomControls
**File**: `src/components/ZoomControls.jsx`

**Purpose**: Zoom in/out buttons

**Features**:
- Zoom in button
- Zoom out button
- Reset button
- Zoom level display

**Usage**:
```jsx
<ZoomControls />
```

**Redux Integration**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectZoomLevel,
  zoomIn,
  zoomOut,
  resetTreeView 
} from '../redux/slices/treeSlice';

function ZoomControls() {
  const dispatch = useDispatch();
  const zoomLevel = useSelector(selectZoomLevel);
  
  return (
    <div className="zoom-controls">
      <button onClick={() => dispatch(zoomIn())}>+</button>
      <span>{zoomLevel}%</span>
      <button onClick={() => dispatch(zoomOut())}>-</button>
      <button onClick={() => dispatch(resetTreeView())}>Reset</button>
    </div>
  );
}
```

---

### LoadingSpinner
**File**: `src/components/LoadingSpinner.jsx`

**Purpose**: Loading indicator

**Features**:
- Animated spinner
- Optional message
- Centered layout

**Props**:
```javascript
{
  message: String,
  size: 'small' | 'medium' | 'large'
}
```

---

### ErrorBoundary
**File**: `src/components/ErrorBoundary.jsx`

**Purpose**: Error boundary for catching React errors

**Features**:
- Error catching
- Fallback UI
- Error logging
- Recovery button

**Usage**:
```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Component Hierarchy

```
App
├── NavigationBar
├── Routes
│   ├── DashboardPage
│   │   ├── Greeting
│   │   ├── QuickActions
│   │   └── RecentUpdates
│   ├── FamilyTreePage
│   │   ├── TreeCanvas
│   │   │   └── TreeNode (recursive)
│   │   │       ├── MemberCard
│   │   │       ├── PlaceholderCard
│   │   │       └── ConnectionLines
│   │   ├── TreeOwnerProfile
│   │   ├── MemberDetailPanel
│   │   ├── SearchInput
│   │   ├── ZoomControls
│   │   └── AddRelativeModal
│   ├── EventsPage
│   │   ├── EventCard
│   │   ├── CreateEventModal
│   │   └── InviteExternalGuestsModal
│   └── ...
└── Redux Provider (wraps entire app)
```

---

## Best Practices

### Component Design
1. Keep components focused and single-responsibility
2. Use props for configuration
3. Lift state up when needed
4. Use Redux for global state
5. Memoize expensive components

### State Management
1. Use Redux for global application state
2. Use local state (useState) for UI-only state
3. Use useSelector to read from Redux store
4. Use useDispatch to dispatch actions
5. Handle async actions with .unwrap() for error handling

### Redux Patterns
1. Create selectors for accessing state
2. Use memoized selectors for derived data
3. Keep reducers pure and predictable
4. Use async thunks for API calls
5. Handle loading and error states consistently

**Example Redux Usage**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectFamilyMembers, addFamilyMember } from '../redux/slices/familySlice';

function MyComponent() {
  const dispatch = useDispatch();
  const members = useSelector(selectFamilyMembers);
  
  const handleAdd = async (data) => {
    try {
      await dispatch(addFamilyMember(data)).unwrap();
      // Success handling
    } catch (error) {
      // Error handling
      console.error(error);
    }
  };
  
  return <div>{/* Component JSX */}</div>;
}
```

### Styling
1. Use CSS modules or scoped CSS
2. Follow color scheme guidelines
3. Ensure responsive design
4. Use consistent spacing (8px grid)
5. Add smooth transitions

### Performance
1. Use React.memo for pure components
2. Implement lazy loading for routes
3. Optimize re-renders with useCallback
4. Use useMemo for expensive calculations
5. Avoid inline functions in render

### Accessibility
1. Use semantic HTML
2. Add ARIA labels
3. Support keyboard navigation
4. Ensure color contrast
5. Test with screen readers

---

**Last Updated**: December 2024
