import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FamilyTreePage from './FamilyTreePage';
import authReducer from '../redux/slices/authSlice';
import userReducer from '../redux/slices/userSlice';
import familyReducer from '../redux/slices/familySlice';
import treeReducer from '../redux/slices/treeSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      family: familyReducer,
      tree: treeReducer,
    },
    preloadedState: {
      auth: {
        user: { id: '1', email: 'test@test.com', fullName: 'Test User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      user: {
        profile: { firstName: 'Test', lastName: 'User' },
        isLoading: false,
        error: null,
      },
      family: {
        familyMembers: [],
        relationships: [],
        isLoading: false,
        error: null,
      },
      tree: {
        selectedMemberId: null,
        searchQuery: '',
        searchResults: [],
        zoomLevel: 100,
        panOffset: { x: 0, y: 0 },
        showFirstTimeTooltip: false,
      },
    },
  });
};

const AllProviders = ({ children }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('FamilyTreePage Integration Tests', () => {
  it('should render the family tree page without errors', () => {
    render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Verify page renders
    expect(screen.getByText(/loading your family tree/i) || screen.getByText(/family tree/i)).toBeTruthy();
  });

  it('should render navigation bar', () => {
    render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Check if navigation is present
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    const { container } = render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Verify main page container exists
    const pageContainer = container.querySelector('.family-tree-page');
    expect(pageContainer).toBeInTheDocument();
  });
});
