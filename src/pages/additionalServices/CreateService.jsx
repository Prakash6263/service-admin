import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import {
  getDealerList,
  getBikeCompanies,
  getBikeModels,
  getBikeVariants
} from "../../api";
import CreatableSelect from "react-select/creatable";
const serviceNameOptions = [
  // 🔧 Engine & Performance
  { label: "Engine Checkup", value: "Engine Checkup" },
  { label: "Engine Oil Top-Up", value: "Engine Oil Top-Up" },
  { label: "Engine Tuning", value: "Engine Tuning" },
  { label: "Spark Plug Replacement", value: "Spark Plug Replacement" },
  { label: "Air Filter Cleaning", value: "Air Filter Cleaning" },
  { label: "Air Filter Replacement", value: "Air Filter Replacement" },

  // 🛢️ Oil & Fluids
  { label: "Oil Change", value: "Oil Change" },
  { label: "Brake Oil Replacement", value: "Brake Oil Replacement" },
  { label: "Coolant Top-Up", value: "Coolant Top-Up" },
  { label: "Coolant Replacement", value: "Coolant Replacement" },

  // 🛑 Brake & Safety
  { label: "Brake Service", value: "Brake Service" },
  { label: "Brake Pad Replacement", value: "Brake Pad Replacement" },
  { label: "Brake Shoe Replacement", value: "Brake Shoe Replacement" },
  { label: "Disc Plate Cleaning", value: "Disc Plate Cleaning" },

  // ⛓️ Chain & Transmission
  { label: "Chain Cleaning", value: "Chain Cleaning" },
  { label: "Chain Lubrication", value: "Chain Lubrication" },
  { label: "Chain Sprocket Service", value: "Chain Sprocket Service" },
  { label: "Clutch Cable Adjustment", value: "Clutch Cable Adjustment" },
  { label: "Clutch Plate Replacement", value: "Clutch Plate Replacement" },

  // 🔋 Electrical & Battery
  { label: "Battery Check", value: "Battery Check" },
  { label: "Battery Charging", value: "Battery Charging" },
  { label: "Battery Replacement", value: "Battery Replacement" },
  { label: "Wiring Check", value: "Wiring Check" },
  { label: "Self Start Repair", value: "Self Start Repair" },

  // 🛞 Tyres & Wheels
  { label: "Tyre Pressure Check", value: "Tyre Pressure Check" },
  { label: "Wheel Alignment", value: "Wheel Alignment" },
  { label: "Wheel Balancing", value: "Wheel Balancing" },
  { label: "Tyre Puncture Repair", value: "Tyre Puncture Repair" },
  { label: "Tyre Replacement", value: "Tyre Replacement" },

  // 🧼 Cleaning & Care
  { label: "Bike Washing", value: "Bike Washing" },
  { label: "Foam Wash", value: "Foam Wash" },
  { label: "Polish & Wax", value: "Polish & Wax" },
  { label: "Full Bike Inspection", value: "Full Bike Inspection" },

  // 🔩 Suspension & Comfort
  { label: "Front Suspension Service", value: "Front Suspension Service" },
  { label: "Rear Suspension Service", value: "Rear Suspension Service" },
  { label: "Fork Oil Replacement", value: "Fork Oil Replacement" },

  // 🔍 Inspection & Diagnostics
  { label: "Electrical Inspection", value: "Electrical Inspection" },
  { label: "Engine Diagnostic Scan", value: "Engine Diagnostic Scan" },
  { label: "Noise Inspection", value: "Noise Inspection" }
];


