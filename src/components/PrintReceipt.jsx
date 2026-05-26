import React from 'react';
export default function PrintReceipt({ printInvoice, patientMobile }) {
  if (!printInvoice) return null;
  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            /* Sirf is full page print component ko screen aur paper par dikhane ke liye */
            .print-invoice-view, .print-invoice-view * {
              visibility: visible;
            }
            .print-invoice-view {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              padding: 20px !important;
              margin: 0px !important;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            }
            /* Standard A4 Page Dimensions with clean boundary margins */
            @page {
              size: A4 portrait;
              margin: 15mm 20mm 15mm 20mm;
            }
          }
        `}
      </style>

      {/* 📄 FULL PAGE CONTAINER WRAPPER */}
      <div className="print-invoice-view text-dark mx-auto" style={{ maxWidth: '850px', padding: '30px', backgroundColor: '#fff' }}>
        
        {/* 🏥 CLINIC LETTERHEAD HEADER (FULL WIDTH) */}
        <div className="invoice-header text-center mb-4">
          <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: '1.5px', color: '#1a1a1a', fontSize: '28px' }}>
            METROPOLITAN CENTRAL LOCAL PHARMACY
          </h2>
          <p className="mb-1 text-muted" style={{ fontSize: '14px', marginTop: '5px' }}>
            Bijnor Uttra Pardesh 
          </p>
          <p className="fw-semibold mb-0" style={{ fontSize: '13px', color: '#444' }}>
            📞 Contact: +91-9898989870 &nbsp;|&nbsp; ✉️ Email: xyz@gmail.com
          </p>
        </div>
        
        <div style={{ borderTop: '2px solid #222', margin: '15px 0' }} />
        
        {/* 📄 INVOICE & PATIENT DEMOGRAPHICS TWO-COLUMN META INFRASTRUCTURE */}
        <div className="row mb-4" style={{ display: 'flex', justifyContent: 'between', fontSize: '14px', lineHeight: '1.8' }}>
          <div style={{ flex: 1 }}>
            <h5 className="fw-bold mb-2 text-secondary text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>Patient Details</h5>
            <div><strong>Patient Name:</strong> {printInvoice.patientName}</div>
            <div><strong>Age / Gender:</strong> {printInvoice.patientAge} Yrs</div>
            <div><strong>Contact Mobile:</strong> {printInvoice.patientPhone || patientMobile || 'N/A'}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h5 className="fw-bold mb-2 text-secondary text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>Invoice Meta</h5>
            <div><strong>Invoice No:</strong> <span className="font-monospace fw-bold">{printInvoice.invoiceNumber}</span></div>
            <div><strong>Date & Time:</strong> {new Date(printInvoice.saleDate || Date.now()).toLocaleString()}</div>
            <div><strong>Payment Mode:</strong> <span className="badge bg-dark text-white px-2 py-1 small">{printInvoice.paymentMethod}</span></div>
          </div>
        </div>
        
        {/* 💊 PHARMACEUTICAL LINE ITEMS FULL-WIDTH TABLE */}
        <table className="table billing-table w-100 mt-4" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #222', backgroundColor: '#f8f9fa' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 'bold' }}>Medicine Item Description</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 'bold' }}>Category</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 'bold' }}>Price/Unit</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 'bold', width: '80px' }}>Quantity</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 'bold', width: '120px' }}>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {printInvoice.soldItems && printInvoice.soldItems.map((med, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600', color: '#222' }}>{med.name}</td>
                <td style={{ padding: '12px 8px', color: '#555' }}>{med.category}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>₹{med.pricePerUnit || (med.totalCost / med.quantity).toFixed(2)}</td>
                <td style={{ textAlign: 'center', padding: '12px 8px', fontWeight: '600' }}>{med.quantity}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 'bold', color: '#000' }}>₹{med.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 💰 GRAND NET TOTAL BLOCK (RIGHT SIDE ALIGNED) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <div style={{ width: '320px', borderTop: '2px solid #222', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '15px', color: '#555' }}>Subtotal Amount:</span>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>₹{printInvoice.grandTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '15px', color: '#555' }}>Tax / CGST / SGST:</span>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
              <span className="fw-bold" style={{ fontSize: '16px', color: '#1a1a1a' }}>Grand Net Paid Total:</span>
              <span className="fw-bold" style={{ fontSize: '22px', color: '#000' }}>₹{printInvoice.grandTotal}</span>
            </div>
          </div>
        </div>
        
        {/* FOOTER AREA TERMS & SYSTEM VALEDICTORY */}
        <div style={{ marginTop: '60px', borderTop: '1px solid #dee2e6', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555' }}>
            <div>
              <p className="mb-1 fw-bold text-dark">Terms & Conditions:</p>
              <p className="mb-0">1. Goods once sold will not be taken back or exchanged.</p>
              <p className="mb-0">2. Requires a valid doctor's prescription for scheduled drugs.</p>
            </div>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <p style={{ borderTop: '1px solid #999', width: '180px', display: 'inline-block', marginBottom: '5px' }}></p>
              <p className="fw-bold text-dark mb-0">Authorized Signatory</p>
            </div>
          </div>
          
          <div className="text-center mt-5" style={{ fontSize: '11px', color: '#777' }}>
            <p className="mb-1">--- Computer Generated Audit Invoice Slip. No Signature Required. ---</p>
            <p className="mb-0 fw-bold text-dark" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>THANK YOU! GET WELL SOON.</p>
          </div>
        </div>

      </div>
    </>
  );
}

