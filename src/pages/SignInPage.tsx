import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signInWithGoogle, signInWithApple, selectAuthLoading, selectAuthError } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import SSOButton from '../components/SSOButton';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './SignInPage.scss';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string | null;
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [formData, setFormData] = useState<FormData>({
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await dispatch(signIn({ 
        email: formData.email, 
        password: formData.password 
      })).unwrap();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error || 'Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(signInWithGoogle()).unwrap();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error || 'Failed to sign in with Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await dispatch(signInWithApple()).unwrap();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error || 'Failed to sign in with Apple');
    }
  };

  return (
    <div className="signin-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div className="signin-container" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="signin-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="signin-header">
            <RootsLogo width={80} height={80} />
            <h1>Welcome back</h1>
            <p>Enter your credentials to access your family tree and connect with relatives.</p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            {generalError && <FormError message={generalError} />}
            
            <Input
              label="Email address"
              type="email"
              placeholder="alex.rivera@example.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />

            <div className="signin-forgot">
              <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isLoading}
              className="signin-submit-btn"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="signin-divider">
            <span>Or continue with</span>
          </div>

          <div className="signin-sso">
            <SSOButton provider="google" onClick={handleGoogleSignIn} />
            <SSOButton provider="apple" onClick={handleAppleSignIn} />
          </div>

          <p className="signin-footer">
            Don't have an account?{' '}
            <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Sign up
            </a>
          </p>
        </div>

        <div className="signin-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/help">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
