import React, { useState } from 'react';
import AuthPortal from './components/AuthPortal';
import BillingTerminal from './components/BillingTerminal';
import InvoiceAudit from './components/InvoiceAudit';
import PrintReceipt from './components/PrintReceipt';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [staffName, setStaffName] = useState(localStorage.getItem('staffName') || '');
  const [printInvoice, setPrintInvoice] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUserRole('');
    setStaffName('');
  };

  if (!token) {
    return <AuthPortal setToken={setToken} setUserRole={setUserRole} setStaffName={setStaffName} />;
  }

  return (
    <div>
      {/* Bootstrap Responsive Header Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 no-print">
        <span className="navbar-brand mb-0 h1">🏥 Medical Store({userRole})</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">User: <strong>{staffName}</strong></span>
          <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Secure Logout</button>
        </div>
      </nav>

      <div className="container-fluid my-4 no-print">
        <div className="row g-4">
          {/* POS Terminal Grid Module Column */}
          <div className="col-lg-7 col-md-12">
            <BillingTerminal staffName={staffName} setPrintInvoice={setPrintInvoice} triggerRefresh={() => setRefreshTrigger(prev => prev + 1)} />
          </div>
          {/* Audit Logs and Financial Report Metrics Column */}
          <div className="col-lg-5 col-md-12">
            <InvoiceAudit userRole={userRole} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      {/* Hidden Print Wrapper Node Asset */}
      {printInvoice && <PrintReceipt printInvoice={printInvoice} />}
    </div>
  );
}
