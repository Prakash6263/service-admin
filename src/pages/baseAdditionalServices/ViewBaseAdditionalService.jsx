'use client';

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const ViewBaseAdditionalService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Use location state first if available, otherwise fetch from API
        if (location.state?.serviceData) {
          setServiceData(location.state.serviceData);
        } else {
          const response = await axios.get(
            `https://api.mrbikedoctor.cloud/bikedoctor/additional-service/getBaseAdditionalService/${id}`
          );
          if (response.status === 200 && response.data.data) {
            setServiceData(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, location.state]);

  if (loading) {
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

  if (!serviceData) {
    return (
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="alert alert-warning">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>View Base Additional Service</h5>
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
                {/* Service ID */}
                <div className="info-block mb-3">
                  <label className="form-control-label font-weight-bold">
                    Service ID:
                  </label>
                  <p className="text-muted">{serviceData._id}</p>
                </div>

                {/* Service Name */}
                <div className="info-block mb-3">
                  <label className="form-control-label font-weight-bold">
                    Service Name:
                  </label>
                  <p className="text-muted">{serviceData.name}</p>
                </div>

                {/* Description */}
                <div className="info-block mb-3">
                  <label className="form-control-label font-weight-bold">
                    Description:
                  </label>
                  <p className="text-muted">{serviceData.description}</p>
                </div>

                {/* Created At */}
                <div className="info-block mb-3">
                  <label className="form-control-label font-weight-bold">
                    Created At:
                  </label>
                  <p className="text-muted">
                    {new Date(serviceData.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                {/* Updated At */}
                <div className="info-block mb-3">
                  <label className="form-control-label font-weight-bold">
                    Updated At:
                  </label>
                  <p className="text-muted">
                    {new Date(serviceData.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <div className="form-group col-lg-12 mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      navigate(`/base-additional-services/edit/${serviceData._id}`, {
                        state: { serviceData },
                      })
                    }
                  >
                    <i className="far fa-edit me-2"></i> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBaseAdditionalService;
