import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import '../../styles/admin-login.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async e => {
        e.preventDefault();
        dispatch({ type: 'LOGIN_START' });

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });

            const result = await res.json();

            if (!res.ok) return alert(result.message);

            if (result.data.role !== 'admin') {
                return alert('Restricted access. Only administrators may proceed.');
            }

            dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
            navigate('/admin');

        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
            alert(err.message);
        }
    };

    return (
        <section className="admin-gateway-section">
            <div className="gate-card">
                <div className="gate-id-badge">Horizon Console 🛰️</div>
                <h1 className="gate-title">GATEWAY</h1>
                <p className="gate-subtitle">System Administrator Identification Required</p>

                <form onSubmit={handleClick}>
                    <div className="gate-input-group">
                        <label className="gate-label">ADMIN IDENTITY</label>
                        <input 
                            type="text" 
                            id="username" 
                            className="gate-field" 
                            placeholder="Authorized ID" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="gate-input-group">
                        <label className="gate-label">SECURITY PASSCODE</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="gate-field" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-gate-launch shadow-glow-white">
                        INITIALIZE CONNECTION
                    </button>
                </form>

                <div className="gate-footer">
                    <p className="footer-text">© 2026 HORIZON SYSTEM OPERATIONS</p>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
