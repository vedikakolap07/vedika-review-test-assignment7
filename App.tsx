import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './src/Home';
import PatientDashboard from './Patient/Dashboard';
import { PatientSignup } from './Patient/PatientSignup';
import PatientLogin from './Patient/Login';
import { DoctorSignup } from './Doctor/Signup';
import DoctorLogin from './Doctor/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Consult from './Patient/Consult';
import DoctorProfile from './Doctor/Profile';
import DoctorPrescriptions from './Doctor/Prescriptions';
import PatientPrescriptions from './Patient/PatientPrescriptions';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/patient/signup" element={<PatientSignup />} />
                    <Route path="/patient/signin" element={<PatientLogin />} />
                    <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/consult/:doctorId" element={<ProtectedRoute><Consult /></ProtectedRoute>} />
                    <Route path="/doctor/signup" element={<DoctorSignup />} />
                    <Route path="/doctor/signin" element={<DoctorLogin />} />
                    <Route path="/doctor/profile" element={<ProtectedRoute role="doctor"><DoctorProfile /></ProtectedRoute>} />
                    <Route path="/doctor/prescriptions" element={<ProtectedRoute role="doctor"><DoctorPrescriptions /></ProtectedRoute>} />
                    <Route path="/patient/prescriptions" element={<ProtectedRoute><PatientPrescriptions /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;