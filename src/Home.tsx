import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Navigation/Header';
import Footer from '../components/Navigation/Footer';

const Home = () => {
    const { user } = useAuth();

    return (
        <>  
            <Header />
            <main className="page-wrapper">
                <section className="consult-card fade-up">
                    <div className="page-header">
                        <h1>Welcome to MediCare</h1>
                        <p>Consult online, get prescriptions, and manage records in one place.</p>
                    </div>
                    <div className="pres-actions">
                            {!user ? (
                                <>  
                                    <Link className="btn btn-primary" style={{ width: 'auto' }} to="/patient/signup">Get Started as Patient</Link>
                                    <Link className="btn btn-accent" style={{ width: 'auto' }} to="/doctor/signup">Get Started as Doctor</Link>
                                </>
                            ) : user.role === 'patient' ? (
                                <Link className="btn btn-primary" to="/patient/dashboard">Go to Dashboard</Link>
                            ) : (
                                <Link className="btn btn-primary" to="/doctor/profile">Go to Dashboard</Link>
                            )}
                    </div>
                </section>
                <section className="consult-card fade-up">
                    <h2 style={{ marginBottom: '1rem' }}>How it works</h2>
                    <div className="doctor-grid">
                            <div className="doctor-card">
                                <h3>1. Create account</h3>
                                <p>Sign up as doctor or patient.</p>
                            </div>
                            <div className="doctor-card">
                                <h3>2. Start consultation</h3>
                                <p>Patients submit details in a 3-step form.</p>
                            </div>
                            <div className="doctor-card">
                                <h3>3. Get prescription</h3>
                                <p>Doctors send PDF prescriptions from dashboard.</p>
                            </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;