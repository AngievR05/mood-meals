// utils/auth.js

// Check if JWT exists and is not expired
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    return Date.now() < payload.exp * 1000; // valid if not expired
  } catch {
    return false;
  }
};

// Logout and clear user data
export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate('/'); // redirect to login
};
