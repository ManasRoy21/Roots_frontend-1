import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, uploadProfilePhoto, selectProfileLoading, selectProfileError } from '../redux/slices/userSlice';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import StepIndicator from '../components/StepIndicator';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './ProfileSetupPage.scss';

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  placeOfBirth: string;
  photo: File | null;
}

interface FormErrors {
  [key: string]: string | null;
}

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectProfileLoading);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const handleChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoUpload = (file: File | null, error: string | null) => {
    if (error) {
      setErrors(prev => ({ ...prev, photo: error }));
      setProfileData(prev => ({ ...prev, photo: null }));
      setPhotoPreview(null);
      return;
    }

    if (file) {
      setProfileData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: null }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!profileData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if date is in the future
      const dob = new Date(profileData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    if (!profileData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!profileData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
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
      // Upload photo first if provided
      let photoUrl = null;
      if (profileData.photo) {
        const result = await dispatch(uploadProfilePhoto({ file: profileData.photo })).unwrap();
        photoUrl = result.photoUrl;
      }
      
      // Update profile with all data
      await dispatch(updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        placeOfBirth: profileData.placeOfBirth,
        photoUrl
      })).unwrap();
      
      // Navigate to success screen
      navigate('/onboarding-success');
    } catch (error) {
      setGeneralError(error || 'Failed to save profile. Please try again.');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-container">
        <div className="profile-setup-card">
          <div className="profile-setup-header">
            <RootsLogo width={80} height={80} />
            <StepIndicator currentStep={1} totalSteps={3} />
            <h1>Complete your profile</h1>
            <p>Help us personalize your experience by sharing a bit about yourself.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-setup-form">
            {generalError && <FormError message={generalError} />}
            
            <div className="profile-setup-photo-section">
              <ImageUpload
                onUpload={handlePhotoUpload}
                preview={photoPreview}
                maxSize={5}
                error={errors.photo}
              />
              <p className="profile-setup-photo-hint">
                Upload a profile photo (optional)
              </p>
            </div>

            <div className="profile-setup-name-row">
              <Input
                label="First Name"
                type="text"
                placeholder="Alex"
                value={profileData.firstName}
                onChange={(value) => handleChange('firstName', value)}
                error={errors.firstName}
                required
              />

              <Input
                label="Last Name"
                type="text"
                placeholder="Rivera"
                value={profileData.lastName}
                onChange={(value) => handleChange('lastName', value)}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={profileData.dateOfBirth}
              onChange={(value) => handleChange('dateOfBirth', value)}
              error={errors.dateOfBirth}
              required
            />

            <Select
              label="Gender"
              options={genderOptions}
              value={profileData.gender}
              onChange={(value) => handleChange('gender', value)}
              error={errors.gender}
              placeholder="Select your gender"
              required
            />

            <Input
              label="Place of Birth"
              type="text"
              placeholder="San Francisco, CA"
              value={profileData.placeOfBirth}
              onChange={(value) => handleChange('placeOfBirth', value)}
              error={errors.placeOfBirth}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isLoading}
              className="profile-setup-submit-btn"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </Button>
          </form>

          <button 
            className="profile-setup-skip"
            onClick={handleSkip}
            disabled={isLoading}
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
