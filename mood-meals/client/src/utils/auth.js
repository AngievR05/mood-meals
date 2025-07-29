export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode payload
    const expiry = payload.exp * 1000; // convert to ms
    return Date.now() < expiry;
  } catch {
    return false;
  }
};

export const logout = (navigate) => {
  localStorage.removeItem('token');
  navigate('/'); // redirect to login
};
