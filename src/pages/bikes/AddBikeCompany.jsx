
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  addBikeCompany,
  addBikeModel,
  addBikeVariant,
  getBikeCompanies,
  getBikeModels,
  getBikeVariants
} from "../../api";
import "./AddBike.css";

const AddBike = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [variants, setVariants] = useState([]);

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
    if (selectedModelId) {
      loadVariants(selectedModelId);
    }
  }, [selectedModelId]);

  const loadVariants = async (modelId) => {
    if (!modelId) return;

    try {
      const res = await getBikeVariants(modelId);
      if (res.status === 200) {
        setVariants(res.data);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load variants", "error");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  // ⭐ ADD THIS HERE ⭐

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

    }
  };

  const submitModel = async () => {
    if (!modelName || !selectedCompanyId)
      return Swal.fire("Required", "Company & Model name required", "info");

    const res = await addBikeModel({
      company_id: selectedCompanyId,
      model_name: modelName
    });

    if (res.status === 200 || res.success) {
      Swal.fire("Success", "Model added!", "success");
      setModelName("");
      loadModels(selectedCompanyId);

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


      loadVariants(selectedModelId);

      Swal.fire("Success", "Variant added!", "success");
      setVariantName("");
      setEngineCC("");

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

        {activeTab === "variant" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
              gap: "12px",
              alignItems: "end",
              marginTop: "10px"
            }}
          >
            {/* Company */}
            <div>
              <label>Select Company</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label>Select Model</label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                disabled={!selectedCompanyId}
                style={{ width: "100%" }}
              >
                <option value="">Select Model</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>{m.model_name}</option>
                ))}
              </select>
            </div>

            {/* Variant Name */}
            <div>
              <label>Variant Name</label>
              <input
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                placeholder="Variant name"
                style={{ width: "100%" }}
              />
            </div>

            {/* Engine CC */}
            <div>
              <label>Engine CC</label>
              <input
                value={engineCC}
                onChange={(e) => setEngineCC(e.target.value)}
                placeholder="CC"
                style={{ width: "100%" }}
              />
            </div>

            {/* Save Button */}

          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "12px"
          }}
        >
          <button
            className="save-btn"
            onClick={submitVariant}
          >
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>

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

                  <button className="delete">Remove</button>
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

                  <button className="delete">Remove</button>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v._id}>
              <td>{v.variant_name}</td>
              <td>{v.engine_cc}</td>
              <td>

                <button className="delete">Remove</button>
              </td>
            </tr>
          ))}
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
