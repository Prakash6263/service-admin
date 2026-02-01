'use client';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createAdditionalService, getBaseAdditionalServices } from "../../api/additionalServiceApi";
import { getDealerList } from "../../api";

const CreateAddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
  });

  const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
  const [dealers, setDealers] = useState([]);
  const [baseServices, setBaseServices] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [selectedBaseService, setSelectedBaseService] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealerResponse = await getDealerList();
        setDealers(dealerResponse?.data || []);

        const baseServiceResponse = await getBaseAdditionalServices();
        setBaseServices(baseServiceResponse?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDealers([]);
        setBaseServices([]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBikeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBikes = [...bikes];
    updatedBikes[index][name] = value;
    setBikes(updatedBikes);
  };

  const addBikeField = () => {
    setBikes([...bikes, { cc: "", price: "" }]);
  };

  const removeBikeField = (index) => {
    setBikes(bikes.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!selectedBaseService) {
      Swal.fire("Validation", "Please select a base additional service", "warning");
      return false;
    }
    if (!selectedDealer) {
      Swal.fire("Validation", "Please select a dealer", "warning");
      return false;
    }
    if (!formData.description.trim()) {
      Swal.fire("Validation", "Description is required", "warning");
      return false;
    }
    // Validate bikes
    for (let i = 0; i < bikes.length; i++) {
      const cc = Number(bikes[i].cc);
      const price = Number(bikes[i].price);
      if (!Number.isFinite(cc) || cc <= 0) {
        Swal.fire("Validation", `Bike #${i + 1}: CC must be a number > 0`, "warning");
        return false;
      }
      if (!Number.isFinite(price) || price <= 0) {
        Swal.fire("Validation", `Bike #${i + 1}: Price must be a number > 0`, "warning");
        return false;
      }
    }
    if (bikes.length === 0) {
      Swal.fire("Validation", "At least one bike CC & Price is required", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        base_additional_service_id: selectedBaseService,
        dealer_id: selectedDealer,
        description: formData.description,
        bikes,
      };

      await createAdditionalService(payload);
      setFormData({ description: "" });
      setBikes([{ cc: "", price: "" }]);
      setSelectedDealer("");
      setSelectedBaseService("");
      navigate("/additionalservices");
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Create Additional Service</h5>
            <button
              className="btn"
              style={{ backgroundColor: "black", color: "white" }}
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  {/* Base Additional Service Dropdown */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Base Additional Service</label>
                    <select
                      className="form-control"
                      value={selectedBaseService}
                      onChange={(e) => setSelectedBaseService(e.target.value)}
                      required
                    >
                      <option value="">Select a Base Service</option>
                      {baseServices.length > 0 ? (
                        baseServices.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No base services available</option>
                      )}
                    </select>
                  </div>

                  {/* Dealer Dropdown */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Select Dealer</label>
                    <select
                      className="form-control"
                      value={selectedDealer}
                      onChange={(e) => setSelectedDealer(e.target.value)}
                      required
                    >
                      <option value="">Select a Dealer</option>
                      {dealers.length > 0 ? (
                        dealers.map((dealer) => (
                          <option key={dealer._id} value={dealer._id}>
                            {dealer.shopName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No dealers available</option>
                      )}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Bike CC & Price Fields */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Bike CC & Price</label>
                    {bikes.map((bike, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          className="form-control me-2"
                          type="number"
                          name="cc"
                          placeholder="Bike CC"
                          value={bike.cc}
                          onChange={(e) => handleBikeChange(index, e)}
                          required
                        />
                        <input
                          className="form-control me-2"
                          type="number"
                          name="price"
                          placeholder="Price"
                          value={bike.price}
                          onChange={(e) => handleBikeChange(index, e)}
                          required
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeBikeField(index)}
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-success mt-2"
                      onClick={addBikeField}
                    >
                      Add More
                    </button>
                  </div>

                  <div className="form-group col-lg-12 mb-3">
                    <button
                      className="btn btn-primary mt-4 mb-5"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAddService;
