import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './styles/auth.css';
import logo from './assets/enhanced/cic_insurance.png';
import picture1 from './assets/picture1.jpg';
import picture2 from './assets/picture2.jpg';
import picture3 from './assets/picture3.jpg';
import picture4 from './assets/picture4.jpg';
import picture5 from './assets/picture5.jpg';
import picture6 from './assets/picture6.jpg';

import CoverPage from './components/CoverPage';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Register from './components/register';
import QuoteFormSummary from './components/quoteformsummary';
import App from './App';
import FAQs from './components/FAQs';
import CalendarExample from './components/examples/CalendarExample';

// Import authentication utilities
import {
  USER_TYPES,
  validateIdentifier,
  validatePassword,
  login,
  getIdentifierLabel,
  getIdentifierPlaceholder
} from './utils/auth';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service in production, console in development
    if (process.env.NODE_ENV === 'development') {
      console.error("React Error Boundary caught an error:", error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #fff',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24'
        }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

function LoginSignup() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [_isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [_error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'customer',
    idNumber: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [_socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false
  });
  // eslint-disable-next-line no-unused-vars
  const [_showSignUp, setShowSignUp] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'customer',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupStep, setSignupStep] = useState(1);
  const [focusedInputs, setFocusedInputs] = useState({});
  const [validatedFields, setValidatedFields] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slides = [
    { image: picture1, description: 'Welcome to CIC EasyBima' },
    { image: picture2, description: 'Your trusted insurance partner' },
    { image: picture3, description: 'Easy insurance solutions' },
    { image: picture4, description: 'Guide to insurance' },
    { image: picture5, description: 'Guides through life' },
    { image: picture6, description: 'Insurance made simple' },
  ];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setIsTransitioning(false);
    }, 50);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 50);
  }, [slides.length, isTransitioning]);

  // eslint-disable-next-line no-unused-vars
  const _togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Enhanced image preloading for 4K images
  useEffect(() => {
    let isMounted = true;
    const preloadImages = async () => {
      try {
        setIsLoading(true);

        // Create an array to track loading progress
        const totalImages = slides.length;
        let loadedImages = 0;

        await Promise.all(slides.map(slide => {
          return new Promise((resolve, reject) => {
            const img = new Image();

            // Set image loading attributes for high quality
            img.setAttribute('importance', 'high');
            img.setAttribute('loading', 'eager');
            img.setAttribute('decoding', 'sync');

            // Set source and event handlers
            img.src = slide.image;

            img.onload = () => {
              loadedImages++;
              if (isMounted) {
                // Update loading progress if needed
                console.log(`Loaded image ${loadedImages}/${totalImages}`);
              }
              resolve();
            };

            img.onerror = reject;
          });
        }));

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading images:', err);
        if (isMounted) {
          setError('Failed to load high-resolution images');
          setIsLoading(false);
        }
      }
    };

    preloadImages();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [slides]);

  // Fix slider auto-rotation to prevent DOM errors
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        // Only proceed if document is visible and not in transition
        if (document && !document.hidden && !isTransitioning) {
          nextSlide();
        }
      }, 3000);

      // Cleanup interval on component unmount or dependency change
      return () => {
        clearInterval(interval);
      };
    }
    // Return empty cleanup function when paused to maintain consistent return
    return () => {};
  }, [isPaused, nextSlide, isTransitioning]);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Get stored user data to validate against
    const storedUserData = localStorage.getItem('user');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    console.log('Stored user data:', userData);

    if (!formData.idNumber) {
      errors.idNumber = 'ID/Passport Number is required';
    } else if (userData && userData.id !== formData.idNumber) {
      errors.idNumber = 'Invalid ID/Passport Number';
    }

    // Validate Password
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    console.log('Form submission started');

    // Get stored user data
    const storedUserData = localStorage.getItem('user');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    console.log('Stored user data:', userData);
    console.log('Form data:', formData);

    // Validate form inputs
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if the ID matches the stored user data
      if (userData && userData.id === formData.idNumber) {
        console.log('Login successful, storing user data');
        
        // Store in localStorage and sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', 'demo-token-123');
        
        console.log('User data stored:', localStorage.getItem('user'));
        console.log('Session storage:', sessionStorage.getItem('isAuthenticated'));
        
        // Use a timeout to ensure state is updated before navigation
        setTimeout(() => {
          console.log('Navigating to home page');
          navigate('/home');
        }, 100);
      } else {
        console.log('Login failed: Invalid credentials');
        setLoginError('Invalid ID/Passport Number or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // eslint-disable-next-line no-unused-vars
  const _handleSocialLogin = async (provider) => {
    setSocialLoading(prev => ({ ...prev, [provider.toLowerCase()]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast(`Successfully logged in with ${provider}!`, 'success');
    } catch (error) {
      showToast(`${provider} login failed. Please try again.`, 'error');
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider.toLowerCase()]: false }));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const _handleSignUpWithEmail = () => {
    setShowSignUp(true);
    setFormData({
      userType: 'customer',
      idNumber: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setFormErrors({});
    setLoginError('');
  };

  const validatePhoneNumber = async (phoneNumber) => {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');

      if (cleanNumber.length >= 10) {
        return {
          isValid: true,
          formattedNumber: formatPhoneNumber(cleanNumber),
          countryCode: 'KE',
          location: 'Kenya'
        };
      } else {
        return {
          isValid: false,
          error: 'Invalid phone number'
        };
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Phone validation error:', error);
      }
      return {
        isValid: false,
        error: 'Failed to validate phone number'
      };
    }
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setFocusedInputs(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setFocusedInputs(prev => ({
      ...prev,
      [name]: false
    }));

    if (value.trim()) {
      validateField(name, value).then(isValid => {
        setValidatedFields(prev => ({
          ...prev,
          [name]: isValid ? 'valid' : 'invalid'
        }));
      });
    }
  };

  const validateField = async (name, value) => {
    let error = '';
    let isValid = false;

    switch (name) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        } else {
          isValid = true;
          showToast('Valid email format!', 'success');
        }
        break;
      case 'phone':
        if (value.length < 12) {
          error = 'Please enter a complete phone number';
        } else {
          const validation = await validatePhoneNumber(value);
          if (!validation.isValid) {
            error = validation.error;
          } else {
            isValid = true;
            showToast('Phone number validated!', 'success');
          }
        }
        break;
      case 'password':
        if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else {
          isValid = true;
        }
        break;
      case 'confirmPassword':
        if (value !== signupData.password) {
          error = 'Passwords do not match';
        } else {
          isValid = true;
          showToast('Passwords match!', 'success');
        }
        break;
      default:
        isValid = true;
        break;
    }

    if (error) {
      setSignupErrors(prev => ({
        ...prev,
        [name]: error
      }));
      return false;
    }

    setSignupErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    return isValid;
  };

  // eslint-disable-next-line no-unused-vars
  const _handleSignupInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);

      if (processedValue.length === 12) {
        const validation = await validatePhoneNumber(processedValue);
        if (!validation.isValid) {
          setSignupErrors(prev => ({
            ...prev,
            phone: validation.error
          }));
        } else {
          processedValue = validation.formattedNumber;
          setSignupErrors(prev => ({
            ...prev,
            phone: ''
          }));

          showToast('Phone number validated!', 'success');
        }
      }
    }

    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    if (signupErrors[name]) {
      setSignupErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const _nextStep = () => {
    if (signupStep === 1) {
      const errors = validatePersonalInfo();
      if (Object.keys(errors).length > 0) {
        setSignupErrors(errors);
        return;
      }
    } else if (signupStep === 2) {
      const errors = validateAccountInfo();
      if (Object.keys(errors).length > 0) {
        setSignupErrors(errors);
        return;
      }
    }
    setSignupStep(prev => prev + 1);
  };

  // eslint-disable-next-line no-unused-vars
  const prevStep = () => {
    setSignupStep(prev => prev - 1);
  };

  const validatePersonalInfo = () => {
    const errors = {};
    if (!signupData.firstName.trim()) errors.firstName = 'First name is required';
    if (!signupData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!signupData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(signupData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    return errors;
  };

  const validateAccountInfo = () => {
    const errors = {};
    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!signupData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    return errors;
  };

  // eslint-disable-next-line no-unused-vars
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignupForm();
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('Account created successfully!', 'success');
      setShowSignUp(false);
    } catch (error) {
      showToast('Failed to create account. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateSignupForm = () => {
    const errors = {};
    if (!signupData.firstName.trim()) errors.firstName = 'First name is required';
    if (!signupData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!signupData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signupData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!signupData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    return errors;
  };

  return (
    <div className="split-screen">
      <div
        className="left-screen"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 4K Image with enhanced quality */}
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].description}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 8s ease-out, opacity 0.8s ease-in-out',
            transform: isTransitioning ? 'scale(1)' : 'scale(1.05)',
            opacity: isTransitioning ? 0.8 : 1,
            filter: 'brightness(0.7) saturate(1.1)'
          }}
          loading="eager"
          decoding="sync"
        />

        {/* Overlay gradient for better text visibility */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
            zIndex: 1
          }}
        />

        {/* Text description positioned at the bottom */}
        <div className="slide-description" style={{ zIndex: 2 }}>
          {slides[currentSlide].description}
        </div>

        {/* Slider controls at the very bottom */}
        <div className="slider-controls" style={{ zIndex: 3 }}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsTransitioning(false);
                  }, 500);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="right-screen">
        <div className="login-container" style={{
          padding: '30px',
          maxWidth: '450px',
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '10px',
          backgroundColor: '#fff'
        }}>
          <img src={logo} alt="cic insurance" className="logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '150px' }} />
          <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#800000' }}>Sign in to CIC EasyBima</h1>
          <p className="tagline" style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Getting insured with us is easy as 1-2-3</p>

          {loginError && (
            <div className="error-message" style={{
              color: '#721c24',
              backgroundColor: '#f8d7da',
              padding: '10px 15px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '1px solid #f5c6cb'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="user-type" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleInputChange}
                />
                Customer
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="intermediary"
                  checked={formData.userType === 'intermediary'}
                  onChange={handleInputChange}
                />
                Intermediary
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="idNumber" style={{ display: 'block', marginBottom: '5px' }}>
                {formData.userType === USER_TYPES.INTERMEDIARY ? 'KRA PIN *' : 'ID/Passport Number *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder={formData.userType === USER_TYPES.INTERMEDIARY
                    ? "Enter your KRA PIN"
                    : "Enter your ID/Passport Number"}
                  className={formErrors.idNumber ? 'error' : ''}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${focusedInputs.idNumber ? '#4a90e2' : '#ccc'}`,
                    borderRadius: '5px',
                    boxShadow: focusedInputs.idNumber ? '0 0 3px rgba(74, 144, 226, 0.5)' : 'none'
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                {validatedFields.idNumber && (
                  <div className={`validation-icon ${validatedFields.idNumber}`} style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    background: validatedFields.idNumber === 'valid' ? 'green' : 'red',
                    borderRadius: '50%'
                  }}></div>
                )}
              </div>
              {formErrors.idNumber && (
                <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{formErrors.idNumber}</span>
              )}
              <small style={{
                display: 'block',
                marginTop: '5px',
                fontSize: '11px',
                color: '#666'
              }}>
                {formData.userType === USER_TYPES.INTERMEDIARY
                  ? 'Format: 11 alphanumeric characters (e.g., A012345678B)'
                  : 'Format: 8-10 digits (e.g., 12345678)'}
              </small>
            </div>

            <div className="form-group password-toggle" style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
              <div className="password-input-container" style={{ position: 'relative' }}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={formErrors.password ? 'error' : ''}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${focusedInputs.password ? '#4a90e2' : '#ccc'}`,
                    borderRadius: '5px',
                    boxShadow: focusedInputs.password ? '0 0 3px rgba(74, 144, 226, 0.5)' : 'none'
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                {validatedFields.password && (
                  <div className={`validation-icon ${validatedFields.password}`} style={{
                    position: 'absolute',
                    right: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    background: validatedFields.password === 'valid' ? 'green' : 'red',
                    borderRadius: '50%'
                  }}></div>
                )}
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {passwordVisible ? '🙈' : '👁️'}
                </button>
              </div>
              {formErrors.password && (
                <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{formErrors.password}</span>
              )}
            </div>

            <div className="form-options" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Link to="/forgot-password" className="forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn modern-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#800000',
                color: 'white',
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a0000'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800000'}
            >
              {isSubmitting ? <span className="spinner"></span> : 'Sign In'}
            </button>
          </form>

          <p className="register-link" style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register" style={{ color: 'maroon', textDecoration: 'underline' }}>Register</Link>
          </p>
        </div>

        {toast.show && (
          <div className={`toast-notification ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/home" element={<App />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quoteformsummary" element={<QuoteFormSummary />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/calendar" element={<CalendarExample />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  if (process.env.NODE_ENV === 'development') {
    console.error("Root element with id 'root' not found. Ensure it exists in index.html.");
  }
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error rendering React application:", error);
    }
    // Fallback rendering directly to the body if root fails
    document.body.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid #fff; border-radius: 4px;
                  background-color: #f8d7da; color: #721c24; font-family: sans-serif;">
        <h2>Something went wrong while loading the application.</h2>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
        <button onclick="window.location.reload()"
                style="padding: 8px 16px; background-color: #dc3545; color: white;
                       border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}
