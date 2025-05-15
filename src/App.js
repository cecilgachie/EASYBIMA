import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/auth.css';
import logo from './assets/enhanced/cic_insurance.png';
import { isAuthenticated } from './utils/auth';

function App() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const isUserAuthenticated = isAuthenticated();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = userData.name ? userData.name.split(' ')[0] : 'User';

  useEffect(() => {
    if (isUserAuthenticated && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isUserAuthenticated && countdown === 0) {
      navigate('/dashboard');
    }
  }, [isUserAuthenticated, countdown, navigate]);

  if (!isUserAuthenticated) {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <img
          src={logo}
          alt="CIC Insurance"
          style={{
            width: '200px',
            marginBottom: '2rem'
          }}
        />
        <h1 style={{
          color: '#800000',
          marginBottom: '1.5rem',
          fontSize: '2.5rem'
        }}>Welcome to CIC EasyBima</h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          color: '#333'
        }}>Your trusted insurance partner for personal and business protection solutions.</p>
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <Link
            to="/login"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#800000',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500'
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#800000',
              textDecoration: 'none',
              borderRadius: '4px',
              border: '2px solid #800000',
              fontWeight: '500'
            }}
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  // If authenticated, show the welcome message with countdown
  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <header style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <img
          src={logo}
          alt="CIC Insurance"
          style={{
            width: '150px'
          }}
        />
      </header>
      <main style={{
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#800000',
            marginBottom: '1rem',
            fontSize: '2.5rem'
          }}>Welcome, {firstName}!</h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: '#333'
          }}>Thank you for choosing CIC Insurance.</p>
          <div style={{
            fontSize: '1.5rem',
            color: '#800000',
            fontWeight: 'bold'
          }}>
            Redirecting to dashboard in {countdown} seconds...
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#f0f0f0',
            marginTop: '1rem',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(countdown / 5) * 100}%`,
              height: '100%',
              backgroundColor: '#800000',
              transition: 'width 1s linear'
            }}></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;