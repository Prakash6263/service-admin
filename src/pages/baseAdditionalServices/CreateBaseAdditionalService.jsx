'use client';

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const CreateBaseAdditionalService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `https://api.mrbikedoctor.cloud/bikedoctor/additional-service/create-base-additional-service`,
        {
          name: formData.name,
          description: formData.description,
        }
      );
      console.log("Response:", response);
      Swal.fire({
        title: "Success!",
        text: response.data.message || "Base service added successfully.",
        icon: "success",
      });
      if (response?.status === 201) {
        navigate("/base-additional-services");
      }
      setFormData({ name: "", description: "" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Create Base Additional Service</h5>
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
                  {/* Service Name */}
                  <div className="input-block mb-3">
                    <label className="form-control-label">Service Name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter service name"
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
                      placeholder="Enter service description"
                      rows="4"
                      required
                    ></textarea>
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

export default CreateBaseAdditionalService;
