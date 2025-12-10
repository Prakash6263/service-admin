import { useState } from "react";

const IMAGE_BASE_URL = process.env.VITE_IMAGE_BASE_URL || "http://68.178.205.195:8001/image/";

const ImagePreview = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openImage = () => setIsOpen(true);
  const closeImage = () => setIsOpen(false);

  if (!image) return "N/A";

  return (
    <>
      {/* Thumbnail Image */}
      <img
        src={`${IMAGE_BASE_URL}${image}`}
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
            zIndex: 1000
          }}
          onClick={closeImage}
        >
          <img
            src={`${IMAGE_BASE_URL}${image}`}
            alt="Full Size"
            style={{ width: "100vh !important", borderRadius: "10px" }}
            className="imagespre"
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;
