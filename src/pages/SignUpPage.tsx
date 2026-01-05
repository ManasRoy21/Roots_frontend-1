import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, signInWithGoogle, signInWithApple, selectAuthLoading, selectAuthError } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import SSOButton from '../components/SSOButton';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './SignUpPage.scss';

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string | null;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(signUp({ 
        email: formData.email, 
        password: formData.password, 
        fullName: formData.fullName 
      })).unwrap();
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error || 'Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await dispatch(signInWithGoogle()).unwrap();
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error || 'Failed to sign up with Google');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      await dispatch(signInWithApple()).unwrap();
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error || 'Failed to sign up with Apple');
    }
  };

  return (
    <div className="signup-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div className="signup-container" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="signup-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="signup-header">
            <RootsLogo width={80} height={80} />
            <h1>Create an account</h1>
            <p>Join your family network to discover, preserve, and share your history.</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {generalError && <FormError message={generalError} />}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={(value) => handleChange('fullName', value)}
              error={errors.fullName}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isLoading}
              className="signup-submit-btn"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="signup-terms">
              By clicking continue, you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </form>

          <div className="signup-divider">
            <span>Or register with</span>
          </div>

          <div className="signup-sso">
            <SSOButton provider="google" onClick={handleGoogleSignUp} />
            <SSOButton provider="apple" onClick={handleAppleSignUp} />
          </div>

          <p className="signup-footer">
            Already have an account?{' '}
            <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Sign in
            </a>
          </p>
        </div>

        <div className="signup-links">
          <a href="/help">Help Center</a>
          <a href="/about">About Us</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
