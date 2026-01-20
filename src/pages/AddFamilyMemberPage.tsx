import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFamilyMember, selectFamilyLoading } from '../redux/slices/familySlice';
import { selectProfile } from '../redux/slices/userSlice';
import { selectUser } from '../redux/slices/authSlice';
import NavigationBar from '../components/NavigationBar';
import BackLink from '../components/BackLink';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import DateInput from '../components/DateInput';
import Toggle from '../components/Toggle';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './AddFamilyMemberPage.scss';

interface FormData {
  relatedTo: string;
  relationshipType: string;
  specificLabel: string;
  profilePhoto: File | null;
  photoPreview: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isLiving: boolean;
  email: string;
  sendInvite: boolean;
}

interface FormErrors {
  [key: string]: string | null;
}

const AddFamilyMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectFamilyLoading);
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser);

  // Get URL params
  const relationshipTypeParam = searchParams.get('type');
  const relatedToParam = searchParams.get('relatedTo');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    relatedTo: relatedToParam || user?.id || '',
    relationshipType: relationshipTypeParam || '',
    specificLabel: '',
    profilePhoto: null,
    photoPreview: null,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    isLiving: true,
    email: '',
    sendInvite: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Determine where to navigate back to
  const getBackPath = () => {
    // If coming from family tree (has type param), go back to family tree
    if (relationshipTypeParam) {
      return '/family-tree';
    }
    // Otherwise go to dashboard
    return '/dashboard';
  };

  // Update form data when URL params change
  useEffect(() => {
    if (relationshipTypeParam) {
      setFormData(prev => ({
        ...prev,
        relationshipType: relationshipTypeParam
      }));
    }
    if (relatedToParam) {
      setFormData(prev => ({
        ...prev,
        relatedTo: relatedToParam
      }));
    }
  }, [relationshipTypeParam, relatedToParam]);

  // Check form validity whenever form data changes
  useEffect(() => {
    const checkFormValidity = () => {
      // Check required fields
      if (!formData.relationshipType) return false;
      if (!formData.firstName.trim()) return false;
      if (!formData.lastName.trim()) return false;
      if (!formData.dateOfBirth) return false;
      if (!formData.gender) return false;

      // Check email format if provided
      if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return false;
      }

      // Check date format
      if (formData.dateOfBirth) {
        const cleaned = formData.dateOfBirth.replace(/\s/g, '');
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(cleaned)) return false;
      }

      return true;
    };

    setIsFormValid(checkFormValidity());
  }, [formData]);

  // Relationship type options
  const relationshipOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'other', label: 'Other' },
  ];

  // Gender options
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoUpload = (file: File | null, error: string | null) => {
    if (error) {
      setErrors(prev => ({ ...prev, profilePhoto: error }));
      setFormData(prev => ({ ...prev, profilePhoto: null, photoPreview: null }));
    } else if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file,
        photoPreview: URL.createObjectURL(file),
      }));
      setErrors(prev => ({ ...prev, profilePhoto: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.relationshipType) {
      newErrors.relationshipType = 'Please select a relationship type';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    // Email validation (if provided)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Date format validation
    if (formData.dateOfBirth) {
      const cleaned = formData.dateOfBirth.replace(/\s/g, '');
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(cleaned)) {
        newErrors.dateOfBirth = 'Please enter a valid date (DD/MM/YYYY)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert date from DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = formData.dateOfBirth.replace(/\s/g, '').split('/');
      const isoDate = `${year}-${month}-${day}`;

      const memberData = {
        relatedTo: formData.relatedTo,
        relationshipType: formData.relationshipType,
        specificLabel: formData.specificLabel || null,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: isoDate,
        gender: formData.gender,
        isLiving: formData.isLiving,
        email: formData.email || null,
        sendInvite: formData.sendInvite,
        profilePhoto: formData.profilePhoto,
      };

      await dispatch(addFamilyMember(memberData)).unwrap();
      navigate(getBackPath());
    } catch (error) {
      console.error('Failed to add family member:', error);
      
      // Handle validation errors from server
      if (error.isValidationError && error.validationErrors) {
        setErrors(prev => ({
          ...prev,
          ...error.validationErrors,
          submit: error.message,
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: error.message || error || 'Failed to add family member. Please try again.',
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(getBackPath());
  };

  return (
    <div className="add-family-member-page">
      <NavigationBar />
      
      <div className="page-container" role="main" aria-label="Add family member form">
        <BackLink 
          to={getBackPath()} 
          label={relationshipTypeParam ? "Back to Family Tree" : "Back to Dashboard"} 
        />
        
        <div className="page-header">
          <h1>Add Family Member</h1>
          <p className="page-subtitle">
            Expand your family tree by adding a new relative's details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="add-family-member-form" aria-label="Add family member form">
          {/* Relationship Section */}
          <section className="form-section" aria-labelledby="relationship-section-title">
            <h2 id="relationship-section-title" className="section-title">Relationship</h2>
            
            <div className="related-to-field">
              <label className="input-label">Related to</label>
              <div className="related-to-display">
                {profile?.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt={profile.firstName || 'User'} 
                    className="related-to-photo"
                  />
                ) : (
                  <div className="related-to-avatar">
                    {(profile?.firstName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="related-to-name">
                  {profile?.firstName 
                    ? `${profile.firstName} ${profile.lastName || ''}`.trim() 
                    : 'Alex Rivera'} (You)
                </span>
                <svg className="related-to-dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <Select
              label="Relationship Type"
              value={formData.relationshipType}
              onChange={(value) => handleInputChange('relationshipType', value)}
              options={relationshipOptions}
              placeholder="Select relationship..."
              error={errors.relationshipType}
              required
            />

            <Input
              label="Specific Label (Optional)"
              placeholder="Father, Mother, etc."
              value={formData.specificLabel}
              onChange={(value) => handleInputChange('specificLabel', value)}
            />
          </section>

          {/* Personal Information Section */}
          <section className="form-section" aria-labelledby="personal-info-section-title">
            <h2 id="personal-info-section-title" className="section-title">Personal Information</h2>
            
            <div className="photo-upload-section">
              <div className="photo-upload-row">
                <div className="photo-upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="photo-upload-info">
                  <label className="photo-upload-label">Profile Photo</label>
                  <p className="photo-upload-hint">
                    Recommended: Square JPG or PNG, at least 400×400
                  </p>
                </div>
                <button
                  type="button"
                  className="photo-upload-button"
                  onClick={() => document.getElementById('profile-photo-input').click()}
                  aria-label="Upload profile photo"
                >
                  Upload
                </button>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (max 10MB)
                      if (file.size > 10 * 1024 * 1024) {
                        handlePhotoUpload(null, 'File size must be less than 10MB');
                      } else {
                        handlePhotoUpload(file, null);
                      }
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </div>
              {formData.photoPreview && (
                <div className="photo-preview">
                  <img src={formData.photoPreview} alt="Profile preview" className="photo-preview-image" />
                  <button
                    type="button"
                    className="photo-remove-button"
                    onClick={() => {
                      URL.revokeObjectURL(formData.photoPreview);
                      setFormData(prev => ({ ...prev, profilePhoto: null, photoPreview: null }));
                    }}
                    aria-label="Remove profile photo"
                  >
                    Remove
                  </button>
                </div>
              )}
              {errors.profilePhoto && (
                <span className="input-error-message" role="alert">
                  {errors.profilePhoto}
                </span>
              )}
            </div>

            <div className="form-row">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(value) => handleInputChange('firstName', value)}
                error={errors.firstName}
                required
              />

              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(value) => handleInputChange('lastName', value)}
                error={errors.lastName}
                required
              />
            </div>

            <DateInput
              label="Date of Birth"
              placeholder="DD / MM / YYYY"
              value={formData.dateOfBirth}
              onChange={(value) => handleInputChange('dateOfBirth', value)}
              error={errors.dateOfBirth}
              required
            />

            <div className="gender-field">
              <label className="input-label">
                Gender
                <span className="input-required" aria-label="required">*</span>
              </label>
              <div className="gender-options">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="gender-radio"
                  />
                  <span className="gender-label">Male</span>
                </label>
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="gender-radio"
                  />
                  <span className="gender-label">Female</span>
                </label>
              </div>
              {errors.gender && (
                <span className="input-error-message" role="alert">
                  {errors.gender}
                </span>
              )}
            </div>
          </section>

          {/* Contact and Status Section */}
          <section className="form-section" aria-labelledby="contact-status-section-title">
            <h2 id="contact-status-section-title" className="section-title">Contact & Status</h2>
            
            <div className="living-status-field">
              <label className="input-label">Living Status</label>
              <p className="field-subtitle">Is this person currently living?</p>
              <Toggle
                checked={formData.isLiving}
                onChange={(value) => handleInputChange('isLiving', value)}
              />
            </div>

            <div className="email-field">
              <label className="input-label">Email Address (Optional)</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4H17C17.55 4 18 4.45 18 5V15C18 15.55 17.55 16 17 16H3C2.45 16 2 15.55 2 15V5C2 4.45 2.45 4 3 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M18 5L10 11L2 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  className={`input-field input-with-icon-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              {errors.email && (
                <span className="input-error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="send-invite"
                checked={formData.sendInvite}
                onChange={(e) => handleInputChange('sendInvite', e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor="send-invite" className="checkbox-label">
                Send an invite to join the family network
              </label>
            </div>
          </section>

          {/* Form Actions */}
          {errors.submit && (
            <div className="form-error" role="alert" aria-live="assertive">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              aria-label="Cancel adding family member"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting || isLoading}
              aria-label={isSubmitting ? 'Adding family member, please wait' : 'Add family member'}
            >
              {isSubmitting ? 'Adding Member...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberPage;
