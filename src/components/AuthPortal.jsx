import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPortal({ setToken, setUserRole, setStaffName }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cashier');
  const [loading, setLoading] = useState(false);

  
  const BASE_URL = "https://sunnyrajput-medical-erp.onrender.com";


  const performLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ EXACT LOGIN ENDPOINT FIXED HERE
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('staffName', res.data.user.name);
      
      setToken(res.data.token);
      setUserRole(res.data.user.role);
      setStaffName(res.data.user.name);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid employee server session access parameters. Check your password!");
    } finally {
      setLoading(false);
    }
  };

  const performRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ EXACT REGISTER ENDPOINT FIXED HERE
      const res = await axios.post(`${BASE_URL}/auth/register`, { name, email, password, role });
      alert(res.data.message || "Staff account created successfully!");
      setName('');
      setEmail('');
      setPassword('');
      setIsRegistering(false);
    } catch (err) {
      alert(err.response?.data?.error || "Registration validation anomaly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 FULL SCREEN WITH GRADIENT BACKGROUND
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light bg-gradient position-relative overflow-hidden">
      
      {/* 🔮 BACKGROUND DECORATIVE GLOWING PULSE RINGS (PURE BOOTSTRAP UTILITIES) */}
      <div className="position-absolute top-0 end-0 translate-middle spinner-grow text-primary opacity-25" style={{ width: '400px', height: '400px', animationDuration: '4s' }} role="status"></div>
      <div className="position-absolute bottom-0 start-0 spinner-grow text-info opacity-25" style={{ width: '500px', height: '500px', animationDuration: '6s' }} role="status"></div>

      {/* 📦 CLEAN WHITE SHADOWED INTERACTIVE BOX CARD */}
      <div className="card shadow-lg border-0 p-4 w-100 bg-white rounded-4 position-relative" style={{ maxWidth: '420px', zIndex: 10 }}>
        
        <div className="text-center mb-4">
          {/* 🏥 PULSING CORE MEDICAL BADGE USING BOOTSTRAP RIPPLES */}
          <div className="position-relative d-inline-block mb-3">
            <div className="position-absolute top-50 start-50 translate-middle spinner-ping bg-primary rounded-circle opacity-75" style={{ width: '70px', height: '70px' }}></div>
            <div className="bg-primary bg-gradient text-white rounded-4 shadow-sm d-flex align-items-center justify-content-center position-relative" style={{ width: '64px', height: '64px', fontSize: '28px', zIndex: 2 }}>
              🏥
            </div>
          </div>

          <h3 className="fw-bold text-dark mb-1 tracking-tight">Medical Core System</h3>
          <p className="text-muted small mb-3">Good Health -:- Good Wealth</p>
          
          {/* SLIDING PILL SWITCH NAVIGATOR */}
          <div className="bg-light p-1 rounded-3 d-flex border border-light-subtle">
            <button 
              type="button" 
              className={`btn btn-sm flex-fill fw-semibold rounded-2 transition-all ${!isRegistering ? 'btn-white bg-white shadow-sm text-primary' : 'btn-light text-secondary border-0'}`}
              onClick={() => setIsRegistering(false)}
            >
              SiGn In 
            </button>
            <button 
              type="button" 
              className={`btn btn-sm flex-fill fw-semibold rounded-2 transition-all ${isRegistering ? 'btn-white bg-white shadow-sm text-primary' : 'btn-light text-secondary border-0'}`}
              onClick={() => setIsRegistering(true)}
            >
            ReGiSteR
            </button>
          </div>
        </div>

        {/* 📋 INTERACTION SCREEN FRAMEWORK LAYER A: LOGIN PORTAL */}
        {!isRegistering ? (
          <form onSubmit={performLogin}>
            <div className="mb-3">
              <label className="form-label text-secondary small fw-bold">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg fs-6 rounded-3" 
                placeholder="name@medical.com" 
                value={email || ''} 
                required 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary small fw-bold">Master System Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg fs-6 rounded-3" 
                placeholder="••••••••" 
                value={password || ''} 
                required 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="btn btn-primary bg-gradient w-100 fw-bold py-2.5 rounded-3 shadow" disabled={loading}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Validating Matrix...</span>
                </div>
              ) : (
                "SiGn In"
              )}
            </button>
          </form>
        ) : (
          /* 📋 INTERACTION SCREEN FRAMEWORK LAYER B: ACCOUNT INGESTION SIGNUP */
          <form onSubmit={performRegistration}>
            <div className="mb-2">
              <label className="form-label text-secondary small fw-bold">Full Identity Name</label>
              <input 
                type="text" 
                className="form-control rounded-3" 
                placeholder="Name Please" 
                value={name || ''} 
                required 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label text-secondary small fw-bold">Corporate Registry Email</label>
              <input 
                type="email" 
                className="form-control rounded-3" 
                placeholder="Email with @medical.com extension" 
                value={email || ''} 
                required 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label text-secondary small fw-bold">System Password Hash</label>
              <input 
                type="password" 
                className="form-control rounded-3" 
                placeholder="Insert Strong Password" 
                value={password || ''} 
                required 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small fw-bold">Authorization Role Node</label>
              <select className="form-select rounded-3" value={role || 'Cashier'} onChange={e => setRole(e.target.value)}>
                <option value="Cashier">Cashier POS Operator</option>
                <option value="Owner">Owner System Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success bg-gradient w-100 fw-bold py-2 rounded-3 shadow" disabled={loading}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Injecting Node Data...</span>
                </div>
              ) : (
                "ReGiSteRaTiON"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
