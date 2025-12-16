import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getBikeCompanies,
  getBikeModels,
  getBikeVariants,
  addService,
  getDealerList
} from "../../api";
import CreatableSelect from "react-select/creatable";
const serviceNameOptions = [
  { label: "General Service", value: "General Service" },
  { label: "Oil Change", value: "Oil Change" },
  { label: "Engine Checkup", value: "Engine Checkup" },
  { label: "Brake Service", value: "Brake Service" },
  { label: "Chain Sprocket Service", value: "Chain Sprocket Service" }
];

const ServiceForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [selectedBikes, setSelectedBikes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState({});
  const [variants, setVariants] = useState({});

  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {

    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await getBikeCompanies();
    if (res.status === 200) setCompanies(res.data);
  };

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await getDealerList();
        console.log("Response Dealers", response.data)
        setDealers(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch dealers", error);
        setDealers([]);
      }
    };
    fetchDealers();
  }, []);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Service name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!selectedDealer) {
      errors.dealer_id = "Please select a dealer";
    }

    if (selectedBikes.length === 0) {
      errors.bikes = "Please select at least one bike";
    }

    selectedBikes.forEach((bike, index) => {
      if (!bike.model_id) {
        errors[`model_${index}`] = "Model required";
      }
      if (!bike.variant_id) {
        errors[`variant_${index}`] = "Variant required";
      }
      if (!bike.price || bike.price <= 0) {
        errors[`price_${index}`] = "Valid price required";
      }
    });

    if (!image) {
      errors.image = "Service image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const isValid = validate();
    if (!isValid) return;

    setIsSubmitting(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("dealer_id", selectedDealer);
    if (image) form.append("images", image);
    form.append("bikes", JSON.stringify(selectedBikes));


    try {
      const response = await addService(form);
      if (response?.status === 200) {
        Swal.fire({
          title: "Success!",
          text: response.message || "Service added successfully.",
          icon: "success",
        });
        navigate("/services");
        setFormData({ name: "", description: "" });
        setImage(null);

        setSelectedDealer("");
      }
    } catch (error) {
      const err = error.response?.data;
      Swal.fire({
        title: "Error!",
        text: err?.message || "Something went wrong!",
        icon: "error",
      });

      if (err?.field) {
        setFormErrors((prev) => ({ ...prev, [err.field]: err.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCompanyCheck = async (company) => {
    const exists = selectedBikes.find(b => b.company_id === company._id);

    if (exists) {
      setSelectedBikes(selectedBikes.filter(b => b.company_id !== company._id));
      return;
    }

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
        variant_name: "",
        engine_cc: "",
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
    updated[index].engine_cc = "";
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

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-3">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={handleSubmit}>

              {/* Upload Image */}
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
              {/* Service Name */}
             
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

              {/* Description */}
              <div className="input-block mb-3">
                <label className="form-control-label">Description</label>
                <textarea
                  className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                rows={5} 
                  onChange={handleChange}
                >

                </textarea>
                {formErrors.description && (
                  <div className="invalid-feedback">{formErrors.description}</div>
                )}
              </div>

              {/* Dealer Dropdown */}
              <div className="input-block mb-3">
                <label className="form-control-label">Select Dealer</label>
                <select
                  className={`form-control ${formErrors.dealer_id ? "is-invalid" : ""}`}
                  value={selectedDealer}
                  onChange={(e) => setSelectedDealer(e.target.value)}
                >
                  <option value="">Select a Dealer</option>
                  {dealers.map((dealer) => (
                    <option key={dealer._id} value={dealer._id}>
                      {dealer.shopName}
                    </option>
                  ))}
                </select>
                {formErrors.dealer_id && (
                  <div className="invalid-feedback">{formErrors.dealer_id}</div>
                )}
              </div>


              {/* Bike CC & Price Fields */}
              <div className="input-block mb-3">
                <label className="mb-2 fw-semibold">Select Bike Companies</label>
                <div className="row">
                  {companies.map(c => {
                    const checked = selectedBikes.some(b => b.company_id === c._id);
                    return (
                      <div key={c._id} className="col-6 col-md-4 col-lg-3 mb-3">
                        <label className={`company-box ${checked ? "active" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCompanyCheck(c)}
                          />
                          <span className="company-name">{c.name}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="input-block mb-3">


                <h4 className="mb-2  mb-2">Selected Bike Companies</h4>
                {selectedBikes.length == 0 &&

                  <label className="mb-2 fw-semibold mb-2">No Selected Bike Companies</label>
                }
                {selectedBikes.map((item, index) => (
                  <div key={item.company_id} className="border p-3 mb-3 rounded">
                    <h6>{item.company_name}</h6>

                    <div className="row align-items-end">
                      <div className="col-md-3">
                        <label>Model</label>
                        <select
                          className="form-control"
                          value={item.model_id}
                          onChange={(e) =>
                            handleModelChange(index, item.company_id, e.target.value)
                          }
                        >
                          <option value="">Select Model</option>
                          {models[item.company_id]?.map(m => (
                            <option key={m._id} value={m._id}>{m.model_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label>Variant</label>
                        <select
                          className="form-control"
                          disabled={!item.model_id}
                          value={item.variant_id}
                          onChange={(e) =>
                            handleVariantChange(index, item.model_id, e.target.value)
                          }
                        >
                          <option value="">Select Variant</option>
                          {variants[item.model_id]?.map(v => (
                            <option key={v._id} value={v._id}>
                              {v.variant_name} ({v.engine_cc} CC)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-2">
                        <label>CC</label>
                        <input className="form-control" value={item.engine_cc || "-"} disabled />
                      </div>

                      <div className="col-md-2">
                        <label>Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.price}
                          onChange={(e) => {
                            const updated = [...selectedBikes];
                            updated[index].price = e.target.value;
                            setSelectedBikes(updated);
                          }}
                        />
                      </div>

                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() =>
                            setSelectedBikes(selectedBikes.filter((_, i) => i !== index))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              {/* Submit Button */}
              <button className="btn btn-primary mt-4 mb-5" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Save Service"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
