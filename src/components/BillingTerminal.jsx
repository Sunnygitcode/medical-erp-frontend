import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
export default function BillingTerminal({
  staffName,
  setPrintInvoice,
  triggerRefresh,
}) {
  const [patient, setPatient] = useState({
    patientName: "",
    patientAge: "",
    patientPhone: "",
  });
  const BASE_URL = "https://sunnyrajput-medical-erp.onrender.com";

  const [dbMedicines, setDbMedicines] = useState([]);
  const [searchMed, setSearchMed] = useState("");
  const [foundMed, setFoundMed] = useState(null);
  const [patientGender, setPatientGender] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/medicines/all-list`);

        setDbMedicines(res.data);
      } catch (err) {
        console.error("Database data baseline sync failed.");
      }
    };
    loadCatalog();
  }, [triggerRefresh]);
  const handleItemSelection = (typedText) => {
    setSearchMed(typedText);
    const matched = dbMedicines.find(
      (m) => m.name.toLowerCase() === typedText.toLowerCase().trim(),
    );
    if (matched) {
      setFoundMed(matched);
    } else {
      setFoundMed(null);
    }
  };
  const searchInventory = async (e) => {
    if (e) e.preventDefault();
    if (!searchMed.trim()) return alert("Please specify a medicine name.");
    try {
      const response = await axios.get(`${BASE_URL}/inventory/search`, 
        {
          params: { name: searchMed.trim() },
        },
      );
      if (response.data && response.data.length > 0) {
        setFoundMed(response.data[0]);
        setShowSuggestions(false);
      } else {
        setFoundMed(null);
        alert("No medicine catalog match found.");
      }
    } catch (err) {
      alert("Search execution error.");
    }
  };
  const addItemToCart = () => {
    const target = foundMed;
    if (!target) return;
    const inputQty = parseInt(qty, 10);
    if (isNaN(inputQty) || inputQty <= 0)
      return alert("Please enter a valid quantity.");
    if (inputQty > target.stockQuantity)
      return alert("Insufficient database pool asset items!");
    setCart([
      ...cart,
      {
        medicineId: target._id,
        name: target.name,
        category: target.category,
        quantity: inputQty,
        pricePerUnit: target.pricePerUnit,
        totalCost: target.pricePerUnit * inputQty,
      },
    ]);

    setFoundMed(null);
    setSearchMed("");
    setQty(1);
  };
  const calculateTotalAmount = () => {
    return cart.reduce((acc, item) => acc + item.totalCost, 0);
  };
  const removeItemFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };
  const handleCheckout = async () => {
    if (!patient.patientName || !patient.patientPhone || cart.length === 0) {
      return alert("Please specify patient details and add items to cart.");
    }
    try {
     const res = await axios.post(`${BASE_URL}/checkout`, {

        ...patient,
        items: cart,
        paymentMethod,
        staffName: staffName || "Amit Sharma",
      });
      setActiveInvoice(res.data);
      if (paymentMethod === "Cash") {
        if (typeof setPrintInvoice === "function") setPrintInvoice(res.data);
        setTimeout(() => {
          window.print();
        }, 600);
        resetForm();
      } else {
        setShowQrModal(true);
      }
      if (typeof triggerRefresh === "function") {
        triggerRefresh();
      }
    } catch (err) {
      alert("POS Checkout validation anomaly.");
    }
  };
  const resetForm = () => {
    setPatient({ patientName: "", patientAge: "", patientPhone: "" });
    setCart([]);
    setSearchMed("");
    setFoundMed(null);
    setShowQrModal(false);
  };
  const getUpiString = () => {
    const upiId = "6398133172@nyes";
    const merchantName = "Medical Central Suite";
    const totalAmount = calculateTotalAmount();
    const invoiceId = activeInvoice?._id || `INV-${Date.now()}`;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tr=${invoiceId}`;
  };
  return (
    <div className="card shadow-sm border-0 p-4 bg-white position-relative">
      <h3 className="text-secondary border-bottom pb-2 mb-3 fw-bold">
        🛒 Patient Details Panel
      </h3>
      <div className="row g-2 mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Patient Name"
            value={patient.patientName}
            onChange={(e) =>
              setPatient({ ...patient, patientName: e.target.value })
            }
          />
        </div>
        <div className="col-3">
          <input
            type="number"
            className="form-control"
            placeholder="Age"
            value={patient.patientAge}
            onChange={(e) =>
              setPatient({ ...patient, patientAge: e.target.value })
            }
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Patient Phone"
            value={patient.patientPhone}
            onChange={(e) =>
              setPatient({ ...patient, patientPhone: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-3" style={{ position: "relative" }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search Medicines..."
            value={searchMed}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
            onChange={(e) => handleItemSelection(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary fw-bold"
            onClick={searchInventory}
          >
            Verify Stock
          </button>
        </div>
        {showSuggestions && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{
              zIndex: 1050,
              maxHeight: "220px",
              overflowY: "auto",
              top: "100%",
              left: 0,
              padding: 0,
            }}
          >
            {dbMedicines
              .filter(
                (med) =>
                  !searchMed.trim() ||
                  med.name.toLowerCase().includes(searchMed.toLowerCase()),
              )
              .map((med, index) => (
                <button
                  key={index}
                  type="button"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-start"
                  onMouseDown={() => {
                    setSearchMed(med.name);
                    setFoundMed(med);
                    setShowSuggestions(false);
                  }}
                >
                  <div>
                    <strong className="text-dark">{med.name}</strong>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2">
                      {med.category}
                    </span>
                  </div>
                  <small className="text-muted fw-semibold">
                    Rack: {med.rackNumber} | Stock: {med.stockQuantity}
                  </small>
                </button>
              ))}
            {dbMedicines.filter((med) =>
              med.name.toLowerCase().includes(searchMed.toLowerCase()),
            ).length === 0 && (
              <li className="list-group-item text-muted text-center py-3">
                This Medicine is not Present in Store.
              </li>
            )}
          </ul>
        )}
      </div>
      {foundMed && (
        <div className="alert alert-success d-flex align-items-center justify-content-between py-2 my-2">
          <span>
            <strong>{foundMed.name}</strong> &nbsp;[{foundMed.category}] -
            Price: ₹{foundMed.pricePerUnit} &nbsp;(Available:{" "}
            {foundMed.stockQuantity})
          </span>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: "65px" }}
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addItemToCart}
            >
              Append
            </button>
          </div>
        </div>
      )}
      <table className="table table-hover mt-2">
        <thead className="table-light">
          <tr>
            <th>Medicine Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Total</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>₹{item.totalCost}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-outline-danger py-0 px-2"
                  onClick={() => removeItemFromCart(i)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {cart.length > 0 && (
            <tr className="table-secondary fw-bold">
              <td colSpan="3" className="text-end">
                Grand Total:
              </td>
              <td>₹{calculateTotalAmount()}</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="bg-light p-3 rounded mb-3 d-flex justify-content-between align-items-center">
        <div>
          <label className="fw-bold text-muted small d-block">Payment By</label>
          <select
            className="form-select form-select-sm mt-1"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">Cash Settlement</option>
            <option value="UPI">UPI Digital Payment</option>
          </select>
        </div>
        <button
          type="button"
          className="btn btn-primary fw-bold"
          onClick={handleCheckout}
        >
          Print Bill
        </button>
      </div>
      {showQrModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Scan QR to Pay</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowQrModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <h5 className="text-secondary mb-3">
                  Amount to Collect:{" "}
                  <strong className="text-dark">
                    ₹{calculateTotalAmount()}
                  </strong>
                </h5>
                <div className="p-3 bg-white d-inline-block rounded shadow-sm border mb-4">
                  <QRCodeSVG
                    value={getUpiString()}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                <div className="d-grid gap-2 px-4">
                  <button
                    type="button"
                    className="btn btn-success btn-lg fw-bold"
                    onClick={() => {
                      if (
                        typeof setPrintInvoice === "function" &&
                        activeInvoice
                      )
                        setPrintInvoice(activeInvoice);
                      setTimeout(() => {
                        window.print();
                      }, 600);
                      resetForm();
                    }}
                  >
                    Confirm Payment Received
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowQrModal(false)}
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>   
      )}   
    </div>
  );
}


