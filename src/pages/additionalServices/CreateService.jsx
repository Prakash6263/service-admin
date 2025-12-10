import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AaddService, getDealerList } from "../../api";
import axios from "axios";

const CreateAddService = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await getDealerList();
        setDealers(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch dealers", error);
        setDealers([]);
      }
    };
    fetchDealers();
  }, []);

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
    const form = new FormData();

    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("dealer_id", selectedDealer);
    if (image) form.append("images", image);

    form.append("bikes", JSON.stringify(bikes));

    try {
      const response = await axios.post(`https://api.mrbikedoctor.cloud/bikedoctor/service/create-additional-service`, form);
      console.log("Response:", response);
      Swal.fire({
        title: "Success!",
        text: response.message || "Service added successfully.",
        icon: "success",
      });
      if (response?.status === 201) {
        navigate("/additionalservices")
      }
      setFormData({ name: "", description: "" });
      setImage(null);
      setBikes([{ cc: "", price: "" }]);
      setSelectedDealer("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  };

  console.log("Dealers:", dealers);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Create Service</h5>
            <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  {/* Service Name */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Service Name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
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
                          <button type="button" className="btn btn-danger" onClick={() => removeBikeField(index)}>
                            X
                          </button>
                        )}
                      </div>
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
                      className="form-control"
                      name="image"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="form-group col-lg-12 mb-3">
                    <button className="btn btn-primary mt-4 mb-5" type="submit">
                      Create
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
