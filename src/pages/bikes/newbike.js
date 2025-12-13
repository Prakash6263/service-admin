
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  addBikeCompany,
  addBikeModel,
  addBikeVariant,
  getBikeCompanies,
  getBikeModels
} from "../../api";
import "./AddBike.css";

const AddBike = () => {
  const [activeTab, setActiveTab] = useState("company");

  const [companyName, setCompanyName] = useState("");
  const [modelName, setModelName] = useState("");
  const [variantName, setVariantName] = useState("");
  const [engineCC, setEngineCC] = useState("");

  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);

  // NEW STATES for dropdown
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  const [showForm, setShowForm] = useState(false);

  // -------------------------
  // Fetch companies
  // -------------------------
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await getBikeCompanies();
      if (res.status === 200) setCompanies(res.data);
    } catch {
      Swal.fire("Error", "Unable to load companies", "error");
    }
  };

  // Fetch models when company changes (For variant adding)
  useEffect(() => {
    if (!selectedCompanyId) return;
    loadModels(selectedCompanyId);
  }, [selectedCompanyId]);

  const loadModels = async (companyId) => {
    try {
      const res = await getBikeModels(companyId);
      if (res.status === 200) setModels(res.data);
    } catch {
      Swal.fire("Error", "Unable to load models", "error");
    }
  };

  // -------------------------
  // SUBMIT HANDLERS
  // -------------------------

  const submitCompany = async () => {
    if (!companyName) return Swal.fire("Required", "Company name is required", "info");

    const res = await addBikeCompany({ name: companyName });

    if (res.message === "Bike company added successfully") {
      Swal.fire("Success", "Company added!", "success");
      setCompanyName("");
      fetchCompanies();
      setShowForm(false);
    }
  };

  const submitModel = async () => {
    if (!modelName || !selectedCompanyId)
      return Swal.fire("Required", "Company & Model name required", "info");

    const res = await addBikeModel({
      company_id: selectedCompanyId,
      model_name: modelName
    });

    if (res.message === "Bike model added successfully") {
      Swal.fire("Success", "Model added!", "success");
      setModelName("");
      loadModels(selectedCompanyId);
      setShowForm(false);
    }
  };

  const submitVariant = async () => {
    if (!variantName || !engineCC || !selectedModelId)
      return Swal.fire("Required", "All fields required", "info");

    const res = await addBikeVariant({
      model_id: selectedModelId,
      variant_name: variantName,
      engine_cc: engineCC
    });

    if (res.status === 200) {
      Swal.fire("Success", "Variant added!", "success");
      setVariantName("");
      setEngineCC("");
      setShowForm(false);
    }
  };



  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div className="form-box">

        {/* ADD COMPANY */}
        {activeTab === "company" && (
          <>
            <label>Company Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
            <button className="save-btn" onClick={submitCompany}>Save</button>
          </>
        )}

        {/* ADD MODEL (WITH COMPANY DROPDOWN) */}
        {activeTab === "model" && (
          <>
            <label>Select Company</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <label>Model Name</label>
            <input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
            />

            <button className="save-btn" onClick={submitModel}>Save</button>
          </>
        )}

        {/* ADD VARIANT (WITH COMPANY + MODEL DROPDOWN) */}
        {activeTab === "variant" && (
          <>
            <label>Select Company</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <label>Select Model</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              disabled={!selectedCompanyId}
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m._id} value={m._id}>{m.model_name}</option>
              ))}
            </select>

            <label>Variant Name</label>
            <input
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Enter variant name"
            />

            <label>Engine CC</label>
            <input
              value={engineCC}
              onChange={(e) => setEngineCC(e.target.value)}
              placeholder="Enter engine CC"
            />

            <button className="save-btn" onClick={submitVariant}>Save</button>
          </>
        )}

        <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
      </div>
    );
  };



  const renderTable = () => {
    if (activeTab === "company") {
      return (
        <table className="table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                  <button className="edit">Edit</button>
                  <button className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "model") {
      return (
        <table className="table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m._id}>
                <td>{m.model_name}</td>
                <td>
                  <button className="edit">Edit</button>
                  <button className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Variant Name</th>
            <th>Engine CC</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* You can load variants list here */}
        </tbody>
      </table>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid add-bike-page">

        {/* TABS */}
        <div className="tabs">
          {["company", "model", "variant"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setShowForm(false);
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ADD BUTTON */}
        <div className="add-row">
          <h2>{activeTab.toUpperCase()} LIST</h2>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add New
          </button>
        </div>

        {/* FORM */}
        {renderForm()}
        <div className="table-box">
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default AddBike;
