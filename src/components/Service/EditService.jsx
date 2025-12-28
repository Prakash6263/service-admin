"use client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAdminServiceById, updateAdminService, getBikeCompanies } from "../../api"

const EditService = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    name: "",
  })

  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState("")
  const [bikes, setBikes] = useState([{ cc: "", price: "" }])
  const [companies, setCompanies] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getDealerService = async (id) => {
    try {
      const res = await getAdminServiceById(id)
      console.log("[v0] API Response:", res)

      if (res.status === true) {
        const serviceData = res.data

        setFormData({
          name: serviceData.name,
        })

        setExistingImage(serviceData.image)
        setBikes(serviceData.bikes || [{ cc: "", price: "" }])
        setSelectedCompanies(serviceData.companies?.map((c) => c._id) || [])
      }
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching service:", error)
      navigate("/services")
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const companiesRes = await getBikeCompanies()
        setCompanies(companiesRes?.data || [])
        await getDealerService(id)
      } catch (err) {
        console.error("[v0] Init failed:", err)
      }
    }
    init()
  }, [id])

  const validate = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Service name is required"
    if (selectedCompanies.length === 0) errors.companies = "Select at least one company"

    bikes.forEach((bike, index) => {
      if (!bike.cc) errors[`bike_cc_${index}`] = "CC required"
      if (!bike.price) errors[`bike_price_${index}`] = "Price required"
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCompanyToggle = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("companies", JSON.stringify(selectedCompanies))
      fd.append("bikes", JSON.stringify(bikes.map((b) => ({ cc: Number(b.cc), price: Number(b.price) }))))

      if (image) {
        fd.append("image", image)
      }

      const response = await updateAdminService(id, fd)

      if (response.status === true) {
        navigate("/services")
      }
    } catch (error) {
      console.error("[v0] Error updating service:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleBikeChange = (index, e) => {
    const { name, value } = e.target
    const updatedBikes = [...bikes]
    updatedBikes[index][name] = value
    setBikes(updatedBikes)
  }

  const addBikeField = () => {
    setBikes([...bikes, { cc: "", price: "" }])
  }

  const removeBikeField = (index) => {
    if (bikes.length > 1) {
      setBikes(bikes.filter((_, i) => i !== index))
    }
  }

  if (isLoading)
    return (
      <div className="page-wrapper">
        <div className="content text-center">Loading...</div>
      </div>
    )

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
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="form-control-label">Service Name</label>
                        <input
                          className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                      </div>

                      <div className="input-block mb-3">
                        <label className="form-control-label">Bike CC & Price</label>
                        {bikes.map((bike, index) => (
                          <div key={index} className="d-flex mb-2">
                            <input
                              className={`form-control me-2 ${formErrors[`bike_cc_${index}`] ? "is-invalid" : ""}`}
                              type="number"
                              name="cc"
                              placeholder="Bike CC"
                              value={bike.cc}
                              onChange={(e) => handleBikeChange(index, e)}
                            />
                            <input
                              className={`form-control me-2 ${formErrors[`bike_price_${index}`] ? "is-invalid" : ""}`}
                              type="number"
                              name="price"
                              placeholder="Price"
                              value={bike.price}
                              onChange={(e) => handleBikeChange(index, e)}
                            />
                            {bikes.length > 1 && (
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

                      <div className="input-block mb-3">
                        <label className="form-control-label">Update Service Image</label>
                        {existingImage && (
                          <div className="mb-2">
                            <p>Current Image:</p>
                            <img
                              src={`${process.env.REACT_APP_IMAGE_BASE_URL}${existingImage}`}
                              // src={`http://localhost:8001/uploads/admin-services/${existingImage}`}
                              alt="Current service"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "5px",
                              }}
                            />
                          </div>
                        )}
                        <input type="file" className="form-control" onChange={handleFileChange} />
                        <small className="text-muted">Upload new image to replace current one</small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h5 className="mb-3">Select Companies</h5>
                      <div className="input-block mb-3">
                        <div
                          className="company-selection-list border rounded p-3"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          {companies.map((company) => (
                            <div key={company._id} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`company-${company._id}`}
                                checked={selectedCompanies.includes(company._id)}
                                onChange={() => handleCompanyToggle(company._id)}
                              />
                              <label className="form-check-label" htmlFor={`company-${company._id}`}>
                                {company.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formErrors.companies && <div className="text-danger mt-1 small">{formErrors.companies}</div>}
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Service"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditService
