"use client"
import { useNavigate, useParams } from "react-router-dom"
import ServiceForm from "./ServiceForm"

const EditService = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Edit Service</h5>
            <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </div>
        <ServiceForm serviceId={id} />
      </div>
    </div>
  )
}

export default EditService
