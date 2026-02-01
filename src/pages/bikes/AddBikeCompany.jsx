import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { addBikeCompany, addBikeModel, addBikeVariant, getBikeCompanies, getBikeModels } from "../../api"
import { useNavigate } from "react-router-dom"

const AddBike = () => {
  const [companyName, setCompanyName] = useState("")
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [modelName, setModelName] = useState("")
  const [selectedModelId, setSelectedModelId] = useState("")
  const [variantName, setVariantName] = useState("")
  const [engineCC, setEngineCC] = useState("")
  const [companies, setCompanies] = useState([])
  const [models, setModels] = useState([])
  const [variants, setVariants] = useState([])
  const navigate = useNavigate()

  // Fetch companies on component load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getBikeCompanies()
        if (response.status === 200) {
          setCompanies(response.data)
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch companies", "error")
      }
    }
    fetchCompanies()
  }, [])

  // Fetch models when selectedCompanyId changes
  useEffect(() => {
    if (!selectedCompanyId) {
      setModels([])
      setSelectedModelId("")
      return
    }
    const fetchModels = async () => {
      try {
        const response = await getBikeModels(selectedCompanyId)
        if (response.status === 200) {
          setModels(response.data)
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch models", "error")
      }
    }
    fetchModels()
  }, [selectedCompanyId])

  const handleSubmitCompany = async () => {
    if (!companyName) return Swal.fire("Error", "Company name required!", "error")
    try {
      const response = await addBikeCompany({ name: companyName })
      if (response.message === "Bike company added successfully") {
        setCompanies([...companies, response.data])
        Swal.fire("Success", "Company added!", "success")
        setCompanyName("")
      } else if (response.message === "Bike company already exists!") {
        Swal.fire("Error", "Bike company already exists!", "error")
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add company", "error")
    }
  }

  const handleSubmitModel = async () => {
    if (!modelName || !selectedCompanyId) return Swal.fire("Error", "Model name & Company required!", "error")
    try {
      const response = await addBikeModel({ company_id: selectedCompanyId, model_name: modelName })
      if (response.message === "Bike model added successfully") {
        setModels([...models, response.data])
        Swal.fire("Success", "Bike model added successfully", "success")
        setModelName("")
      } else if (response.message === "Bike model already exists!") {
        Swal.fire("Error", "Bike model already exists!", "error")
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add model", "error")
    }
  }

  const handleSubmitVariant = async () => {
    if (!variantName || !engineCC || !selectedModelId) return Swal.fire("Error", "All fields required!", "error")
    try {
      const response = await addBikeVariant({
        model_id: selectedModelId,
        variant_name: variantName,
        engine_cc: engineCC,
      })
      if (response.status === 200) {
        Swal.fire("Success", "Variant added!", "success")
        setVariantName("")
        setEngineCC("")
        // navigate("/bikes")
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add variant", "error")
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>🚀 Add Bike Details</h5>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            {/* Mockup labels row */}
            <div className="row mb-4 border-bottom pb-2">
              <div className="col-md-4">
                <h6 className="fw-bold text-decoration-underline">Company</h6>
              </div>
              <div className="col-md-4">
                <h6 className="fw-bold text-decoration-underline">bike</h6>
              </div>
              <div className="col-md-4">
                <h6 className="fw-bold text-decoration-underline">variant</h6>
              </div>
            </div>

            <div className="row">
              {/* Column 1: Add Company */}
              <div className="col-md-4 border-end">
                <h6 className="mb-3 fw-bold">Add company</h6>
                <div className="mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {companies.map((company) => (
                    <div key={company._id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio" // Use radio for single selection to drive cascading models
                        name="companySelect"
                        id={`company-${company._id}`}
                        checked={selectedCompanyId === company._id}
                        onChange={() => setSelectedCompanyId(company._id)}
                      />
                      <label className="form-check-label" htmlFor={`company-${company._id}`}>
                        {company.name}
                      </label>
                    </div>
                  ))}
                  {companies.length === 0 && <p className="text-muted small">No companies found.</p>}
                </div>
                <div className="mt-auto">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSubmitCompany}>
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2: Model */}
              <div className="col-md-4 border-end">
                <h6 className="mb-3 fw-bold">model</h6>
                <div className="mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {!selectedCompanyId ? (
                    <p className="text-muted small text-center mt-4 italic">Select a company first</p>
                  ) : (
                    <>
                      {models.map((model) => (
                        <div key={model._id} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="modelSelect"
                            id={`model-${model._id}`}
                            checked={selectedModelId === model._id}
                            onChange={() => setSelectedModelId(model._id)}
                          />
                          <label className="form-check-label" htmlFor={`model-${model._id}`}>
                            {model.model_name}
                          </label>
                        </div>
                      ))}
                      {models.length === 0 && <p className="text-muted small">No models found for this company.</p>}
                    </>
                  )}
                </div>
                <div className="mt-auto">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Model name"
                      disabled={!selectedCompanyId}
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSubmitModel} disabled={!selectedCompanyId}>
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Add Variant and CC */}
              <div className="col-md-4">
                <h6 className="mb-3 fw-bold">add variant and cc</h6>
                <div className="mb-4">
                  {!selectedModelId ? (
                    <p className="text-muted small text-center mt-4 italic">Select a model first</p>
                  ) : (
                    <div className="p-3 bg-light rounded">
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Variant Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. ns"
                          value={variantName}
                          onChange={(e) => setVariantName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Engine CC</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="e.g. 160"
                          value={engineCC}
                          onChange={(e) => setEngineCC(e.target.value)}
                        />
                      </div>
                      <button className="btn btn-primary w-100 btn-sm" onClick={handleSubmitVariant}>
                        Add Variant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBike
