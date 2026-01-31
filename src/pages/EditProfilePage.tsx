import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import NavigationBar from '../components/NavigationBar';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import Button from '../components/Button';
import './EditProfilePage.scss';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Antonio',
    lastName: user?.lastName || 'Jose Rivera',
    mobile: '+1 (555) 123-4567',
    email: 'antonio.rivera@example.com',
    birthDate: '1934-09-14',
    age: '89'
  });

  const handleInputChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    console.log('Updated profile data:', formData);
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <NavigationBar />
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <h1>Edit Profile</h1>
            <p>Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Phone</label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange('mobile')}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthDate">Birth Date</label>
                  <DateInput
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange('birthDate')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange('age')}
                    placeholder="Age"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
