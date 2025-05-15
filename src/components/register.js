import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import logo from '../assets/cic_insurance.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    idPassportNo: '',
    kraPin: '',
    nationality: '',
    postalAddress: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    consentMarketing: false,
  });
  
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.idPassportNo.trim()) newErrors.idPassportNo = 'ID/Passport Number is required';
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validate mobile number
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNo.replace(/\D/g, ''))) {
      newErrors.mobileNo = 'Please enter a valid mobile number';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.idPassportNo.trim()) newErrors.idPassportNo = 'ID/Passport Number is required';
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!formData.mobileNo.trim()) {
        newErrors.mobileNo = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(formData.mobileNo.replace(/\D/g, ''))) {
        newErrors.mobileNo = 'Please enter a valid mobile number';
      }
    } else if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submitted:', formData);
    }

    try {
      // Create a complete user data object
      const userData = {
        id: formData.idPassportNo,
        userType: 'customer',
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        gender: formData.gender,
        nationality: formData.nationality,
        mobileNo: formData.mobileNo,
        postalAddress: formData.postalAddress,
        kraPin: formData.kraPin,
        isAuthenticated: true,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toLocaleString()
      };

      // Store complete data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authToken', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify(userData));

      // Store session data
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('currentSession', JSON.stringify({
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }));

      console.log('Registration successful, data stored:', userData);
      
      // Show success message and redirect
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div 
            key={i}
            className={`step-dot ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
          >
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStepLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Account Security';
      default:
        return '';
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src={logo} alt="CIC Insurance" className="register-logo" />
          <h2>Create an Account</h2>
          <p>Join CIC Insurance and get started with your insurance journey</p>
          
          {renderStepIndicator()}
          <h3 className="step-label">{renderStepLabel()}</h3>
        </div>
        
        <form className="register-form" onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
          {currentStep === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <select
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    placeholder="Middle Name (Optional)"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="idPassportNo">ID/Passport No</label>
                  <input
                    type="text"
                    id="idPassportNo"
                    name="idPassportNo"
                    placeholder="ID/Passport No"
                    value={formData.idPassportNo}
                    onChange={handleChange}
                    required
                  />
                  {errors.idPassportNo && <span className="error-text">{errors.idPassportNo}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="kraPin">KRA Pin</label>
                  <input
                    type="text"
                    id="kraPin"
                    name="kraPin"
                    placeholder="KRA Pin"
                    value={formData.kraPin}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nationality">Nationality</label>
                  <select
                    name="nationality"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  >
                    <option value="">Select Nationality</option>
                    <option value="Kenyan">Kenyan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobileNo">Mobile No</label>
                  <input
                    type="text"
                    id="mobileNo"
                    name="mobileNo"
                    placeholder="Mobile No"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                  />
                  {errors.mobileNo && <span className="error-text">{errors.mobileNo}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="postalAddress">Postal Address</label>
                <input
                  type="text"
                  id="postalAddress"
                  name="postalAddress"
                  placeholder="Postal Address"
                  value={formData.postalAddress}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  By creating an account you are agreeing to our Privacy Policy and Terms of Use
                </label>
                {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="consentMarketing"
                    checked={formData.consentMarketing}
                    onChange={handleChange}
                  />
                  I consent to receiving marketing information by CIC Insurance Group.
                </label>
              </div>
            </>
          )}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="prev-button"
                onClick={prevStep}
              >
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                className="next-button"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="register-button"
              >
                Register
              </button>
            )}
          </div>
          
          <p className="login-link" style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
