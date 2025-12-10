import { useEffect, useState } from 'react';
import StateCitySelect from '../Global/StateCitySelect';
import Swal from 'sweetalert2';
import { addDealer } from "../../api";
import { useNavigate } from 'react-router-dom';

const DealerForm = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    password: '',
    shopPincode: '',
    ownerName: '',
    fullAddress: '',
    city: '',
    state: '',
    comission: '',
    tax: '',
    latitude: '',
    longitude: '',
    personalEmail: '',
    personalPhone: '',
    alternatePhone: '',
    shopState: 'Madhya Pradesh',
    shopCity: 'Indore',
    shopPinCode: '',
    accountHolderName: '',
    ifscCode: '',
    bankName: '',
    accountNumber: '',
    permanentAddress: "",
    presentAddress: '',
    permanentState: "",
    permanentCity: "",
    presentState: "",
    presentCity: "",
    aadharCardNo: "",
    panCardNo: ""
  });

  const [errors, setErrors] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);
  const [panCardFront, setPanCardFront] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sameAsPermanent") {
      setSameAsPermanent(checked);
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          presentAddress: prev.permanentAddress,
          presentState: prev.permanentState,
          presentCity: prev.permanentCity,
        }));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      (name === "personalPhone" && value === formData.alternatePhone) ||
      (name === "alternatePhone" && value === formData.personalPhone)
    ) {
      setErrors((prev) => ({
        ...prev,
        alternatePhone: "Alternate phone must be different from personal phone",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        alternatePhone: undefined,
      }));
    }

  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const accountNumberRegex = /^[0-9]{9,18}$/;

    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Contact is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits)';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.shopPincode.trim()) newErrors.shopPincode = 'Pincode is required';
    else if (!pincodeRegex.test(formData.shopPincode)) newErrors.shopPincode = 'Invalid pincode (6 digits)';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.panCardNo?.trim()) {
      newErrors.panCardNo = 'PAN card number is required';
    } else {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const sanitizedPan = formData.panCardNo.trim().toUpperCase();
      if (!panRegex.test(sanitizedPan)) {
        newErrors.panCardNo = 'Invalid PAN card format (e.g., ABCDE1234F)';
      }
    }
    if (!formData.comission) {
      newErrors.comission = 'Commission is required';
    } else if (isNaN(formData.comission)) {
      newErrors.comission = 'Commission must be a number';
    } else {
      const commissionValue = parseFloat(formData.comission);
      if (commissionValue < 0) {
        newErrors.comission = 'Commission cannot be negative';
      } else if (commissionValue > 100) {
        newErrors.comission = 'Commission cannot be greater than 100%';
      }
    }
    if (formData.tax) {
      if (isNaN(formData.tax)) {
        newErrors.tax = 'Tax must be a number';
      } else {
        const taxValue = parseFloat(formData.tax);
        if (taxValue < 0) {
          newErrors.tax = 'Tax cannot be negative';
        } else if (taxValue > 18) {
          newErrors.tax = 'Tax cannot be greater than 18%';
        }
      }
    }
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required';
    else if (isNaN(formData.latitude)) newErrors.latitude = 'Must be a number';
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required';
    else if (isNaN(formData.longitude)) newErrors.longitude = 'Must be a number';

    if (!formData.personalEmail.trim()) newErrors.personalEmail = 'Email is required';
    else if (!emailRegex.test(formData.personalEmail)) newErrors.personalEmail = 'Invalid email format';
    if (!formData.personalPhone.trim()) newErrors.personalPhone = 'Personal Phone is required';
    else if (!phoneRegex.test(formData.personalPhone)) newErrors.personalPhone = 'Invalid phone number (10 digits)';
    if (!formData.alternatePhone.trim()) newErrors.alternatePhone = 'Alternate Phone is required';
    else if (!phoneRegex.test(formData.alternatePhone)) newErrors.alternatePhone = 'Invalid phone number (10 digits)';
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = 'Permanent Address is required';
    if (!formData.presentAddress) newErrors.presentAddress = 'Present Address is required';
    if (!formData.shopCity.trim()) newErrors.shopCity = 'City is required';
    if (!formData.shopState.trim()) newErrors.shopState = 'State is required';
    if (!formData.shopPinCode.trim()) newErrors.shopPinCode = 'Pincode is required';
    else if (!pincodeRegex.test(formData.shopPinCode)) newErrors.shopPinCode = 'Invalid pincode (6 digits)';
    if (!formData.permanentState.trim()) newErrors.permanentState = 'Permanent state is required';
    if (!formData.permanentCity.trim()) newErrors.permanentCity = 'Permanent city is required';
    if (!formData.presentState.trim()) newErrors.presentState = 'Present state is required';
    if (!formData.presentCity.trim()) newErrors.presentCity = 'Present city is required';

    if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    else if (!ifscRegex.test(formData.ifscCode)) newErrors.ifscCode = 'Invalid IFSC code format';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    else if (!accountNumberRegex.test(formData.accountNumber)) newErrors.accountNumber = 'Account number must be 9-18 digits';

    if (previewUrls.length === 0) newErrors.shopImages = 'At least one shop image is required';
    if (!panCardFront) newErrors.panCardFront = 'PAN card front is required';
    if (!aadharFront) newErrors.adharCardFront = 'Aadhar card front is required';
    if (!aadharBack) newErrors.adharCardBack = 'Aadhar card front is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const sanitizedPan = formData.panCardNo?.trim().toUpperCase();
    const sanitizedAadhar = formData.aadharCardNo?.replace(/\s/g, '');

    const form = new FormData();

    const allowedTextFields = [
      "shopName",
      "email",
      "phone",
      "password",
      "shopPincode",
      "ownerName",
      "fullAddress",
      "city",
      "state",
      "latitude",
      "longitude",
      "personalEmail",
      "personalPhone",
      "alternatePhone",
      "shopState",
      "shopCity",
      "shopPinCode",
      "accountHolderName",
      "ifscCode",
      "bankName",
      "accountNumber",
      "permanentAddress",
      "presentAddress",
      "permanentState",
      "permanentCity",
      "presentState",
      "presentCity",
      "comission",
      "tax"
    ];

    // Append text fields
    allowedTextFields.forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    // Append sanitized aadhar/pan
    if (sanitizedAadhar) form.append("aadharCardNo", sanitizedAadhar);
    if (sanitizedPan) form.append("panCardNo", sanitizedPan);

    // Append documents
    if (panCardFront) form.append("panCardFront", panCardFront);
    if (aadharFront) form.append("aadharFront", aadharFront);
    if (aadharBack) form.append("aadharBack", aadharBack);

    try {
      console.log("Data here:-", form)
      const response = await addDealer(form);

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: response.message || "Dealer added successfully",
          icon: "success"
        });

        setFormData({
          shopName: '',
          email: '',
          phone: '',
          password: '',
          shopPincode: '',
          ownerName: '',
          fullAddress: '',
          city: '',
          state: '',
          latitude: '',
          longitude: '',
          personalEmail: '',
          personalPhone: '',
          alternatePhone: '',
          shopState: '',
          shopCity: '',
          shopPinCode: '',
          goDigital: false,
          pickupAndDrop: false,
          accountHolderName: '',
          ifscCode: '',
          bankName: '',
          accountNumber: '',
          permanentAddress: '',
          presentAddress: '',
          aadharCardNo: '',
          panCardNo: '',
          gstNumber: '',
          comission: '',
          tax: ''
        });

        setPreviewUrls([]);
        setPanCardFront(null);
        setAadharFront(null);
        setAadharBack(null);
        navigate("/dealers");
      }
    } catch (error) {
      const errorData = error.response?.data;

      Swal.fire({
        title: "Error!",
        text: errorData?.message || "An unexpected error occurred",
        icon: "error"
      });

      if (errorData?.field === "shop-email") {
        setErrors(prev => ({
          ...prev,
          email: errorData.message
        }));
      }

      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    if (formData.comission) {
      const value = parseFloat(formData.comission);
      if (value > 100) {
        setErrors(prev => ({ ...prev, comission: 'Commission cannot be greater than 100%' }));
      }
    }

    if (formData.tax) {
      const value = parseFloat(formData.tax);
      if (value > 18) {
        setErrors(prev => ({ ...prev, tax: 'Tax cannot be greater than 18%' }));
      }
    }
  }, [formData.comission, formData.tax]);

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - previewUrls.length);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);
    setErrors({ ...errors, shopImages: undefined });
  };

  const handleRemoveImage = (indexToRemove) => {
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileUpload = (e, setFile, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setErrors({ ...errors, [fieldName]: undefined });
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-5">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <input name="_token" type="hidden" defaultValue="oKup3nu5kd6tUBCqoFTVEMtnOOg1p3zubico9KkM" />

              {/* Shop Details */}
              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Shop Name<em style={{ color: "red" }}>*</em></label>
                    <input
                      className={`form-control ${errors.shopName ? 'is-invalid' : ''}`}
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="Enter shop name"
                    />
                    {errors.shopName && <div className="invalid-feedback">{errors.shopName}</div>}
                  </div>
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Shop Email<em style={{ color: "red" }}>*</em></label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter shop email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
              </div>

              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Shop Contact<em style={{ color: "red" }}>*</em></label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter shop contact details"
                      maxLength="10"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Password<em style={{ color: "red" }}>*</em></label>
                    <input
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password for shop account"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>
              </div>

              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Shop Pincode<em style={{ color: "red" }}>*</em></label>
                    <input
                      className={`form-control ${errors.shopPincode ? 'is-invalid' : ''}`}
                      type="text"
                      name="shopPincode"
                      value={formData.shopPincode}
                      onChange={handleChange}
                      placeholder="Enter shop pincode"
                      maxLength="6"
                    />
                    {errors.shopPincode && <div className="invalid-feedback">{errors.shopPincode}</div>}
                  </div>
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Owner Name<em style={{ color: "red" }}>*</em></label>
                    <input
                      type="text"
                      className={`form-control ${errors.ownerName ? 'is-invalid' : ''}`}
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter shop owner name"
                    />
                    {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
                  </div>
                </div>
              </div>

              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Full Address<em style={{ color: "red" }}>*</em></label>
                    <input
                      className={`form-control ${errors.fullAddress ? 'is-invalid' : ''}`}
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      placeholder="Enter full address of the shop"
                    />
                    {errors.fullAddress && <div className="invalid-feedback">{errors.fullAddress}</div>}
                  </div>
                  <StateCitySelect
                    value={formData}
                    onChange={handleChange}
                    stateName="state"
                    cityName="city"
                    errors={errors}
                  />
                </div>
              </div>

              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Commission (%)<em style={{ color: "red" }}>*</em></label>
                    <input
                      className={`form-control ${errors.comission ? 'is-invalid' : ''}`}
                      type="number"
                      name="comission"
                      value={formData.comission ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          comission: isNaN(value) ? null : value
                        }));
                      }}
                      placeholder="0-100%"
                      step="0.01"
                      min="0"
                      max="100"
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                      }}
                    />
                    {errors.comission && <div className="invalid-feedback">{errors.comission}</div>}
                  </div>
                  <div className="flex-fill input-block">
                    <label className="form-control-label">Tax (%)</label>
                    <input
                      type="number"
                      className={`form-control ${errors.tax ? 'is-invalid' : ''}`}
                      name="tax"
                      value={formData.tax || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseFloat(e.target.value);
                        handleChange({
                          target: {
                            name: 'tax',
                            value: isNaN(value) ? null : value
                          }
                        });
                      }}
                      placeholder="Enter tax percentage (0-18)"
                      step="0.01"
                      min="0"
                      max="18"
                    />
                    {errors.tax && <div className="invalid-feedback">{errors.tax}</div>}
                  </div>
                </div>
              </div>

              <div className="input-block mb-3">
                <div className="input-block mb-3">
                  <label className="form-control-label">Latitude<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.latitude ? 'is-invalid' : ''}`}
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Enter latitude of the shop"
                    step="any"
                  />
                  {errors.latitude && <div className="invalid-feedback">{errors.latitude}</div>}
                </div>
                <div className="input-block mb-3">
                  <label className="form-control-label">Longitude<em style={{ color: "red" }}>*</em></label>
                  <input
                    type="number"
                    className={`form-control ${errors.longitude ? 'is-invalid' : ''}`}
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Enter longitude of the shop"
                    step="any"
                  />
                  {errors.longitude && <div className="invalid-feedback">{errors.longitude}</div>}
                </div>
              </div>

              <div className="mb-3 w-100">
                <div className="d-flex gap-3">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Shop Images<em style={{ color: "red" }}>*</em></label>
                    <div className="d-flex flex-wrap gap-3">
                      {previewUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="position-relative border rounded"
                          style={{
                            width: "100px",
                            height: "100px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={url}
                            alt={`Preview ${idx}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-1 bg-white"
                            style={{ fontSize: "0.6rem" }}
                            onClick={() => handleRemoveImage(idx)}
                          ></button>
                        </div>
                      ))}
                      {previewUrls.length < 5 && (
                        <label
                          htmlFor="shop-image-upload"
                          className="d-flex align-items-center justify-content-center border rounded"
                          style={{
                            width: "100px",
                            height: "100px",
                            cursor: "pointer",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <i className="fas fa-plus text-muted"></i>
                        </label>
                      )}
                    </div>
                    <input
                      id="shop-image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleMultipleImages}
                    />
                    <div className="form-text mt-2">You can upload up to 5 images</div>
                    {errors.shopImages && <div className="text-danger small">{errors.shopImages}</div>}
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <h4>Personal Details</h4>
              </div>
              <div className="row">
                <div className="col-md-6 input-block mb-3">
                  <label className="form-control-label">Personal Email<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.personalEmail ? 'is-invalid' : ''}`}
                    name="personalEmail"
                    type="email"
                    placeholder='Enter you personal email'
                    value={formData.personalEmail}
                    onChange={handleChange}
                  />
                  {errors.personalEmail && <div className="invalid-feedback">{errors.personalEmail}</div>}
                </div>
                <div className="col-md-3 input-block mb-3">
                  <label className="form-control-label">Personal Phone<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.personalPhone ? 'is-invalid' : ''}`}
                    name="personalPhone"
                    type="tel"
                    value={formData.personalPhone}
                    onChange={handleChange}
                    placeholder='Enter you personal contact details'
                    maxLength="10"
                  />
                  {errors.personalPhone && <div className="invalid-feedback">{errors.personalPhone}</div>}
                </div>
                <div className="col-md-3 input-block mb-3">
                  <label className="form-control-label">Alternate Phone<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.alternatePhone ? 'is-invalid' : ''}`}
                    name="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder='Enter you alternate contact details'
                    maxLength="10"
                  />
                  {errors.alternatePhone && <div className="invalid-feedback">{errors.alternatePhone}</div>}
                </div>
                {/* </div> */}
                <div className="input-block mb-3 col-md-6">
                  <label className="form-control-label">Permanent Address<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.permanentAddress ? 'is-invalid' : ''}`}
                    name="permanentAddress"
                    type="text"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                  />
                  {errors.permanentAddress && <div className="invalid-feedback">{errors.permanentAddress}</div>}
                </div>
                <div className="input-block mb-3 col-md-6">
                  <StateCitySelect
                    value={formData}
                    onChange={handleChange}
                    stateName="permanentState"
                    cityName="permanentCity"
                    errors={errors}
                  />
                </div>
                <div className="input-block mb-3 col-md-6">
                  <label className="form-control-label">Present Address<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.presentAddress ? 'is-invalid' : ''}`}
                    name="presentAddress"
                    type="text"
                    value={formData.presentAddress}
                    onChange={handleChange}
                  />
                  {errors.presentAddress && <div className="invalid-feedback">{errors.presentAddress}</div>}
                  {/* Present Address Section */}
                  <div className="input-block col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sameAsPermanent"
                        name="sameAsPermanent"
                        checked={sameAsPermanent}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="sameAsPermanent">
                        Present Address is same as Permanent Address
                      </label>
                    </div>
                  </div>
                </div>
                <div className="input-block mb-3 col-md-6">
                  <StateCitySelect
                    value={formData}
                    onChange={handleChange}
                    stateName="presentState"
                    cityName="presentCity"
                    errors={errors}
                    disabled={sameAsPermanent}
                  />
                </div>
              </div>
              <div className="row">
                <div className="input-block mb-3 col-md-6">
                  <label className="form-control-label">PIN Code<em style={{ color: "red" }}>*</em></label>
                  <input
                    className={`form-control ${errors.shopPinCode ? 'is-invalid' : ''}`}
                    name="shopPinCode"
                    type="text"
                    value={formData.shopPinCode}
                    onChange={handleChange}
                    maxLength="6"
                  />
                  {errors.shopPinCode && <div className="invalid-feedback">{errors.shopPinCode}</div>}
                </div>
                <div className="col-md-6 input-block mb-3">
                  <label className="form-control-label">PAN Card Front<em style={{ color: "red" }}>*</em></label>
                  <input
                    type="file"
                    className={`form-control ${errors.panCardFront ? 'is-invalid' : ''}`}
                    name="panCardFront"
                    onChange={(e) => handleFileUpload(e, setPanCardFront, 'panCardFront')}
                    accept="image/*"
                  />
                  {errors.panCardFront && <div className="invalid-feedback">{errors.panCardFront}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 input-block mb-3">
                  <label className="form-control-label">Aadhar Front<em style={{ color: "red" }}>*</em></label>
                  <input
                    type="file"
                    className={`form-control ${errors.adharCardFront ? 'is-invalid' : ''}`}
                    name="adharCardFront"
                    onChange={(e) => handleFileUpload(e, setAadharFront, 'adharCardFront')}
                    accept="image/*"
                  />
                  {errors.adharCardFront && <div className="invalid-feedback">{errors.adharCardFront}</div>}
                </div>
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="form-control-label">Aadhar Back<em style={{ color: "red" }}>*</em></label>
                    <input
                      type="file"
                      className={`form-control ${errors.adharCardBack ? 'is-invalid' : ''}`}
                      name="adharCardBack"
                      onChange={(e) => handleFileUpload(e, setAadharBack, 'adharCardFront')}
                      accept="image/*"
                    />
                    {errors.adharCardBack && <div className="invalid-feedback">{errors.adharCardBack}</div>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 input-block mb-3">
                  <label className="form-control-label">Aadhar Card No.<em style={{ color: "red" }}>*</em></label>
                  <input
                    type="text"
                    className={`form-control ${errors.aadharCardNo ? 'is-invalid' : ''}`}
                    name="aadharCardNo"
                    value={formData.aadharCardNo || ''}
                    onChange={handleChange}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                  />
                  {errors.aadharCardNo && <div className="invalid-feedback">{errors.aadharCardNo}</div>}
                </div>
                <div className="col-md-6 input-block mb-3">
                  <label className="form-control-label">PAN Card No.<em style={{ color: "red" }}>*</em></label>
                  <input
                    type="text"
                    className={`form-control ${errors.panCardNo ? 'is-invalid' : ''}`}
                    name="panCardNo"
                    value={formData.panCardNo || ''}
                    onChange={handleChange}
                    placeholder="Enter PAN number (e.g., ABCDE1234F)"
                    maxLength="10"
                  />
                  {errors.panCardNo && <div className="invalid-feedback">{errors.panCardNo}</div>}
                </div>
              </div>

              {/* Bank Details */}
              <div className='row'>
                <div className="text-center">
                  <h4>Bank Information</h4>
                </div>
                <div className="mb-3 w-100">
                  <div className="d-flex gap-3">
                    <div className="flex-fill input-block">
                      <label className="form-control-label">Account Holder Name<em style={{ color: "red" }}>*</em></label>
                      <input
                        className={`form-control ${errors.accountHolderName ? 'is-invalid' : ''}`}
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        placeholder="Enter account holder name"
                      />
                      {errors.accountHolderName && <div className="invalid-feedback">{errors.accountHolderName}</div>}
                    </div>
                    <div className="flex-fill input-block">
                      <label className="form-control-label">IFSC Code<em style={{ color: "red" }}>*</em></label>
                      <input
                        type="text"
                        className={`form-control ${errors.ifscCode ? 'is-invalid' : ''}`}
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="Enter IFSC code"
                      />
                      {errors.ifscCode && <div className="invalid-feedback">{errors.ifscCode}</div>}
                    </div>
                  </div>
                </div>
                <div className="mb-3 w-100">
                  <div className="d-flex gap-3">
                    <div className="flex-fill input-block">
                      <label className="form-control-label">Bank Name<em style={{ color: "red" }}>*</em></label>
                      <input
                        className={`form-control ${errors.bankName ? 'is-invalid' : ''}`}
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Enter bank name"
                      />
                      {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                    </div>
                    <div className="flex-fill input-block">
                      <label className="form-control-label">Account Number<em style={{ color: "red" }}>*</em></label>
                      <input
                        type="text"
                        className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`}
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Enter account number"
                      />
                      {errors.accountNumber && <div className="invalid-feedback">{errors.accountNumber}</div>}
                    </div>
                  </div>
                </div>
                {/* <div className="mb-4">
                  <label className="form-label fw-semibold">Passbook<em style={{ color: "red" }}>*</em></label>

                  {passbookImage ? (
                    <div className="position-relative d-inline-block">
                      <img
                        src={URL.createObjectURL(passbookImage)}
                        alt="Passbook Preview"
                        className="border rounded"
                        style={{ width: 150, height: 150, objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 px-2 py-0"
                        onClick={() => setPassbookImage(null)}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="passbook-upload"
                      className={`form-control d-flex align-items-center justify-content-center p-4 text-muted border rounded ${errors.passbook ? 'border-danger' : ''}`}
                      style={{ height: 150, cursor: "pointer" }}
                    >
                      <i className="fas fa-upload me-2" /> Click to upload
                    </label>
                  )}

                  <input
                    id="passbook-upload"
                    type="file"
                    accept="image/*"
                    name="passbook"
                    className="d-none"
                    onChange={(e) => handleFileUpload(e, setPassbookImage, 'passbook')}
                  />

                  <div className="form-text mt-2">Only one image allowed (JPG, PNG)</div>
                  {errors.passbook && <div className="text-danger small">{errors.passbook}</div>}
                </div> */}
              </div>

              {/* Submit Buttons */}
              <div className="form-group col-lg-12 d-flex gap-3 mt-4 mb-5">
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
                <button className="btn btn-danger" type="reset">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerForm;