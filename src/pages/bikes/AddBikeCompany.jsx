import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addBikeCompany, addBikeModel, addBikeVariant, getBikeCompanies, getBikeModels } from "../../api";
import { useNavigate } from "react-router-dom";

const AddBike = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelId, setModelId] = useState("");
  const [variantName, setVariantName] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const navigate = useNavigate()
  // Fetch companies on component load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getBikeCompanies();
        if (response.status === 200) {
          setCompanies(response.data);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch companies", "error");
      }
    };
    fetchCompanies();
  }, []);

  // Fetch models when companyId changes
  useEffect(() => {
    if (!companyId) return;
    const fetchModels = async () => {
      try {
        const response = await getBikeModels(companyId);
        if (response.status === 200) {
          setModels(response.data);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch models", "error");
      }
    };
    fetchModels();
  }, [companyId]);

  const handleSubmitCompany = async () => {
    if (!companyName) return Swal.fire("Error", "Company name required!", "error");
    try {
      const response = await addBikeCompany({ name: companyName });
      if (response.message === "Bike company added successfully") {
        setCompanies([...companies, response.data]);
        Swal.fire("Success", "Company added!", "success");
        setCompanyName("");
      }
      if (response.message === "Bike company already exists!") {
        Swal.fire("Error", "Bike company already exists!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add company", "error");
    }
  };

  const handleSubmitModel = async () => {
    if (!modelName || !companyId) return Swal.fire("Error", "Model name & Company required!", "error");
    try {
      const response = await addBikeModel({ company_id: companyId, model_name: modelName });
      if (response.message === "Bike model added successfully") {
        setModels([...models, response.data]);
        Swal.fire("Success", "Bike model added successfully", "success");
        setModelName("");
      }
      if (response.message === "Bike model already exists!") {
        Swal.fire("Error", "Bike model already exists!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add model", "error");
    }
  };

  const handleSubmitVariant = async () => {
    if (!variantName || !engineCC || !modelId) return Swal.fire("Error", "All fields required!", "error");
    try {
      const response = await addBikeVariant({ model_id: modelId, variant_name: variantName, engine_cc: engineCC });
      if (response.status === 200) {
        Swal.fire("Success", "Variant added!", "success");
        setVariantName(""); // ✅ Clears input field
        setEngineCC(""); // ✅ Clears input field
        navigate("/bikes")
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add variant", "error");
    }
  };


  return (
    <div id="add-bike-container">
      <h2 id="add-bike-title">🚀 Add Bike Details</h2>

      {/* Tab Navigation */}
      <div id="bike-tabs">
        <button className={`bike-tab-btn ${activeTab === "company" ? "active" : ""}`} onClick={() => setActiveTab("company")}>Add Company</button>
        <button className={`bike-tab-btn ${activeTab === "model" ? "active" : ""}`} onClick={() => setActiveTab("model")}>Add Model</button>
        <button className={`bike-tab-btn ${activeTab === "variant" ? "active" : ""}`} onClick={() => setActiveTab("variant")}>Add Variant</button>
      </div>

      {/* Company Form */}
      {activeTab === "company" && (
        <div id="bike-company-form" className="bike-form">
          <input className="bike-input" type="text" placeholder="Enter company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <button className="bike-submit-btn" onClick={handleSubmitCompany}>Add Company</button>
        </div>
      )}

      {/* Model Form */}
      {activeTab === "model" && (
        <div id="bike-model-form" className="bike-form">
          <input className="bike-input" type="text" placeholder="Enter model name" value={modelName} onChange={(e) => setModelName(e.target.value)} />

          {/* Dropdown for selecting a company */}
          <select className="bike-dropdown" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>

          <button className="bike-submit-btn" onClick={handleSubmitModel} disabled={!companyId}>Add Model</button>
        </div>
      )}

      {/* Variant Form */}
      {activeTab === "variant" && (
        <div id="bike-variant-form" className="bike-form">
          <input className="bike-input" type="text" placeholder="Enter variant name" value={variantName} onChange={(e) => setVariantName(e.target.value)} />
          <input className="bike-input" type="number" placeholder="Enter engine CC" value={engineCC} onChange={(e) => setEngineCC(e.target.value)} />

          {/* Dropdown for selecting a model */}
          <select className="bike-dropdown" value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={!companyId}>
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model._id} value={model._id}>
                {model.model_name}
              </option>
            ))}
          </select>

          <button className="bike-submit-btn" onClick={handleSubmitVariant} disabled={!modelId}>Add Variant</button>
        </div>
      )}
    </div>
  );
};

export default AddBike;
