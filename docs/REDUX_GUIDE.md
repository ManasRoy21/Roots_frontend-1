# Redux Guide - Roots Application

## Table of Contents
1. [Introduction](#introduction)
2. [Redux Toolkit Setup](#redux-toolkit-setup)
3. [Slice Creation Patterns](#slice-creation-patterns)
4. [Async Thunk Patterns](#async-thunk-patterns)
5. [Selector Patterns](#selector-patterns)
6. [Testing Strategies](#testing-strategies)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Debugging](#debugging)

---

## Introduction

This guide covers Redux Toolkit usage in the Roots application. Redux Toolkit is the official, opinionated toolset for efficient Redux development that simplifies store setup, reduces boilerplate, and includes best practices by default.

### Why Redux Toolkit?

- **Less Boilerplate**: Reduces code needed for actions, reducers, and store setup
- **Built-in Best Practices**: Includes Immer for immutable updates, Redux Thunk for async logic
- **Better Developer Experience**: Simplified API, better TypeScript support
- **DevTools Integration**: Automatic Redux DevTools setup

### Key Concepts

- **Store**: Centralized state container
- **Slice**: Collection of reducer logic and actions for a single feature
- **Thunk**: Async action creator for API calls
- **Selector**: Function to extract specific state
- **Action**: Plain object describing state change
- **Reducer**: Pure function that updates state

---

## Redux Toolkit Setup

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Store Configuration

**File**: `src/redux/store.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import familyReducer from './slices/familySlice';
import memoryReducer from './slices/memorySlice';
import dashboardReducer from './slices/dashboardSlice';
import treeReducer from './slices/treeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    family: familyReducer,
    memory: memoryReducer,
    dashboard: dashboardReducer,
    tree: treeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for File objects
        ignoredActions: ['memory/uploadPhotos/pending'],
        // Ignore these paths in the state
        ignoredPaths: ['memory.uploadingFiles'],
      },
    }),
});
```

### Provider Setup

**File**: `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## Slice Creation Patterns

### Basic Slice Structure

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  data: [],
  isLoading: false,
  error: null
};

// Async thunk
export const fetchData = createAsyncThunk(
  'mySlice/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await MyService.getData(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch data');
    }
  }
);

// Slice
const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    // Sync actions
    clearError: (state) => {
      state.error = null;
    },
    setData: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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

// Export actions
export const { clearError, setData } = mySlice.actions;

// Export selectors
export const selectData = (state) => state.mySlice.data;
export const selectLoading = (state) => state.mySlice.isLoading;
export const selectError = (state) => state.mySlice.error;

// Export reducer
export default mySlice.reducer;
```

### Slice with Multiple Thunks

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FamilyService from '../services/FamilyService';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

const initialState = {
  familyMembers: [],
  relationships: [],
  isLoading: false,
  error: null
};

// Thunk 1: Get family members
export const getFamilyMembers = createAsyncThunk(
  'family/getFamilyMembers',
  async (forceRefresh, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [];
      }
      return await FamilyService.getFamilyMembers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk 2: Add family member
export const addFamilyMember = createAsyncThunk(
  'family/addFamilyMember',
  async (memberData, { rejectWithValue, dispatch }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newMember = { id: Date.now().toString(), ...memberData };
        return newMember;
      }
      const response = await FamilyService.addFamilyMember(memberData);
      
      // Automatically refresh relationships after adding
      if (memberData.relatedTo) {
        dispatch(getRelationships(true));
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk 3: Get relationships
export const getRelationships = createAsyncThunk(
  'family/getRelationships',
  async (forceRefresh, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [];
      }
      return await FamilyService.getRelationships();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get family members
      .addCase(getFamilyMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFamilyMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.familyMembers = action.payload;
      })
      .addCase(getFamilyMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add family member
      .addCase(addFamilyMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFamilyMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.familyMembers.push(action.payload);
      })
      .addCase(addFamilyMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get relationships
      .addCase(getRelationships.fulfilled, (state, action) => {
        state.relationships = action.payload;
      });
  }
});

export const { clearError } = familySlice.actions;

export const selectFamilyMembers = (state) => state.family.familyMembers;
export const selectRelationships = (state) => state.family.relationships;
export const selectFamilyLoading = (state) => state.family.isLoading;
export const selectFamilyError = (state) => state.family.error;

export default familySlice.reducer;
```

---

## Async Thunk Patterns

### Basic Async Thunk

```javascript
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await UserService.getUser(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Thunk with Parameters

```javascript
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await UserService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Usage
dispatch(updateProfile({ firstName: 'John', lastName: 'Doe' }));
```

### Thunk with Progress Tracking

```javascript
export const uploadPhotos = createAsyncThunk(
  'memory/uploadPhotos',
  async ({ files, memoryData, onProgress }, { rejectWithValue, dispatch }) => {
    try {
      const response = await MemoryService.uploadPhotos(
        files,
        memoryData,
        (progress) => {
          dispatch(setUploadProgress(progress));
          if (onProgress) onProgress(progress);
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Thunk with Conditional Logic

```javascript
export const getFamilyMembers = createAsyncThunk(
  'family/getFamilyMembers',
  async (forceRefresh, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      
      // Skip if already loaded and not forcing refresh
      if (!forceRefresh && state.family.familyMembers.length > 0) {
        return state.family.familyMembers;
      }
      
      const response = await FamilyService.getFamilyMembers();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Thunk with Chained Actions

```javascript
export const addFamilyMember = createAsyncThunk(
  'family/addFamilyMember',
  async (memberData, { rejectWithValue, dispatch }) => {
    try {
      const response = await FamilyService.addFamilyMember(memberData);
      
      // Chain additional actions
      if (memberData.relatedTo) {
        await dispatch(getRelationships(true)).unwrap();
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Thunk with Mock Mode Support

```javascript
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response
        return {
          id: 'mock-user-123',
          email: email,
          firstName: 'Mock',
          lastName: 'User'
        };
      }
      
      const response = await AuthService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Selector Patterns

### Basic Selectors

```javascript
// Simple selector
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
```

### Parameterized Selectors

```javascript
// Selector with parameter
export const selectMemberById = (state, memberId) => {
  return state.family.familyMembers.find(member => member.id === memberId);
};

// Usage
const member = useSelector(state => selectMemberById(state, memberId));
```

### Memoized Selectors with Reselect

```javascript
import { createSelector } from '@reduxjs/toolkit';

// Input selectors
const selectFamilyMembers = (state) => state.family.familyMembers;
const selectSearchQuery = (state) => state.tree.searchQuery;

// Memoized selector
export const selectFilteredMembers = createSelector(
  [selectFamilyMembers, selectSearchQuery],
  (members, query) => {
    if (!query) return members;
    
    return members.filter(member =>
      member.firstName.toLowerCase().includes(query.toLowerCase()) ||
      member.lastName.toLowerCase().includes(query.toLowerCase())
    );
  }
);
```

### Derived State Selectors

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectFamilyMembers = (state) => state.family.familyMembers;

// Derive total count
export const selectTotalMembers = createSelector(
  [selectFamilyMembers],
  (members) => members.length
);

// Derive living members
export const selectLivingMembers = createSelector(
  [selectFamilyMembers],
  (members) => members.filter(m => m.status === 'living')
);

// Derive by generation
export const selectMembersByGeneration = createSelector(
  [selectFamilyMembers],
  (members) => {
    const byGeneration = {};
    members.forEach(member => {
      const gen = member.generation || 0;
      if (!byGeneration[gen]) byGeneration[gen] = [];
      byGeneration[gen].push(member);
    });
    return byGeneration;
  }
);
```

---

## Testing Strategies

### Testing Reducers

```javascript
import familyReducer, { clearError } from './familySlice';

describe('familySlice', () => {
  const initialState = {
    familyMembers: [],
    relationships: [],
    isLoading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(familyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const previousState = { ...initialState, error: 'Some error' };
    expect(familyReducer(previousState, clearError())).toEqual(initialState);
  });
});
```

### Testing Async Thunks

```javascript
import { getFamilyMembers } from './familySlice';
import FamilyService from '../services/FamilyService';

jest.mock('../services/FamilyService');

describe('getFamilyMembers thunk', () => {
  it('should fetch family members successfully', async () => {
    const mockMembers = [
      { id: '1', firstName: 'John', lastName: 'Doe' }
    ];
    
    FamilyService.getFamilyMembers.mockResolvedValue(mockMembers);
    
    const dispatch = jest.fn();
    const thunk = getFamilyMembers();
    
    await thunk(dispatch, () => ({}), undefined);
    
    const { calls } = dispatch.mock;
    expect(calls[0][0].type).toBe('family/getFamilyMembers/pending');
    expect(calls[1][0].type).toBe('family/getFamilyMembers/fulfilled');
    expect(calls[1][0].payload).toEqual(mockMembers);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Failed to fetch';
    FamilyService.getFamilyMembers.mockRejectedValue(new Error(errorMessage));
    
    const dispatch = jest.fn();
    const thunk = getFamilyMembers();
    
    await thunk(dispatch, () => ({}), undefined);
    
    const { calls } = dispatch.mock;
    expect(calls[1][0].type).toBe('family/getFamilyMembers/rejected');
  });
});
```

### Testing Selectors

```javascript
import { selectFamilyMembers, selectFamilyLoading } from './familySlice';

describe('familySlice selectors', () => {
  const mockState = {
    family: {
      familyMembers: [
        { id: '1', firstName: 'John' },
        { id: '2', firstName: 'Jane' }
      ],
      relationships: [],
      isLoading: false,
      error: null
    }
  };

  it('should select family members', () => {
    const result = selectFamilyMembers(mockState);
    expect(result).toHaveLength(2);
    expect(result[0].firstName).toBe('John');
  });

  it('should select loading state', () => {
    const result = selectFamilyLoading(mockState);
    expect(result).toBe(false);
  });
});
```

### Integration Testing with Components

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import familyReducer from './slices/familySlice';
import FamilyTreePage from './pages/FamilyTreePage';

describe('FamilyTreePage with Redux', () => {
  it('should display family members from store', () => {
    const store = configureStore({
      reducer: {
        family: familyReducer
      },
      preloadedState: {
        family: {
          familyMembers: [
            { id: '1', firstName: 'John', lastName: 'Doe' }
          ],
          relationships: [],
          isLoading: false,
          error: null
        }
      }
    });

    render(
      <Provider store={store}>
        <FamilyTreePage />
      </Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## Best Practices

### 1. Slice Organization

**Do**:
- One slice per feature domain
- Keep slices focused and cohesive
- Export actions, selectors, and reducer

**Don't**:
- Mix unrelated features in one slice
- Create overly granular slices
- Export internal implementation details

### 2. State Shape

**Do**:
- Keep state normalized when possible
- Use consistent naming (isLoading, error, data)
- Store derived data in selectors, not state

**Don't**:
- Duplicate data across slices
- Store computed values in state
- Nest state too deeply

### 3. Async Thunks

**Do**:
- Use rejectWithValue for error handling
- Add loading and error states
- Support mock mode for development

**Don't**:
- Put business logic in components
- Ignore error cases
- Make thunks too complex

### 4. Selectors

**Do**:
- Use memoized selectors for derived data
- Keep selectors simple and focused
- Export selectors from slice files

**Don't**:
- Compute expensive operations in components
- Access state directly in components
- Create circular dependencies

### 5. Component Integration

**Do**:
- Use useSelector for reading state
- Use useDispatch for dispatching actions
- Handle async errors with .unwrap()

**Don't**:
- Subscribe to entire state
- Dispatch actions in render
- Ignore loading states

### 6. Error Handling

**Do**:
- Use rejectWithValue in thunks
- Store errors in state
- Display errors to users

**Don't**:
- Swallow errors silently
- Use generic error messages
- Leave error state stale

### 7. Performance

**Do**:
- Use memoized selectors
- Split state into logical slices
- Use React.memo for expensive components

**Don't**:
- Subscribe to unnecessary state
- Compute in render
- Create new objects in selectors

---

## Common Patterns

### Pattern 1: CRUD Operations

```javascript
// Create
export const createItem = createAsyncThunk(
  'items/create',
  async (itemData, { rejectWithValue }) => {
    try {
      return await ItemService.create(itemData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Read
export const fetchItems = createAsyncThunk(
  'items/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await ItemService.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update
export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ItemService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete
export const deleteItem = createAsyncThunk(
  'items/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ItemService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  }
});
```

### Pattern 2: Optimistic Updates

```javascript
export const updateMember = createAsyncThunk(
  'family/updateMember',
  async ({ memberId, memberData }, { rejectWithValue, dispatch }) => {
    // Optimistically update UI
    dispatch(updateMemberOptimistic({ memberId, memberData }));
    
    try {
      const response = await FamilyService.updateMember(memberId, memberData);
      return response;
    } catch (error) {
      // Revert on error
      dispatch(revertMemberUpdate(memberId));
      return rejectWithValue(error.message);
    }
  }
);

const familySlice = createSlice({
  name: 'family',
  initialState: {
    familyMembers: [],
    previousState: null
  },
  reducers: {
    updateMemberOptimistic: (state, action) => {
      const { memberId, memberData } = action.payload;
      const index = state.familyMembers.findIndex(m => m.id === memberId);
      if (index !== -1) {
        state.previousState = state.familyMembers[index];
        state.familyMembers[index] = { ...state.familyMembers[index], ...memberData };
      }
    },
    revertMemberUpdate: (state, action) => {
      const memberId = action.payload;
      const index = state.familyMembers.findIndex(m => m.id === memberId);
      if (index !== -1 && state.previousState) {
        state.familyMembers[index] = state.previousState;
        state.previousState = null;
      }
    }
  }
});
```

### Pattern 3: Pagination

```javascript
const initialState = {
  items: [],
  page: 1,
  pageSize: 20,
  totalPages: 0,
  hasMore: true,
  isLoading: false
};

export const fetchPage = createAsyncThunk(
  'items/fetchPage',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await ItemService.getPage(page, pageSize);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    nextPage: (state) => {
      if (state.hasMore) {
        state.page += 1;
      }
    },
    resetPagination: (state) => {
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.items];
        state.totalPages = action.payload.totalPages;
        state.hasMore = state.page < state.totalPages;
      });
  }
});
```

### Pattern 4: Search and Filter

```javascript
const treeSlice = createSlice({
  name: 'tree',
  initialState: {
    searchQuery: '',
    searchResults: [],
    filters: {
      status: 'all',
      generation: null
    }
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    performSearch: (state, action) => {
      const { query, members } = action.payload;
      if (!query) {
        state.searchResults = [];
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      state.searchResults = members
        .filter(member =>
          member.firstName.toLowerCase().includes(lowerQuery) ||
          member.lastName.toLowerCase().includes(lowerQuery)
        )
        .map(member => member.id);
    },
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        generation: null
      };
    }
  }
});

// Memoized filtered selector
export const selectFilteredMembers = createSelector(
  [selectFamilyMembers, (state) => state.tree.filters],
  (members, filters) => {
    let filtered = members;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(m => m.status === filters.status);
    }
    
    if (filters.generation !== null) {
      filtered = filtered.filter(m => m.generation === filters.generation);
    }
    
    return filtered;
  }
);
```

---

## Debugging

### Redux DevTools

Redux DevTools are automatically enabled in development mode.

**Features**:
- View all dispatched actions
- Inspect state before/after each action
- Time-travel debugging (undo/redo actions)
- Export/import state
- Action replay

**Installation**:
- Chrome: [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: [Redux DevTools Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### Logging Middleware

Add custom logging for debugging:

```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    // ...reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware)
});
```

### Debugging Selectors

```javascript
export const selectFamilyMembers = (state) => {
  const members = state.family.familyMembers;
  console.log('Selecting family members:', members);
  return members;
};
```

### Common Issues

**Issue 1: State not updating**
- Check if reducer is added to store
- Verify action is being dispatched
- Check Redux DevTools for action

**Issue 2: Component not re-rendering**
- Ensure useSelector is used correctly
- Check if selector returns new reference
- Verify component is wrapped in Provider

**Issue 3: Async thunk not working**
- Check network tab for API calls
- Verify error handling with rejectWithValue
- Check if .unwrap() is used for errors

**Issue 4: Performance issues**
- Use memoized selectors
- Check for unnecessary re-renders
- Use React.memo for expensive components

---

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Redux Style Guide](https://redux.js.org/style-guide)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Reselect Documentation](https://github.com/reduxjs/reselect)

---

**Last Updated**: December 2024
**Version**: 1.0.0
