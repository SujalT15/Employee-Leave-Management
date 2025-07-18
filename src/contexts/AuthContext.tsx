import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/types';
import { mockUsers as initialMockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockUsers, setMockUsers] = useState<User[]>(initialMockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('mockUsers');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedUsers) {
      setMockUsers(JSON.parse(savedUsers));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      setIsLoading(false);
      return false; // Email already registered
    }

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: email.split('@')[0],
      email,
      password,
      role: 'Employee',
      department: 'General',
      position: 'New Joiner',
      joinDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...mockUsers, newUser];
    setMockUsers(updatedUsers);
    localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
