import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addService, getDealerList } from "../../api";
import { useNavigate } from "react-router-dom";

const ServiceForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!selectedDealer) {
      errors.dealer_id = "Please select a dealer";
    }

    bikes.forEach((bike, index) => {
      if (!bike.cc) {
        errors[`bike_cc_${index}`] = "Bike CC is required";
      } else if (parseInt(bike.cc) <= 0) {
        errors[`bike_cc_${index}`] = "CC must be greater than 0";
      }

      if (!bike.price) {
        errors[`bike_price_${index}`] = "Price is required";
      } else if (parseInt(bike.price) <= 0) {
        errors[`bike_price_${index}`] = "Price must be greater than 0";
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
    form.append("bikes", JSON.stringify(bikes));

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
        setBikes([{ cc: "", price: "" }]);
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

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-3">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              {/* Service Name */}
              <div className="input-block mb-3">
                <label className="form-control-label">Service Name</label>
                <input
                  className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {formErrors.name && (
                  <div className="invalid-feedback">{formErrors.name}</div>
                )}
              </div>

              {/* Description */}
              <div className="input-block mb-3">
                <label className="form-control-label">Description</label>
                <textarea
                  className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
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
                <label className="form-control-label">Bike CC & Price</label>
                {bikes.map((bike, index) => (
                  <div key={index} className="d-flex mb-2">
                    <input
                      className={`form-control me-2 ${formErrors[`bike_cc_${index}`] ? "is-invalid" : ""
                        }`}
                      type="number"
                      name="cc"
                      placeholder="Bike CC"
                      value={bike.cc}
                      onChange={(e) => handleBikeChange(index, e)}
                    />
                    <input
                      className={`form-control me-2 ${formErrors[`bike_price_${index}`] ? "is-invalid" : ""
                        }`}
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={bike.price}
                      onChange={(e) => handleBikeChange(index, e)}
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
                {bikes.map((_, index) => (
                  <React.Fragment key={index}>
                    {formErrors[`bike_cc_${index}`] && (
                      <div className="text-danger">{formErrors[`bike_cc_${index}`]}</div>
                    )}
                    {formErrors[`bike_price_${index}`] && (
                      <div className="text-danger">{formErrors[`bike_price_${index}`]}</div>
                    )}
                  </React.Fragment>
                ))}
                <button type="button" className="btn btn-success mt-2" onClick={addBikeField}>
                  Add More
                </button>
              </div>

              {/* Upload Image */}
              <div className="input-block mb-3">
                <label className="form-control-label">Upload Service Image</label>
                <input
                  type="file"
                  name="image"
                  className={`form-control ${formErrors.image ? "is-invalid" : ""}`}
                  onChange={handleFileChange}
                />
                {formErrors.image && (
                  <div className="invalid-feedback">{formErrors.image}</div>
                )}
              </div>

              {/* Submit Button */}
              <button className="btn btn-primary mt-4 mb-5" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
