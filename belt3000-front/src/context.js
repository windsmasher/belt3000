import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  gymId: null,
  login: () => {},
  logout: () => {},
});
