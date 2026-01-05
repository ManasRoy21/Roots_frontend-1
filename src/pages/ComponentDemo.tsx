import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import ImageUpload from '../components/ImageUpload';
import SSOButton from '../components/SSOButton';
import FormError from '../components/FormError';
import StepIndicator from '../components/StepIndicator';
import Greeting from '../components/Greeting';
import NavigationBar from '../components/NavigationBar';
import './ComponentDemo.scss';

const ComponentDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageUpload = (file: File | null, error: string | null) => {
    if (error) {
      setImageError(error);
      setImagePreview(null);
    } else if (file) {
      setImageError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  return (
      <div className="demo-container">
        <h1>Component Demo</h1>

        <section className="demo-section">
        <h2>Buttons</h2>
        <div className="demo-row">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="primary" disabled>Disabled Button</Button>
        </div>
        <div className="demo-row">
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
      </section>

      <section className="demo-section">
        <h2>Inputs</h2>
        <div className="demo-column">
          <Input 
            label="Email Address" 
            type="email"
            placeholder="Enter your email"
            value={inputValue}
            onChange={setInputValue}
            required
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter your password"
            value=""
            onChange={() => {}}
          />
          <Input 
            label="Email with Error" 
            type="email"
            value="invalid-email"
            onChange={() => {}}
            error="Please enter a valid email address"
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Select Dropdown</h2>
        <div className="demo-column">
          <Select
            label="Gender"
            options={genderOptions}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Select your gender"
            required
          />
          <Select
            label="Select with Error"
            options={genderOptions}
            value=""
            onChange={() => {}}
            error="This field is required"
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Image Upload</h2>
        <div className="demo-column" style={{ alignItems: 'center' }}>
          <ImageUpload
            onUpload={handleImageUpload}
            preview={imagePreview}
            error={imageError}
            maxSize={5}
          />
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Click to upload a profile photo (max 5MB)
          </p>
        </div>
      </section>

      <section className="demo-section">
        <h2>SSO Buttons</h2>
        <div className="demo-column">
          <SSOButton 
            provider="google" 
            onClick={() => alert('Google SSO clicked')} 
          />
          <SSOButton 
            provider="apple" 
            onClick={() => alert('Apple SSO clicked')} 
          />
          <SSOButton 
            provider="google" 
            onClick={() => {}} 
            disabled 
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Form Error</h2>
        <FormError message="This is an error message that appears when something goes wrong" />
      </section>

      <section className="demo-section">
        <h2>Step Indicator</h2>
        <div className="demo-column">
          <StepIndicator currentStep={1} totalSteps={3} />
          <StepIndicator currentStep={2} totalSteps={3} />
          <StepIndicator currentStep={3} totalSteps={3} />
        </div>
      </section>

      <section className="demo-section">
        <h2>Dashboard Components</h2>
        <div className="demo-column">
          <h3>Navigation Bar</h3>
          <div style={{ marginBottom: '2rem' }}>
            <NavigationBar />
          </div>
          
          <h3>Greeting Component</h3>
          <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
            <Greeting firstName="Alex" />
          </div>
          
          <h3>Greeting at Different Times</h3>
          <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
            <Greeting firstName="Alex" currentTime={new Date(2025, 0, 1, 8, 0)} />
          </div>
          <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
            <Greeting firstName="Alex" currentTime={new Date(2025, 0, 1, 14, 0)} />
          </div>
          <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
            <Greeting firstName="Alex" currentTime={new Date(2025, 0, 1, 20, 0)} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentDemo;
