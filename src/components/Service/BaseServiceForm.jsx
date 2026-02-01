"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createBaseService, getBaseServiceById, updateBaseService } from "../../api"
import { useNavigate, useParams } from "react-router-dom"

const BaseServiceForm = ({ isEdit = false }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: "",
  })
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      const fetchService = async () => {
        try {
          setIsLoading(true)
          const response = await getBaseServiceById(id)
          if (response && response.data) {
            const service = response.data
            setFormData({ name: service.name || "" })
            setExistingImage(service.image || null)
          }
        } catch (error) {
          console.error("Error fetching service:", error)
          Swal.fire("Error", "Failed to load service details", "error")
        } finally {
          setIsLoading(false)
        }
      }
      fetchService()
    }
  }, [isEdit, id])

  const validate = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Service name is required"
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!isEdit && !image) {
      errors.image = "Service image is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})

    const isValid = validate()
    if (!isValid) return

    setIsSubmitting(true)

    try {
      const form = new FormData()
      form.append("name", formData.name)
      if (image) form.append("image", image)

      let response
      if (isEdit) {
        response = await updateBaseService(id, form)
      } else {
        response = await createBaseService(form)
      }

      if (response?.status === true || response?.status === 200) {
        navigate("/base-services")
      }
    } catch (error) {
      const err = error.response?.data
      if (err?.field) {
        setFormErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>{isEdit ? "Edit" : "Create"} Base Service</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="input-block mb-3">
                        <label className="form-control-label">Service Name *</label>
                        <input
                          className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                          name="name"
                          type="text"
                          placeholder="e.g. General Service"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                      </div>

                      <div className="input-block mb-3">
                        <label className="form-control-label">Service Image {!isEdit && "*"}</label>
                        <input
                          type="file"
                          name="image"
                          className={`form-control ${formErrors.image ? "is-invalid" : ""}`}
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {formErrors.image && <div className="invalid-feedback">{formErrors.image}</div>}
                        {isEdit && existingImage && (
                          <div className="mt-2 alert alert-info small">
                            Current image is set. Upload a new one to replace it.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      {image && (
                        <div className="mt-3">
                          <label className="form-control-label">Preview</label>
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-end mt-3">
                    <button
                      className="btn btn-secondary me-2 px-4"
                      type="button"
                      onClick={() => navigate("/base-services")}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary px-5" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : isEdit ? "Update Service" : "Create Service"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaseServiceForm
