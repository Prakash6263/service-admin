"use client"

import { useState } from "react"

const BANNER_BASE_URL = "https://api.mrbikedoctor.cloud/uploads/banners/"
const ADMIN_SERVICE_BASE_URL = "https://api.mrbikedoctor.cloud/uploads/admin-services/"
// const BANNER_BASE_URL = "http://localhost:8001/uploads/banners/"
// const ADMIN_SERVICE_BASE_URL = "http://localhost:8001/uploads/admin-services/"

const ImagePreview = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openImage = () => setIsOpen(true)
  const closeImage = () => setIsOpen(false)

  if (!image) return "N/A"

  let imageUrl = image
  if (!image.startsWith("http")) {
    // If it's just a filename, determine the base URL
    // Banners often start with 'banner-' or are used in BannerTable
    // We'll default to admin-services for this specific task but try to be smart
    const isBanner = image.includes("banner")
    const baseUrl = isBanner ? BANNER_BASE_URL : ADMIN_SERVICE_BASE_URL
    imageUrl = `${baseUrl}${image}`
  }

  return (
    <>
      {/* Thumbnail Image */}
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="User"
        width="50"
        height="50"
        style={{ borderRadius: "5px", cursor: "pointer" }}
        onClick={openImage}
      />

      {/* Full-Size Image Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeImage}
        >
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Full Size"
            style={{ width: "100vh !important", borderRadius: "10px" }}
            className="imagespre"
          />
        </div>
      )}
    </>
  )
}

export default ImagePreview
