import React, { useState } from "react";
import Swal from "sweetalert2";
import { addBanner } from "../../api";
import { useNavigate } from "react-router-dom";

const BannerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    from_date: "",
    expiry_date: "",
  });
  const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPG, JPEG, PNG, or WEBP files are allowed.",
      });
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, from_date, expiry_date } = formData;
    const newErrors = {};

    // Date parsing
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    const from = new Date(from_date);
    const to = new Date(expiry_date);

    // Validation
    if (!name) newErrors.name = "Banner name is required.";

    if (!from_date) {
      newErrors.from_date = "From date is required.";
    } else if (from < today) {
      newErrors.from_date = "From date cannot be in the past.";
    }

    if (!expiry_date) {
      newErrors.expiry_date = "Expiry date is required.";
    } else if (from_date && expiry_date && to < from) {
      newErrors.expiry_date = "Expiry date cannot be before start date.";
    }

    if (!image) newErrors.image = "Banner image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed if no errors
    const form = new FormData();
    form.append("name", name);
    form.append("from_date", from_date);
    form.append("expiry_date", expiry_date);
    form.append("images", image); // must match backend key

    try {
      const response = await addBanner(form);

      Swal.fire({
        title: "Success!",
        text: response.message || "Banner added successfully.",
        icon: "success",
      });
      navigate("/bannerList")
      setFormData({
        name: "",
        from_date: "",
        expiry_date: "",
      });
      setImage(null);
      setErrors({});
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-3">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <div className="input-block mb-3">
                <label className="form-control-label">Banner Name</label>
                <input
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="input-block mb-3">
                <label className="form-control-label">From Date</label>
                <input
                  className={`form-control ${errors.from_date ? "is-invalid" : ""}`}
                  name="from_date"
                  type="date"
                  value={formData.from_date}
                  onChange={handleChange}
                />
                {errors.from_date && <div className="invalid-feedback">{errors.from_date}</div>}
              </div>

              <div className="input-block mb-3">
                <label className="form-control-label">Expiry Date</label>
                <input
                  className={`form-control ${errors.expiry_date ? "is-invalid" : ""}`}
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                />
                {errors.expiry_date && <div className="invalid-feedback">{errors.expiry_date}</div>}
              </div>

              <div className="input-block mb-3">
                <label className="form-control-label">Upload Banner Image</label>
                <input
                  type="file"
                  className={`form-control mb-2 ${errors.image ? "is-invalid" : ""}`}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
                {preview && (
                  <div className="border rounded p-2 bg-light text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group col-lg-12 mb-3">
                <button className="btn btn-primary mt-4 mb-5" type="submit">
                  Create Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
