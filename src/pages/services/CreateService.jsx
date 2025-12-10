import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceForm from "../../components/Service/ServiceForm";

const CreateService = () => {
      const navigate = useNavigate();
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
        <ServiceForm />
      </div>
    </div>
  );
};

export default CreateService;
