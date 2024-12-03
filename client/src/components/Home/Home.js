import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// Inline styles as JavaScript objects
const styles = {
    body: {
        height: '100%',
        margin: '0'
    },
    backgroundRadialGradient: {
        minHeight: '100vh',
        backgroundColor: 'hsl(218, 41%, 15%)',
        backgroundImage: `radial-gradient(650px circle at 0% 0%, 
            hsl(218, 41%, 35%) 15%, 
            hsl(218, 41%, 30%) 35%, 
            hsl(218, 41%, 20%) 75%, 
            hsl(218, 41%, 19%) 80%, 
            transparent 100%),
            radial-gradient(1250px circle at 100% 100%, 
            hsl(218, 41%, 45%) 15%, 
            hsl(218, 41%, 30%) 35%, 
            hsl(218, 41%, 20%) 75%, 
            hsl(218, 41%, 19%) 80%, 
            transparent 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        textAlign: 'center',
        color: 'hsl(218, 81%, 95%)',
        zIndex: 10
    },
    btn: {
        display: 'inline-block',
        textDecoration: 'none',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '15px 30px',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        width: '200px',
        margin: '10px'
    },
    btnPrimary: {
        backgroundColor: 'hsl(218, 81%, 45%)',
        border: 'none',
    },
    btnPrimaryHover: {
        backgroundColor: 'hsl(218, 81%, 55%)',
    },
    btnSuccess: {
        backgroundColor: 'hsl(134, 61%, 41%)',
        border: 'none',
    },
    btnSuccessHover: {
        backgroundColor: 'hsl(134, 61%, 51%)',
    }
};

const Home = () => {
    return (
        <div style={styles.backgroundRadialGradient}>
            <div style={styles.content}>
                <h1 className="my-5 display-5 fw-bold ls-tight">
                    Welcome to <br />
                    <span style={{ color: 'hsl(218, 81%, 75%)' }}>InfoLock</span>
                </h1>
                <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
                    InfoLock is dedicated to providing top-notch solutions for software security.
                    We aim to help you protect your applications from vulnerabilities and ensure data integrity.
                </p>

                {/* Sign In button */}
                <a
                    href="/SignIn"
                    className="btn"
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.btnPrimaryHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.btnPrimary.backgroundColor)}
                >
                    Sign In
                </a>

                {/* Sign Up button */}
                <a
                    href="/SignUp"
                    className="btn"
                    style={{ ...styles.btn, ...styles.btnSuccess }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.btnSuccessHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.btnSuccess.backgroundColor)}
                >
                    Sign Up
                </a>
            </div>
        </div>
    );
};

export default Home;
