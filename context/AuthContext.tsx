import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('app_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('app_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('app_token', token);
    } else {
      localStorage.removeItem('app_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('app_user', JSON.stringify(user));
    else localStorage.removeItem('app_user');
  }, [user]);

  const inferRole = (data: any) => {
    if (data.role) return data.role;
    if (data.age || data.surgeryHistory || data.illnessHistory) return 'patient';
    return 'doctor';
  };

  const signUp = async (data: any) => {
    const role = inferRole(data);
    const endpoint = role === 'doctor' ? '/api/auth/doctor/signup' : '/api/auth/patient/signup';
    const { res, json } = await api.postJson(endpoint, data);
    if (!res.ok) throw new Error(json?.msg || json?.error || 'Signup failed');
    setToken(json.token);
    if (role === 'doctor' && json.doctor) {
      setUser({ ...json.doctor, id: json.doctor._id || json.doctor.id, role: 'doctor' });
    } else if (role === 'patient' && json.patient) {
      setUser({ ...json.patient, id: json.patient._id || json.patient.id, role: 'patient' });
    } else {
      setUser(null);
    }
  };

  const signIn = async (data: any) => {
    const role = data.role || (window.location.pathname.toLowerCase().includes('patient') ? 'patient' : 'doctor');
    const endpoint = role === 'doctor' ? '/api/auth/doctor/signin' : '/api/auth/patient/signin';
    const { res, json } = await api.postJson(endpoint, data);
    if (!res.ok) throw new Error(json?.msg || json?.error || 'Signin failed');
    setToken(json.token);
    if (role === 'doctor' && json.doctor) {
      setUser({ ...json.doctor, id: json.doctor._id || json.doctor.id, role: 'doctor' });
    } else if (role === 'patient' && json.patient) {
      setUser({ ...json.patient, id: json.patient._id || json.patient.id, role: 'patient' });
    } else {
      setUser(null);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;