'use client';

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditBaseAdditionalService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Use location state first if available, otherwise fetch from API
        if (location.state?.serviceData) {
          const data = location.state.serviceData;
          setFormData({
            name: data.name || "",
            description: data.description || "",
          });
          setFetching(false);
        } else {
          const response = await axios.get(
            `https://api.mrbikedoctor.cloud/bikedoctor/additional-service/getBaseAdditionalService/${id}`
          );
          if (response.status === 200 && response.data.data) {
            const data = response.data.data;
            setFormData({
              name: data.name || "",
              description: data.description || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load service details",
          icon: "error",
        });
        navigate("/base-additional-services");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://api.mrbikedoctor.cloud/bikedoctor/additional-service/updateBaseAdditionalService/${id}`,
        {
          name: formData.name,
          description: formData.description,
        }
      );
      console.log("Response:", response);
      Swal.fire({
        title: "Success!",
        text: response.data.message || "Base service updated successfully.",
        icon: "success",
      });
      if (response?.status === 200) {
        navigate("/base-additional-services");
      }
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

  if (fetching) {
    return (
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Edit Base Additional Service</h5>
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
                      {loading ? "Updating..." : "Update"}
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

export default EditBaseAdditionalService;
