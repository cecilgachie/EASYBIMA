import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/enhanced/cic_insurance.png';
import { USER_TYPES, validateIdentifier } from '../utils/auth';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: USER_TYPES.CUSTOMER,
    identifierValue: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailFormat = emailRegex.test(formData.identifierValue);

    // If it's an email format, it's valid for both user types
    if (isEmailFormat) {
      // Valid email format, so we don't need to show an error
      return newErrors;
    }

    // Use the centralized validation for ID/KRA PIN
    const validationResult = validateIdentifier(formData.identifierValue, formData.userType);
    if (!validationResult.isValid) {
      newErrors.identifierValue = validationResult.error;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailFormat = emailRegex.test(formData.identifierValue);

      let maskedEmail;
      if (isEmailFormat) {
        const parts = formData.identifierValue.split('@');
        const namePart = parts[0];
        const domainPart = parts[1];
        maskedEmail = `${namePart.substring(0, 3)}***@${domainPart.substring(0, 1)}****${domainPart.substring(domainPart.lastIndexOf('.'))}`;
      } else {
        maskedEmail = `${formData.identifierValue.substring(0, 3)}***@****${formData.userType === USER_TYPES.CUSTOMER ? '.com' : '.co.ke'}`;
      }

      setEmailSent(maskedEmail);
      setResetSent(true);
    } catch (error) {
      setErrors({ form: 'Failed to send reset instructions. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioOption = ({ value, label }) => (
    <label
      className={`radio-option ${formData.userType === value ? 'selected' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '10px 16px',
        borderRadius: '8px',
        background: formData.userType === value ? 'linear-gradient(135deg, #982c2c 0%, #7a1e1e 100%)' : 'white',
        color: formData.userType === value ? 'white' : '#555',
        transition: 'all 0.3s ease',
        flex: 1,
        justifyContent: 'center',
        border: formData.userType === value ? 'none' : '1px solid #e0e0e0',
        boxShadow: formData.userType === value ? '0 4px 10px rgba(152, 44, 44, 0.2)' : 'none',
        fontWeight: formData.userType === value ? '500' : '400'
      }}
    >
      <input
        type="radio"
        name="userType"
        value={value}
        checked={formData.userType === value}
        onChange={handleChange}
        style={{
          marginRight: '10px',
          accentColor: '#982c2c'
        }}
      />
      {label}
    </label>
  );

  return (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f8f9fc 0%, #e4e9f2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div className="auth-card" style={{
        position: 'relative',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
        borderRadius: '20px',
        padding: '35px',
        backgroundColor: '#fff',
        animation: 'fadeIn 0.4s ease-out',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(152,44,44,0.08) 0%, rgba(152,44,44,0) 70%)',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(152,44,44,0.08) 0%, rgba(152,44,44,0) 70%)',
          zIndex: 0
        }}></div>

        <img
          src={logo}
          alt="CIC Insurance"
          className="logo"
          style={{
            width: 'auto',
            maxWidth: '150px',
            height: 'auto',
            margin: '0 auto 25px',
            display: 'block',
            filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))',
            position: 'relative',
            zIndex: 1
          }}
        />

        {/* Back button */}
        <button
          className="back-btn"
          onClick={() => navigate('/login')}
          aria-label="Back to login"
          style={{
            position: 'absolute',
            top: '25px',
            left: '25px',
            background: 'none',
            border: 'none',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            color: '#882323',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '6px 10px',
            borderRadius: '6px',
            zIndex: 2
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateX(-3px)';
            e.currentTarget.style.background = 'rgba(136, 35, 35, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <span style={{ marginRight: '6px', fontSize: '18px' }}>←</span> Back
        </button>

        <h2 style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#333',
          fontSize: '26px',
          fontWeight: '600',
          position: 'relative',
          zIndex: 1
        }}>Reset Password</h2>

        {resetSent ? (
          <div className="success-message" style={{
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 25px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #5cb85c 0%, #4cae4c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <span style={{ color: 'white', fontSize: '45px' }}>✓</span>
            </div>
            <h3 style={{
              marginBottom: '20px',
              color: '#333',
              fontSize: '22px',
              fontWeight: '600'
            }}>Email Sent!</h3>
            <p style={{ marginBottom: '15px', color: '#555' }}>
              Password reset instructions have been sent to:
            </p>
            <p style={{
              fontWeight: '500',
              background: 'linear-gradient(to right, #f7f7f7, #efefef)',
              padding: '12px 20px',
              borderRadius: '10px',
              display: 'inline-block',
              letterSpacing: '0.5px',
              color: '#444',
              border: '1px solid #e8e8e8'
            }}>
              {emailSent}
            </p>
            <div style={{
              fontSize: '14px',
              margin: '25px 0 0',
              color: '#666',
              padding: '15px',
              background: 'linear-gradient(to right, #f9f9f9, #f5f5f5)',
              borderRadius: '12px',
              border: '1px solid #eaeaea'
            }}>
              <p style={{ marginBottom: '0' }}>
                <svg style={{ verticalAlign: 'middle', marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="16" r="1" fill="#666"/>
                </svg>
                If you don't receive the email within 5 minutes, check your spam folder.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="primary-button"
              style={{
                marginTop: '25px',
                width: '100%',
                maxWidth: '220px',
                margin: '25px auto 0',
                background: 'linear-gradient(135deg, #982c2c 0%, #7a1e1e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 0',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(152, 44, 44, 0.25)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(152, 44, 44, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(152, 44, 44, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <p style={{
              marginBottom: '30px',
              textAlign: 'center',
              color: '#555',
              fontSize: '15px',
              lineHeight: '1.5',
              position: 'relative',
              zIndex: 1
            }}>
              {formData.userType === USER_TYPES.CUSTOMER
                ? "Enter your ID Number and we will send instructions to reset your password to your registered email address."
                : "Enter your KRA PIN and we will send instructions to reset your password to your registered email address."}
            </p>

            {errors.form && (
              <div className="error-message" style={{
                marginBottom: '20px',
                padding: '12px 18px',
                background: 'linear-gradient(to right, #fff5f5, #ffe8e8)',
                borderLeft: '4px solid #f44336',
                borderRadius: '6px',
                color: '#d32f2f',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.1)'
              }}>
                <svg style={{ marginRight: '10px', flexShrink: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="16" r="1" fill="#d32f2f"/>
                </svg>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="user-type-selector" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <RadioOption value={USER_TYPES.CUSTOMER} label="A Customer" />
                <RadioOption value={USER_TYPES.INTERMEDIARY} label="An Intermediary" />
              </div>

              <div className="input-group" style={{ marginBottom: '30px', position: 'relative' }}>
                <input
                  type="text"
                  name="identifierValue"
                  placeholder=" "
                  value={formData.identifierValue}
                  onChange={handleChange}
                  required
                  className={errors.identifierValue ? 'error' : ''}
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '12px',
                    border: errors.identifierValue ? '1px solid #f44336' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    backgroundColor: '#fcfcfc',
                    boxShadow: errors.identifierValue
                      ? '0 2px 10px rgba(244, 67, 54, 0.15)'
                      : 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(152, 44, 44, 0.15)';
                    e.target.style.borderColor = '#982c2c';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = errors.identifierValue
                      ? '0 2px 10px rgba(244, 67, 54, 0.15)'
                      : 'none';
                    e.target.style.borderColor = errors.identifierValue
                      ? '#f44336'
                      : '#e0e0e0';
                    e.target.style.backgroundColor = '#fcfcfc';
                  }}
                />
                <label
                  htmlFor="identifierValue"
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: formData.identifierValue ? 'translateY(-170%) scale(0.85)' : 'translateY(-50%)',
                    transformOrigin: 'left top',
                    transition: 'transform 0.3s, color 0.3s',
                    color: formData.identifierValue ? '#982c2c' : '#777',
                    pointerEvents: 'none',
                    backgroundColor: formData.identifierValue ? 'white' : 'transparent',
                    padding: formData.identifierValue ? '0 5px' : '0',
                    fontWeight: formData.identifierValue ? '500' : 'normal',
                    zIndex: 1
                  }}
                >
                  {formData.userType === USER_TYPES.CUSTOMER ? 'ID Number' : 'KRA PIN'}
                </label>
                {errors.identifierValue && (
                  <div className="error-text" style={{
                    color: '#f44336',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '8px',
                    marginLeft: '2px'
                  }}>
                    <svg style={{ marginRight: '6px', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V12" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" fill="#f44336"/>
                    </svg>
                    {errors.identifierValue}
                  </div>
                )}
                <small style={{
                  display: 'block',
                  marginTop: '8px',
                  fontSize: '13px',
                  color: '#777',
                  paddingLeft: '2px'
                }}>
                  <svg style={{ verticalAlign: 'middle', marginRight: '6px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="8" r="1" fill="#777"/>
                  </svg>
                  {formData.userType === USER_TYPES.CUSTOMER
                    ? 'Format: 8-10 digits (e.g., 1234567890)'
                    : 'Format: 11 alphanumeric characters (e.g., A012345678B)'}
                </small>
              </div>

              <div className="button-group" style={{
                display: 'flex',
                gap: '15px',
                marginTop: '20px'
              }}>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  style={{
                    flex: '2',
                    background: 'linear-gradient(135deg, #982c2c 0%, #7a1e1e 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    cursor: isSubmitting ? 'default' : 'pointer',
                    opacity: isSubmitting ? 0.8 : 1,
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(152, 44, 44, 0.25)'
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(152, 44, 44, 0.35)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(152, 44, 44, 0.25)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <span className="loading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="loading-spinner" style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        borderTopColor: 'white',
                        animation: 'spin 0.8s linear infinite',
                        marginRight: '10px'
                      }}></span>
                      Sending...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/login')}
                  style={{
                    flex: '1',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    color: '#555',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8f8f8';
                    e.currentTarget.style.borderColor = '#d0d0d0';
                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="help-text" style={{
              marginTop: '35px',
              textAlign: 'center',
              padding: '18px',
              background: 'linear-gradient(to right, #f9f9f9, #f5f5f5)',
              borderRadius: '12px',
              fontSize: '14px',
              border: '1px solid #eaeaea'
            }}>
              <p style={{
                marginBottom: '12px',
                fontWeight: '600',
                color: '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="8" r="1" fill="#444"/>
                </svg>
                Need help?
              </p>
              <p style={{ color: '#555', lineHeight: '1.5' }}>
                Contact our support at{' '}
                <a
                  href="mailto:callc@cic.co.ke"
                  style={{
                    color: '#982c2c',
                    textDecoration: 'none',
                    fontWeight: '500',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                    e.currentTarget.style.borderBottom = '1px solid #982c2c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                    e.currentTarget.style.borderBottom = 'none';
                  }}
                >
                  callc@cic.co.ke
                </a>{' '}
                or{' '}
                <a
                  href="tel:0703099120"
                  style={{
                    color: '#982c2c',
                    textDecoration: 'none',
                    fontWeight: '500',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                    e.currentTarget.style.borderBottom = '1px solid #982c2c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                    e.currentTarget.style.borderBottom = 'none';
                  }}
                >
                  0703 099 120
                </a>
              </p>
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ForgotPassword;