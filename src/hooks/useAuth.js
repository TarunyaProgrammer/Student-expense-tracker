import { useState, useEffect } from 'react';
import { subscribeToAuth, loginUser, registerUser, logoutUser } from '../core/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser
  };
}
