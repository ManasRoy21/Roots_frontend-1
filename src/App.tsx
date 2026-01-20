import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import OnboardingSuccessPage from './pages/OnboardingSuccessPage';
import DashboardPage from './pages/DashboardPage';
import AddFamilyMemberPage from './pages/AddFamilyMemberPage';
import UploadPhotosPage from './pages/UploadPhotosPage';
import JoinFamilyTreePage from './pages/JoinFamilyTreePage';
import FamilyTreePage from './pages/FamilyTreePage';
import EventsPage from './pages/EventsPage';
import ComponentDemo from './pages/ComponentDemo';
import './App.scss';
import Login from './components/login';

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
            {/* Public routes - accessible to everyone */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<ComponentDemo />} />
            
            
            {/* Auth routes - redirect to dashboard if already authenticated */}
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <SignInPage />
                </PublicRoute>
              } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/profile-setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding-success" 
              element={
                <ProtectedRoute>
                  <OnboardingSuccessPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-family-member" 
              element={
                <ProtectedRoute>
                  <AddFamilyMemberPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload-photos" 
              element={
                <ProtectedRoute>
                  <UploadPhotosPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/join-tree" 
              element={
                <ProtectedRoute>
                  <JoinFamilyTreePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/family-tree" 
              element={
                <ProtectedRoute>
                  <FamilyTreePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