const CreateAddService = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [image, setImage] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");

  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState({});
  const [variants, setVariants] = useState({});

  const [selectedBikes, setSelectedBikes] = useState([]);

  /* ================= FETCH INITIAL DATA ================= */

  useEffect(() => {
    fetchDealers();
    fetchCompanies();
  }, []);

  const fetchDealers = async () => {
    const res = await getDealerList();
    setDealers(res?.data || []);
  };

  const fetchCompanies = async () => {
    const res = await getBikeCompanies();
    if (res.status === 200) setCompanies(res.data);
  };

  /* ================= HANDLERS ================= */

  const handleCompanyCheck = async (company) => {
    const exists = selectedBikes.find(b => b.company_id === company._id);

    if (exists) {
      setSelectedBikes(selectedBikes.filter(b => b.company_id !== company._id));
      return;
    }

    // Load models for company
    const res = await getBikeModels(company._id);
    if (res.status === 200) {
      setModels(prev => ({ ...prev, [company._id]: res.data }));
    }

    setSelectedBikes([
      ...selectedBikes,
      {
        company_id: company._id,
        company_name: company.name,
        model_id: "",
        model_name: "",
        variant_id: "",
        engine_cc: "",
        variant_name: "",
        price: ""
      }
    ]);
  };

  const handleModelChange = async (index, companyId, modelId) => {
    const model = models[companyId].find(m => m._id === modelId);

    const res = await getBikeVariants(modelId);
    if (res.status === 200) {
      setVariants(prev => ({ ...prev, [modelId]: res.data }));
    }

    const updated = [...selectedBikes];
    updated[index].model_id = modelId;
    updated[index].model_name = model.model_name;
    updated[index].variant_id = "";
    updated[index].variant_name = "";
    setSelectedBikes(updated);
  };

  const handleVariantChange = (index, modelId, variantId) => {
    const variant = variants[modelId].find(v => v._id === variantId);

    const updated = [...selectedBikes];
    updated[index].variant_id = variantId;
    updated[index].variant_name = variant.variant_name;
    updated[index].engine_cc = variant.engine_cc;
    setSelectedBikes(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBikes.length) {
      return Swal.fire("Error", "Please select at least one bike", "error");
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("dealer_id", selectedDealer);
    form.append("bikes", JSON.stringify(selectedBikes));
    if (image) form.append("images", image);

    try {
      const res = await axios.post(
        "https://api.mrbikedoctor.cloud/bikedoctor/service/create-additional-service",
        form
      );

      Swal.fire("Success", "Service created successfully", "success");
      if (res.status === 201) navigate("/additionalservices");
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  /* ================= UI ================= */



  return (
    <div className="page-wrapper mt-5">
      <div className="content container-fluid">
        <h5>Create Additional Service</h5>

        <form onSubmit={handleSubmit} className="card p-3">
          {/* IMAGE */}
          <div className="mb-3">
            <label>Service Image</label>

            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                }
              }}
            />

            {/* IMAGE PREVIEW */}
            {image && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Service Preview"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>
            )}
          </div>

          {/* SERVICE NAME */}
          <div className="mb-3">
            <label>Service Name</label>

            <CreatableSelect
              options={serviceNameOptions}
              placeholder="Select or type service name"
              value={
                formData.name
                  ? { label: formData.name, value: formData.name }
                  : null
              }
              onChange={(selected) => {
                setFormData({
                  ...formData,
                  name: selected?.value || ""
                });
              }}
              onCreateOption={(inputValue) => {
                setFormData({
                  ...formData,
                  name: inputValue
                });
              }}
              isClearable
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              required
              rows={5} 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* DEALER */}
          <div className="mb-3">
            <label>Select Dealer</label>
            <select
              className="form-control"
              required
              value={selectedDealer}
              onChange={(e) => setSelectedDealer(e.target.value)}
            >
              <option value="">Select Dealer</option>
              {dealers.map(d => (
                <option key={d._id} value={d._id}>{d.shopName}</option>
              ))}
            </select>
          </div>

          {/* COMPANY CHECKBOX */}
          <div className="mb-3">
            <label className="mb-2 fw-semibold">Select Bike Companies</label>

            <div className="row">
              {companies.map((c) => {
                const isChecked = selectedBikes.some(
                  (b) => b.company_id === c._id
                );

                return (
                  <div key={c._id} className="col-6 col-md-4 col-lg-3 mb-3">
                    <label
                      htmlFor={`company-${c._id}`}
                      className={`company-box ${isChecked ? "active" : ""}`}
                    >
                      <input
                        type="checkbox"
                        id={`company-${c._id}`}
                        checked={isChecked}
                        onChange={() => handleCompanyCheck(c)}
                      />
                      <span className="company-name">{c.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>


          <label className="mb-2 fw-semibold mb-2">Selected Bike Companies</label>
          {/* SELECTED BIKE DETAILS */}
          {selectedBikes.map((item, index) => (
            <div key={item.company_id} className="border p-3 mb-3 rounded">
              <h6 className="mb-3">{item.company_name}</h6>

              <div className="row align-items-end">
                {/* MODEL */}
                <div className="col-md-3 mb-2">
                  <label className="form-label">Model</label>
                  <select
                    className="form-control"
                    required
                    value={item.model_id}
                    onChange={(e) =>
                      handleModelChange(index, item.company_id, e.target.value)
                    }
                  >
                    <option value="">Select Model</option>
                    {models[item.company_id]?.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.model_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* VARIANT */}
                <div className="col-md-3 mb-2">
                  <label className="form-label">Variant</label>
                  <select
                    className="form-control"
                    required
                    disabled={!item.model_id}
                    value={item.variant_id}
                    onChange={(e) =>
                      handleVariantChange(index, item.model_id, e.target.value)
                    }
                  >
                    <option value="">Select Variant</option>
                    {variants[item.model_id]?.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.variant_name} ({v.engine_cc} CC)
                      </option>
                    ))}
                  </select>
                </div>

                {/* ENGINE CC */}
                <div className="col-md-2 mb-2">
                  <label className="form-label">Engine CC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.engine_cc || "-"}
                    disabled
                  />
                </div>

                {/* PRICE */}
                <div className="col-md-2 mb-2">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    required
                    value={item.price}
                    onChange={(e) => {
                      const updated = [...selectedBikes];
                      updated[index].price = e.target.value;
                      setSelectedBikes(updated);
                    }}
                  />
                </div>

                {/* REMOVE */}
                <div className="col-md-2 mb-2 d-flex">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => {
                      setSelectedBikes(
                        selectedBikes.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {selectedBikes.length == 0 &&

            <label className="mb-2 fw-semibold mb-2">No Selected Bike Companies</label>
          }




          <button className="btn btn-primary mt-3">Save Additional Service</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAddService;
