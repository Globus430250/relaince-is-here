import React, { useEffect, useState } from 'react';

export default function Dashboard({ user }) {
  const [bills, setBills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/bills/${user.id}`)
      .then(res => res.json())
      .then(setBills);
  }, [user.id]);

  function showDetails(billId) {
    fetch(`http://localhost:5000/api/bill/${billId}`)
      .then(res => res.json())
      .then(setBillDetails);
    setSelected(billId);
  }

  function payBill(billId) {
    fetch(`http://localhost:5000/api/pay/${billId}`, { method: 'POST' })
      .then(() => {
        setBills(bills.map(b => b.id === billId ? { ...b, status: 'Paid' } : b));
        if (selected === billId) setBillDetails({ ...billDetails, status: 'Paid' });
      });
  }

  return (
    <div>
      <h2>Your Bills</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Bill</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td>{bill.details}</td>
              <td>{bill.due_date}</td>
              <td>{bill.status}</td>
              <td>₹{bill.amount}</td>
              <td>
                <button onClick={() => showDetails(bill.id)}>View</button>
                {bill.status === 'Unpaid' && (
                  <button onClick={() => payBill(bill.id)}>Pay</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {billDetails && (
        <div style={{border:'1px solid #ccc', margin:'1em', padding:'1em'}}>
          <h3>Bill Details</h3>
          <p><b>Type:</b> {billDetails.details}</p>
          <p><b>Amount:</b> ₹{billDetails.amount}</p>
          <p><b>Due:</b> {billDetails.due_date}</p>
          <p><b>Status:</b> {billDetails.status}</p>
          <button onClick={() => setBillDetails(null)}>Close</button>
        </div>
      )}
    </div>
  );
}