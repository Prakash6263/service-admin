import React, { useState, useMemo } from "react";
import { createUser } from "../../../api";
import { useNavigate } from "react-router-dom";

function CreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const roleOptions = useMemo(
    () => ["Telecaller", "Manager", "Admin", "Subadmin", "Executive"],
    []
  );

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Phone number must be 10 digits";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // valid if no errors
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Optionally clear error on change:
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return; // stop submit if invalid
    }

    setLoading(true);

    try {
      const response = await createUser(formData);

      if (response.status === 200 && response.success) {
        setFormData({ name: "", email: "", password: "", mobile: "", role: "" });
        navigate("/admins");
      } else {
        console.error("User creation failed", response.message);
      }
    } catch (error) {
      console.error("User creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-3">
          <div className="card-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group-item">
                <div className="row align-items-end">
                  <div className="col-md-12">
                    <div className="input-block mb-3">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>

                    <div className="input-block mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                      )}
                    </div>

                    <div className="input-block mb-3">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.password && (
                        <div className="invalid-feedback">{formErrors.password}</div>
                      )}
                    </div>

                    <div className="input-block mb-3">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="mobile"
                        className={`form-control ${formErrors.mobile ? "is-invalid" : ""}`}
                        placeholder="Enter Phone"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.mobile && (
                        <div className="invalid-feedback">{formErrors.mobile}</div>
                      )}
                    </div>

                    <div className="input-block mb-3">
                      <label>Role</label>
                      <select
                        name="role"
                        className={`form-control ${formErrors.role ? "is-invalid" : ""}`}
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {formErrors.role && (
                        <div className="invalid-feedback">{formErrors.role}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group col-lg-12 mb-3">
                  <button
                    className="btn btn-primary mt-4 mb-5"
                    id="create_btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                  <button
                    className="btn btn-danger mt-4 mb-5"
                    type="button"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setFormData({ name: "", email: "", password: "", mobile: "", role: "" });
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;
