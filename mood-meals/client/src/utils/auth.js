export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    if (!payload.exp) return false; // just in case
    const expiryMs = payload.exp * 1000; // convert to milliseconds
    return Date.now() < expiryMs;
  } catch (err) {
    console.error("Token decode error:", err);
    return false;
  }
};

export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate('/');
};
