import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

export default function InvoiceAudit({ userRole, refreshTrigger }) {
  const [filterInvoiceId, setFilterInvoiceId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState({ todayEarning: 0, monthEarning: 0, securityLogs: [] });

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const BASE_URL = "https://sunnyrajput-medical-erp.onrender.com";

  const pullSystemReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const invoiceIdParam = filterInvoiceId ? filterInvoiceId.trim() : "";
      const nameParam = filterName ? filterName.trim() : "";
      const dateParam = filterDate ? filterDate : "";

      const resLogs = await axios.get(`${BASE_URL}/bills/all`, {
  ...config,
  params: { invoiceId: invoiceIdParam, name: nameParam, date: dateParam }
});

      setAuditLogs(resLogs.data);

      if (userRole === 'Owner') {
        const resAnalytics = await axios.get(`${BASE_URL}/reports/owner-metrics`, config);

        setAnalytics(resAnalytics.data);
      }
    } catch (err) { 
      console.error("Report aggregation framework anomaly:", err); 
    }
  };

  useEffect(() => {
    pullSystemReports();
  }, [refreshTrigger, filterInvoiceId, filterName, filterDate]);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowBillModal(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-bill-area').innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    window.location.reload(); 
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      <h4 className="text-secondary border-bottom pb-2 mb-3 fw-bold">📊 Search Bill's </h4>
      
      {/* Search Filter Form */}
      <div className="d-flex flex-column gap-2 mb-3">
        <input 
          type="text" 
          className="form-control form-control-sm" 
          placeholder="Bill Invoice ID..." 
          value={filterInvoiceId}
          onChange={e => setFilterInvoiceId(e.target.value)} 
        />
        <div className="row g-1">
          <div className="col">
            <input 
              type="text" 
              className="form-control form-control-sm" 
              placeholder="Patient Name" 
              value={filterName}
              onChange={e => setFilterName(e.target.value)} 
            />
          </div>
          <div className="col">
            <input 
              type="date" 
              className="form-control form-control-sm" 
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)} 
            />
          </div>
        </div>
        <button className="btn btn-secondary btn-sm fw-bold" onClick={pullSystemReports}>
          Search Bill's
        </button>
      </div>

      {/* Query Results Table */}
      <div className="mt-3 border-top pt-3">
        <h6 className="fw-bold text-secondary mb-2">Total Patients' Bills ({auditLogs.length})</h6>
        {auditLogs.length === 0 ? (
          <p className="text-muted small text-center my-2">No matching transaction records found.</p>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            <table className="table table-sm table-striped table-hover align-middle small mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Invoice No</th>
                  <th>Patient Name</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={log._id || index}>
                    <td className="font-monospace text-primary fw-bold">
                      <span 
                        style={{ cursor: 'pointer', textDecoration: 'underline' }} 
                        onClick={() => handleInvoiceClick(log)}
                      >
                        {log.invoiceNumber || 'N/A'}
                      </span>
                    </td>
                    <td>{log.patientName || 'Unknown'}</td>
                    <td className="fw-bold">₹{log.grandTotal || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Owner Analytics Section */}
      {userRole === 'Owner' && (
        <div className="row g-2 mt-3 text-center">
          <div className="col">
            <div className="bg-primary-subtle p-2 rounded text-primary">
              <h6>Daily Sale</h6>
              <h4 className="fw-bold mb-0">₹{analytics.todayEarning || 0}</h4>
            </div>
          </div>
          <div className="col">
            <div className="bg-success-subtle p-2 rounded text-success">
              <h6>Monthly Sale</h6>
              <h4 className="fw-bold mb-0">₹{analytics.monthEarning || 0}</h4>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL --- */}
      {showBillModal && selectedInvoice && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">📄 Invoice Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowBillModal(false)}></button>
              </div>
              
              <div className="modal-body" id="printable-bill-area">
                <div className="p-4 bg-white rounded border">
                  <div className="text-center mb-3">
                    <h4 className="fw-bold m-0 text-uppercase">INVOICE / BILL</h4>
                    <small className="text-muted">Medical Transaction Receipt</small>
                  </div>
                  <hr />
                  <div className="row small mb-4">
                    <div className="col-6">
                      <strong>Invoice No:</strong> {selectedInvoice.invoiceNumber || 'N/A'}<br />
                      <strong>Date:</strong> {selectedInvoice.saleDate ? new Date(selectedInvoice.saleDate).toLocaleDateString() : new Date().toLocaleDateString()}
                    </div>
                    <div className="col-6 text-end">
                      <strong>Patient Name:</strong> {selectedInvoice.patientName || 'Unknown'}<br />
                      <strong>Phone:</strong> {selectedInvoice.patientPhone || 'N/A'}<br />
                      <strong>Payment Status:</strong> <span className={`badge ${selectedInvoice.paymentStatus === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{selectedInvoice.paymentStatus || 'Completed'}</span>
                    </div>
                  </div>

                  <h6 className="fw-bold text-secondary mb-2">💊 Medicine / Item Details</h6>
                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered table-striped small align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '45%' }}>Medicine Name</th>
                          <th className="text-center" style={{ width: '15%' }}>Qty</th>
                          <th className="text-end" style={{ width: '20%' }}>Unit Price</th>
                          <th className="text-end" style={{ width: '20%' }}>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.soldItems && selectedInvoice.soldItems.length > 0 ? (
                          selectedInvoice.soldItems.map((item, idx) => (
                            <tr key={idx}>
                              <td className="fw-semibold text-dark">{item.name || 'N/A'}</td>
                              <td className="text-center">{item.quantity || 0}</td>
                              <td className="text-end">₹{item.pricePerUnit || 0}</td>
                              <td className="text-end fw-bold">₹{item.totalCost || 0}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted py-2">No medicine details found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <h5 className="fw-bold m-0">Grand Total:</h5>
                    <h4 className="fw-bold text-success m-0">₹{selectedInvoice.grandTotal || 0}</h4>
                  </div>
                </div>
              </div>

              <div className="modal-footer gap-2">
                <button type="button" className="btn btn-primary fw-bold px-4" onClick={handlePrint}>🖨️ Print Invoice</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBillModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}