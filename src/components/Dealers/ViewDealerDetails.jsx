import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import "bootstrap/dist/css/bootstrap.min.css"
import Swal from "sweetalert2"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaArrowLeft,
  FaImage,
  FaUniversity,
  FaTools,
  FaDownload,
} from "react-icons/fa"
import { getAServiceList } from "../../api"
import React from "react"
import jsPDF from "jspdf"
import "jspdf-autotable"

const ImagePreview = ({ src, label }) => {
  const [show, setShow] = useState(false)

  // ONE base URL (CRA)
  const BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || ""

  // Build correct image URL
  const imageUrl = src
    ? src.startsWith("http")
      ? src
      : `${BASE_URL}${src}`
    : null

  return (
    <div className="mb-3">
      <p>
        <strong>{label}:</strong>
      </p>

      {src ? (
        <>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={label}
            onClick={() => setShow(true)}
            style={{
              width: "100px",
              height: "auto",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
            <Modal.Body className="text-center">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <span className="badge bg-secondary">Not Uploaded</span>
      )}
    </div>
  )
}


const VendorDealerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dealer, setDealer] = useState(null)
  const [dealerServices, setDealersServices] = useState([])
  const [loading, setLoading] = useState(true)

  const downloadDealerPDF = async () => {
    const doc = new jsPDF()

    const convertImageToBase64 = async (url) => {
      console.log("[v0] Attempting to convert image:", url)
      try {
        // Use a cache-busting parameter to avoid stale cached responses without CORS headers
        const fetchUrl = `${url}${url.includes("?") ? "&" : "?"}cache_bust=${Date.now()}`
        const res = await fetch(fetchUrl, {
          mode: "cors",
          credentials: "omit", // Often helps with CORS on static assets
        })

        if (!res.ok) {
          console.warn(`[v0] Fetch failed for ${url}: ${res.status} ${res.statusText}`)
          return null
        }

        const blob = await res.blob()
        console.log("[v0] Blob retrieved successfully for:", url)

        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            console.log("[v0] Base64 conversion complete for:", url)
            resolve(reader.result)
          }
          reader.onerror = (e) => {
            console.error("[v0] FileReader error for:", url, e)
            reject(e)
          }
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error("[v0] Critical error in convertImageToBase64 for:", url, error)
        return null
      }
    }

    doc.setFillColor(46, 131, 255)
    doc.rect(0, 0, 210, 40, "F")

    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.text(dealer.shopName || "Dealer Profile", 15, 25)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 33)

    let yPos = 50
    const addSection = (title) => {
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
      doc.setTextColor(46, 131, 255)
      doc.setFont("helvetica", "bold")
      doc.text(title, 15, yPos)
      yPos += 2
      doc.setDrawColor(46, 131, 255)
      doc.setLineWidth(0.5)
      doc.line(15, yPos, 195, yPos)
      yPos += 8
    }

    const addInfo = (label, value, xOffset = 15) => {
      doc.setFontSize(10)
      doc.setTextColor(80)
      doc.setFont("helvetica", "bold")
      doc.text(`${label}:`, xOffset, yPos)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(50)

      const splitValue = doc.splitTextToSize(String(value || "N/A"), 130)
      doc.text(splitValue, xOffset + 45, yPos)
      yPos += splitValue.length * 6 + 1
    }

    addSection("Shop Information")
    addInfo("Shop Email", dealer.email)
    addInfo("Shop Contact", dealer.phone)
    addInfo("Full Address", dealer.fullAddress)
    addInfo("City / State", `${dealer.city || "N/A"} / ${dealer.state || "N/A"}`)
    addInfo("Pincode", dealer.shopPincode)
    addInfo("Commission / Tax", `${dealer.commission}% / ${dealer.tax}%`)
    addInfo("Status", dealer.isActive ? "Active" : "Inactive")
    yPos += 5

    if (Array.isArray(dealer.shopImages) && dealer.shopImages.length > 0) {
      addSection("Shop Images")
      const imgWidth = 40
      const imgHeight = 30
      let xOffset = 15

      // Only take the first 4 images to avoid overflowing the page
      for (let i = 0; i < Math.min(dealer.shopImages.length, 4); i++) {
        const imgUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}${dealer.shopImages[i]}`
        const base64Img = await convertImageToBase64(imgUrl)

        if (base64Img) {
          try {
            // Check if the base64 string is a valid image format
            const format = base64Img.split(";")[0].split("/")[1].toUpperCase()
            doc.addImage(base64Img, format === "JPEG" ? "JPEG" : "PNG", xOffset, yPos, imgWidth, imgHeight)
            xOffset += imgWidth + 5
          } catch (e) {
            console.error("[v0] jsPDF addImage error:", e)
          }
        } else {
          console.warn("[v0] Skipping image due to conversion failure:", imgUrl)
        }
      }
      yPos += imgHeight + 10
    }

    addSection("Owner Details")
    addInfo("Owner Name", dealer.ownerName)
    addInfo("Owner Phone", dealer.phone)
    addInfo("Alternate Phone", dealer.alternatePhone)
    addInfo("Aadhar No.", dealer.aadharCardNo)
    addInfo("PAN No.", dealer.panCardNo)
    yPos += 10

    addSection("KYC Documents")
    const docItems = [
      { label: "Aadhar Front", key: dealer.documents?.aadharFront },
      { label: "Aadhar Back", key: dealer.documents?.aadharBack },
      { label: "PAN Card", key: dealer.documents?.panCardFront },
    ]

    let docXOffset = 15
    for (const docItem of docItems) {
      if (docItem.key) {
        const imgUrl = `https://api.mrbikedoctor.cloud/${docItem.key}`
        const base64Img = await convertImageToBase64(imgUrl)

        if (base64Img) {
          try {
            const format = base64Img.split(";")[0].split("/")[1].toUpperCase()
            doc.setFontSize(8)
            doc.text(docItem.label, docXOffset, yPos)
            doc.addImage(base64Img, format === "JPEG" ? "JPEG" : "PNG", docXOffset, yPos + 2, 40, 30)
            docXOffset += 45
          } catch (e) {
            console.error("[v0] jsPDF doc image error:", e)
          }
        }
      }
    }
    yPos += 45

    addSection("Banking Details")
    addInfo("Account Holder", dealer.bankDetails?.accountHolderName)
    addInfo("Bank Name", dealer.bankDetails?.bankName)
    addInfo("Account Number", dealer.bankDetails?.accountNumber)
    addInfo("IFSC Code", dealer.bankDetails?.ifscCode)
    yPos += 5

    addSection("Document Status")
    const docStatus = [
      ["Document Type", "Status"],
      ["Aadhar Card Front", dealer.documents?.aadharFront ? "Uploaded" : "Pending"],
      ["Aadhar Card Back", dealer.documents?.aadharBack ? "Uploaded" : "Pending"],
      ["PAN Card Front", dealer.documents?.panCardFront ? "Uploaded" : "Pending"],
      ["Shop Profile", dealer.isProfile ? "Completed" : "Incomplete"],
      ["Verification", dealer.isVerify ? "Verified" : "Unverified"],
    ]

    doc.autoTable({
      body: docStatus,
      startY: yPos,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
    })
    yPos = doc.lastAutoTable.finalY + 15

    if (dealerServices.length > 0) {
      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
      doc.setTextColor(46, 131, 255)
      doc.setFont("helvetica", "bold")
      doc.text("Service & Pricing Information", 15, yPos)
      yPos += 5

      const serviceRows = []
      dealerServices.forEach((service, sIdx) => {
        if (service.bikes && service.bikes.length > 0) {
          service.bikes.forEach((bike, bIdx) => {
            serviceRows.push([
              bIdx === 0 ? sIdx + 1 : "",
              bIdx === 0 ? service.name : "",
              `${bike.cc} CC`,
              `Rs. ${bike.price}`,
              bIdx === 0 ? new Date(service.createdAt).toLocaleDateString() : "",
            ])
          })
        }
      })

      doc.autoTable({
        head: [["#", "Service Name", "Bike Capacity", "Service Price", "Listed On"]],
        body: serviceRows,
        startY: yPos,
        theme: "grid",
        headStyles: { fillColor: [46, 131, 255], textColor: 255 },
        styles: { fontSize: 9 },
      })
    }

    doc.save(`${dealer.shopName.replace(/\s/g, "_")}_Full_Profile.pdf`)
  }

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(`https://api.mrbikedoctor.cloud/bikedoctor/dealer/view/${id}`)
        const data = await res.json()
        console.log("Data", data)
        if (!res.ok) throw new Error(data.message || "Failed to load dealer")
        setDealer(data)
      } catch (err) {
        Swal.fire("Error", err.message, "error")
        navigate("/dealers")
      } finally {
        setLoading(false)
      }
    }

    const fetchServices = async () => {
      try {
        const response = await getAServiceList()
        if (response.status === 200) {
          console.log("All Services", response.data)
          const filteredServices = response.data.filter((service) => service.dealer_id._id === id)
          console.log("Filtered Services for this dealer", filteredServices)
          setDealersServices(filteredServices)
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }

    fetchServices()

    fetchDealer()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  if (!dealer) return <div className="alert alert-danger mt-4">Dealer not found.</div>

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card">
              <div className="card-body form-horizontal">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <FaUser className="me-2" /> {dealer.shopName}
                  </h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm" onClick={downloadDealerPDF}>
                      <FaDownload className="me-2" /> Download PDF
                    </button>
                    <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
                      <FaArrowLeft className="me-2" /> Back
                    </button>
                  </div>
                </div>

                <div className="viewdealers p-3">
                  <h5 className="text-primary mb-3">
                    <FaImage className="me-2" />
                    Shop Details
                  </h5>
                  <p>
                    <strong>Shop Email:</strong> {dealer.email || "N/A"}
                  </p>
                  <p>
                    <strong>Shop Contact:</strong> {dealer.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Shop Address:</strong> {dealer.fullAddress || "N/A"}
                  </p>
                  <p>
                    <strong>Comission:</strong> {dealer.commission} % | <strong>Tax:</strong>: {dealer.tax} %
                  </p>
                  <p>
                    <strong>Shop Images: &nbsp;</strong>
                    {Array.isArray(dealer.shopImages) && dealer.shopImages.length > 0 ? (
                      dealer.shopImages.map((img, i) => (
    <ImagePreview
      key={i}
      src={img}
      label={`Shop Image ${i + 1}`}
    />
                      ))
                    ) : (
                      <span className="badge bg-secondary p-2">No Shop Images Uploaded</span>
                    )}
                  </p>

                  {/* Personal Info */}
                  <hr />
                  <h5 className="text-primary mb-3">
                    <FaUser className="me-2" /> Personal Information
                  </h5>
                  <p>
                    <strong>Name:</strong> {dealer.ownerName}
                  </p>
                  <p>
                    <FaEnvelope className="me-2" />
                    <strong>Email:</strong> {dealer.email}
                  </p>
                  <p>
                    <FaPhone className="me-2" />
                    <strong>Phone:</strong> {dealer.phone}
                  </p>
                  <p>
                    <strong>Alternate Phone:</strong> {dealer.alternatePhone || "N/A"}
                  </p>

                  {/* Address */}
                  <hr />
                  <h5 className="text-primary mb-3">
                    <FaMapMarkerAlt className="me-2" /> Address Details
                  </h5>
                  <p>
                    <strong>Full Address:</strong> {dealer.fullAddress}
                  </p>
                  <p>
                    <strong>City:</strong> {dealer.city} | <strong>State:</strong> {dealer.state} |{" "}
                    <strong>Pincode:</strong> {dealer.shopPincode}
                  </p>

                  {/* Bank Info */}
                  <hr />
                  <h5 className="text-primary mb-3">
                    <FaUniversity className="me-2" /> Banking Information
                  </h5>
                  <p>
                    <strong>Account Holder:</strong> {dealer?.bankDetails.accountHolderName}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {dealer?.bankDetails.bankName}
                  </p>
                  <p>
                    <strong>Account No.:</strong> {dealer?.bankDetails.accountNumber}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong> {dealer?.bankDetails.ifscCode}
                  </p>

                  {/* Documents */}
                  <hr />
                  <h5 className="text-primary mb-3">
                    <FaFileAlt className="me-2" /> Uploaded Documents
                  </h5>
                  <div className="row">
                    <div className="col-md-4">
                      <ImagePreview
                        src={dealer.documents?.aadharFront}
                        label="Aadhar Front"
                      />

                      <ImagePreview
                        src={dealer.documents?.aadharBack}
                        label="Aadhar Back"
                      />

                    </div>
                    <div className="col-md-4">
                      <ImagePreview
  src={dealer.documents?.panCardFront}
  label="PAN Card"
/>

                    </div>
                  </div>

                  {/* Service Info */}
                  <hr />
                  <h5 className="text-primary mb-3">
                    <FaTools className="me-2" /> Service Information
                  </h5>
                  {dealerServices.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                          <tr>
                            <th>Sr No.</th>
                            <th>Image</th>
                            <th>Service Name</th>
                            <th>Bike CC</th>
                            <th>Price</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dealerServices.map((service, serviceIndex) => (
                            <React.Fragment key={service._id}>
                              {service.bikes && service.bikes.length > 0 ? (
                                service.bikes.map((bike, index) => (
                                  <tr key={`${service._id}-${index}`}>
                                    {index === 0 ? (
                                      <>
                                        {index === 0 && <td rowSpan={service.bikes.length}>{serviceIndex + 1}</td>}
                                        <td rowSpan={service.bikes.length}>
                                          {service.image && (
                                            <ImagePreview
                                              image={service.image}
                                              label=""
                                              style={{ width: "60px", height: "auto" }}
                                            />
                                          )}
                                        </td>
                                        <td rowSpan={service.bikes.length}>{service.name}</td>
                                      </>
                                    ) : null}
                                    <td>{bike.cc} CC</td>
                                    <td>₹{bike.price}</td>
                                    {index === 0 ? (
                                      <>
                                        <td rowSpan={service.bikes.length}>
                                          {new Date(service.createdAt).toLocaleDateString()}
                                        </td>
                                      </>
                                    ) : null}
                                  </tr>
                                ))
                              ) : (
                                <tr key={`${service._id}-no-bikes`}>
                                  <td>
                                    {service.image && (
                                      <ImagePreview
                                        image={service.image}
                                        label=""
                                        style={{ width: "60px", height: "auto" }}
                                      />
                                    )}
                                  </td>
                                  <td>{service.name}</td>
                                  <td colSpan="4" className="text-center">
                                    No bike configurations
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">No services found for this dealer.</div>
                  )}

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`badge p-2 ${dealer.isActive ? "bg-success" : "bg-danger"}`}>
                      {dealer.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDealerDetails
