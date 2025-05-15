import { logout } from './auth';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
let sessionTimer = null;
let warningTimer = null;

export const initializeSession = (navigate, showWarning) => {
  resetSessionTimer(navigate, showWarning);
  document.addEventListener('mousemove', () => resetSessionTimer(navigate, showWarning));
  document.addEventListener('keypress', () => resetSessionTimer(navigate, showWarning));
};

export const resetSessionTimer = (navigate, showWarning) => {
  clearTimeout(sessionTimer);
  clearTimeout(warningTimer);

  // Set warning timer
  warningTimer = setTimeout(() => {
    showWarning(true);
  }, SESSION_TIMEOUT - WARNING_TIME);

  // Set session timeout
  sessionTimer = setTimeout(async () => {
    await handleSessionTimeout(navigate);
  }, SESSION_TIMEOUT);
};

const handleSessionTimeout = async (navigate) => {
  await logout();
  navigate('/login', { 
    state: { 
      message: 'Your session has expired. Please log in again.' 
    } 
  });
};

export const setRememberMe = (value) => {
  localStorage.setItem('rememberMe', value);
};

export const getRememberMe = () => {
  return localStorage.getItem('rememberMe') === 'true';
};

// Device management
export const recordDeviceLogin = () => {
  const devices = JSON.parse(localStorage.getItem('devices') || '[]');
  const currentDevice = {
    id: generateDeviceId(),
    name: getDeviceName(),
    lastLogin: new Date().toISOString(),
    browser: navigator.userAgent,
    isCurrentDevice: true
  };

  // Update existing devices
  devices.forEach(device => device.isCurrentDevice = false);
  
  // Add new device
  devices.push(currentDevice);
  
  // Keep only last 5 devices
  const updatedDevices = devices.slice(-5);
  localStorage.setItem('devices', JSON.stringify(updatedDevices));
};

export const getDevices = () => {
  return JSON.parse(localStorage.getItem('devices') || '[]');
};

export const removeDevice = (deviceId) => {
  const devices = getDevices().filter(device => device.id !== deviceId);
  localStorage.setItem('devices', JSON.stringify(devices));
};

// Helper functions
const generateDeviceId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const getDeviceName = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS Device';
  if (/Android/.test(userAgent)) return 'Android Device';
  if (/Win/.test(platform)) return 'Windows Device';
  if (/Mac/.test(platform)) return 'Mac Device';
  if (/Linux/.test(platform)) return 'Linux Device';
  
  return 'Unknown Device';
}; 