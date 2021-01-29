import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    login();
  }, []);

  const login = dataToken => {
    const authData = dataToken || JSON.parse(localStorage.getItem('userData'));

    if (authData) {
      setToken(authData.token);
      localStorage.setItem('userData', JSON.stringify({ token: authData.token }));
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
