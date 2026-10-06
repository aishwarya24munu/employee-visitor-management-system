import axios from "axios";
import { useEffect, useState } from "react";

import "./App.css";

const API_URL = "http://localhost:5000/api/visitors";

function App() {
  const [visitors, setVisitors] = useState([]);

  const [formData, setFormData] = useState({
    visitorName: "",
    mobileNumber: "",
    email: "",
    organization: "",
    personToMeet: "",
    purpose: "",
    visitDateTime: "",
    status: "Checked In",
  });

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Get visitors from backend
  const fetchVisitors = async () => {
    try {
      const response = await axios.get(API_URL);
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update visitor
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId === null) {
        await axios.post(API_URL, formData);
      } else {
        await axios.put(`${API_URL}/${editId}`, formData);
        setEditId(null);
      }

      setFormData({
        visitorName: "",
        mobileNumber: "",
        email: "",
        organization: "",
        personToMeet: "",
        purpose: "",
        visitDateTime: "",
        status: "Checked In",
      });

      fetchVisitors();
    } catch (error) {
      console.error("Error saving visitor:", error);
    }
  };

  // Delete visitor
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchVisitors();
    } catch (error) {
      console.error("Error deleting visitor:", error);
    }
  };

  // Edit visitor
  const handleEdit = (visitor) => {
    setFormData({
      visitorName: visitor.visitorName,
      mobileNumber: visitor.mobileNumber,
      email: visitor.email || "",
      organization: visitor.organization || "",
      personToMeet: visitor.personToMeet,
      purpose: visitor.purpose,
      visitDateTime: visitor.visitDateTime
        ? visitor.visitDateTime.slice(0, 16)
        : "",
      status: visitor.status,
    });

    setEditId(visitor._id);
  };

  // Search visitor
  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      visitor.mobileNumber.includes(search)
  );

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Employee Visitor Management System</h1>
        <p>Manage visitor records easily and efficiently</p>
      </header>

      {/* Form */}
      <section className="form-section">

        <h2>
          {editId === null ? "Add New Visitor" : "Update Visitor"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Visitor Name</label>
              <input
                type="text"
                name="visitorName"
                placeholder="Enter visitor name"
                value={formData.visitorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Organization / College</label>
              <input
                type="text"
                name="organization"
                placeholder="Enter organization or college"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Person to Meet</label>
              <input
                type="text"
                name="personToMeet"
                placeholder="Enter person to meet"
                value={formData.personToMeet}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Purpose of Visit</label>
              <input
                type="text"
                name="purpose"
                placeholder="Enter purpose of visit"
                value={formData.purpose}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date & Time of Visit</label>
              <input
                type="datetime-local"
                name="visitDateTime"
                value={formData.visitDateTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Checked In</option>
                <option>Checked Out</option>
              </select>
            </div>

          </div>

          <button type="submit" className="add-btn">
            {editId === null ? "Add Visitor" : "Update Visitor"}
          </button>

        </form>
      </section>

      {/* Visitor Records */}
      <section className="records-section">

        <div className="records-header">

          <h2>Visitor Records</h2>

          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Organization</th>
                <th>Person to Meet</th>
                <th>Purpose</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredVisitors.length === 0 ? (

                <tr>
                  <td colSpan="8" className="no-data">
                    No visitor records found
                  </td>
                </tr>

              ) : (

                filteredVisitors.map((visitor) => (

                  <tr key={visitor._id}>

                    <td>{visitor.visitorName}</td>

                    <td>{visitor.mobileNumber}</td>

                    <td>{visitor.organization}</td>

                    <td>{visitor.personToMeet}</td>

                    <td>{visitor.purpose}</td>

                    <td>
                      {new Date(visitor.visitDateTime).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          visitor.status === "Checked In"
                            ? "checked-in"
                            : "checked-out"
                        }`}
                      >
                        {visitor.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(visitor)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(visitor._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default App;