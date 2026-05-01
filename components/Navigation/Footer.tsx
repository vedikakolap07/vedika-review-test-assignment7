import React from 'react';
import './nav.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="app-footer-content">
                <span>MedScript</span>
                <p>Online consultations and digital prescriptions.</p>
            </div>
            <div className="app-footer-bottom">
                <p>&copy; {currentYear} MedScript</p>
            </div>
        </footer>
    );
};

export default Footer;