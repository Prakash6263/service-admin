import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditService = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getDealerService = async (id) => {
        try {
            const res = await axios.get(`https://api.mrbikedoctor.cloud/bikedoctor/service/edit-service/${id}`);
            console.log("API Response:", res.data);

            if (res.status === 200) {
                const serviceData = res.data.data;

                setFormData({
                    name: serviceData.name,
                    description: serviceData.description
                });

                setExistingImage(serviceData.image);
                setBikes(serviceData.bikes || []);
                setSelectedDealer(serviceData.dealer_id?._id || "");

            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching service:", error);
            Swal.fire('Error', 'Failed to load service data', 'error');
            navigate('/services');
        }
    };

    useEffect(() => {
        getDealerService(id)
    }, [id])

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Service name is required";
        } else if (formData.name.length < 2) {
            errors.name = "Name must be at least 2 characters";
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required";
        }

        if (!selectedDealer) {
            errors.dealer_id = "Please select a dealer";
        }

        bikes.forEach((bike, index) => {
            if (!bike.cc) {
                errors[`bike_cc_${index}`] = "Bike CC is required";
            } else if (parseInt(bike.cc) <= 0) {
                errors[`bike_cc_${index}`] = "CC must be greater than 0";
            }

            if (!bike.price) {
                errors[`bike_price_${index}`] = "Price is required";
            } else if (parseInt(bike.price) <= 0) {
                errors[`bike_price_${index}`] = "Price must be greater than 0";
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleBikeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBikes = [...bikes];
        updatedBikes[index][name] = value;
        setBikes(updatedBikes);
    };

    const addBikeField = () => {
        setBikes([...bikes, { cc: "", price: "" }]);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate form
    //     if (!validate()) {
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         // Prepare FormData for the request
    //         const formData = new FormData();
    //         formData.append('name', formData.name);
    //         formData.append('description', formData.description);
    //         formData.append('dealer_id', selectedDealer);
    //         formData.append('bikes', JSON.stringify(bikes));

    //         // Only append image if a new one was selected
    //         if (image) {
    //             formData.append('image', image);
    //         }

    //         // Make the API call
    //         const response = await axios.put(
    //             // `https://api.mrbikedoctor.cloud/bikedoctor/service/update-service/${id}`,
    //             `https://api.mrbikedoctor.cloud/bikedoctor/service/update-service/${id}`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             }
    //         );

    //         if (response.data.status === 200) {
    //             Swal.fire({
    //                 title: 'Success!',
    //                 text: 'Service updated successfully',
    //                 icon: 'success',
    //                 confirmButtonText: 'OK'
    //             }).then(() => {
    //                 navigate('/services');
    //             });
    //         } else {
    //             throw new Error(response.data.message || 'Failed to update service');
    //         }
    //     } catch (error) {
    //         console.error('Error updating service:', error);

    //         let errorMessage = 'Failed to update service';
    //         if (error.response) {
    //             if (error.response.data.errors) {
    //                 const errors = error.response.data.errors;
    //                 const newFormErrors = {};

    //                 errors.forEach(err => {
    //                     if (err.path === 'name') newFormErrors.name = err.msg;
    //                     if (err.path === 'description') newFormErrors.description = err.msg;
    //                     if (err.path === 'dealer_id') newFormErrors.dealer_id = err.msg;
    //                     if (err.path === 'bikes') newFormErrors.bikes = err.msg;
    //                     if (err.path === 'image') newFormErrors.image = err.msg;
    //                 });

    //                 setFormErrors(newFormErrors);
    //             }
    //             errorMessage = error.response.data.message || errorMessage;
    //         }

    //         Swal.fire({
    //             title: 'Error!',
    //             text: errorMessage,
    //             icon: 'error',
    //             confirmButtonText: 'OK'
    //         });
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);

            fd.append('dealer_id', selectedDealer);

            fd.append('bikes', JSON.stringify(bikes));

            if (image) {
                fd.append('image', image);
            }

            const response = await axios.put(
                // `https://api.mrbikedoctor.cloud/bikedoctor/service/update-service/${id}`,
                `https://api.mrbikedoctor.cloud/bikedoctor/service/update-service/${id}`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.status === 200) {
                await Swal.fire('Success!', 'Service updated successfully', 'success');
                navigate('/services');
            } else {
                throw new Error(response.data.message || 'Failed to update service');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Swal.fire('Error!', error?.response?.data?.message || 'Failed to update service', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeBikeField = (index) => {
        if (bikes.length > 1) {
            setBikes(bikes.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5>Edit Service</h5>
                        <button
                            className="btn"
                            style={{ backgroundColor: "black", color: "white" }}
                            onClick={() => navigate(-1)}
                        >
                            <i className="fas fa-arrow-left me-2"></i> Back
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card-table card p-3">
                            <div className="card-body">
                                <form className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Service Name</label>
                                        <input
                                            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {formErrors.name && (
                                            <div className="invalid-feedback">{formErrors.name}</div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Description</label>
                                        <textarea
                                            className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                        {formErrors.description && (
                                            <div className="invalid-feedback">{formErrors.description}</div>
                                        )}
                                    </div>

                                    {/* Dealer Dropdown */}
                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Select Dealer</label>
                                        <select
                                            className={`form-control ${formErrors.dealer_id ? "is-invalid" : ""}`}
                                            value={selectedDealer}
                                            onChange={(e) => setSelectedDealer(e.target.value)}
                                        >
                                            <option value="">Select a Dealer</option>
                                            {dealers.map((dealer) => (
                                                <option key={dealer._id} value={dealer._id}>
                                                    {dealer.shopName}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.dealer_id && (
                                            <div className="invalid-feedback">{formErrors.dealer_id}</div>
                                        )}
                                    </div>
                                    {/* Dealer (read-only) */}
                                    {/* <div className="input-block mb-3">
                                        <label className="form-control-label">Dealer</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={dealers.find(d => d._id === dealer_id)?.shopName ||
                                                (typeof dealer_id !== 'undefined' ? dealer_id?.dealer_id?.shopName || '' : '')}
                                            readOnly
                                        />
                                    </div> */}

                                    {/* Bike CC & Price Fields */}
                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Bike CC & Price</label>
                                        {/* {bikes.map((bike, index) => (
                                            <div key={index} className="d-flex mb-2">
                                                <input
                                                    className={`form-control me-2 ${formErrors[`bike_cc_${index}`] ? "is-invalid" : ""
                                                        }`}
                                                    type="number"
                                                    name="cc"
                                                    placeholder="Bike CC"
                                                    value={bike.cc}
                                                    onChange={(e) => handleBikeChange(index, e)}
                                                />
                                                <input
                                                    className={`form-control me-2 ${formErrors[`bike_price_${index}`] ? "is-invalid" : ""
                                                        }`}
                                                    type="number"
                                                    name="price"
                                                    placeholder="Price"
                                                    value={bike.price}
                                                    onChange={(e) => handleBikeChange(index, e)}
                                                />
                                                {bikes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => removeBikeField(index)}
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </div>
                                        ))} */}
                                        {bikes
                                            .map((bike, originalIndex) => ({ ...bike, originalIndex })) // Store original index
                                            .sort((a, b) => (a.cc || 0) - (b.cc || 0)) // Sort by CC from less to more
                                            .map(({ cc, price, originalIndex }) => (
                                                <div key={originalIndex} className="d-flex mb-2">
                                                    <input
                                                        className={`form-control me-2 ${formErrors[`bike_cc_${originalIndex}`] ? "is-invalid" : ""}`}
                                                        type="number"
                                                        name="cc"
                                                        placeholder="Bike CC"
                                                        value={cc}
                                                        onChange={(e) => handleBikeChange(originalIndex, e)}
                                                    />
                                                    <input
                                                        className={`form-control me-2 ${formErrors[`bike_price_${originalIndex}`] ? "is-invalid" : ""}`}
                                                        type="number"
                                                        name="price"
                                                        placeholder="Price"
                                                        value={price}
                                                        onChange={(e) => handleBikeChange(originalIndex, e)}
                                                    />
                                                    {bikes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => removeBikeField(originalIndex)}
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        }
                                        {/* {bikes.map((_, index) => (-
                                            <React.Fragment key={index}>
                                                {formErrors[`bike_cc_${index}`] && (
                                                    <div className="text-danger">{formErrors[`bike_cc_${index}`]}</div>
                                                )}
                                                {formErrors[`bike_price_${index}`] && (
                                                    <div className="text-danger">{formErrors[`bike_price_${index}`]}</div>
                                                )}
                                            </React.Fragment>
                                        ))} */}

                                        <button
                                            type="button"
                                            className="btn btn-success mt-2"
                                            onClick={addBikeField}
                                        >
                                            Add More
                                        </button>
                                    </div>

                                    {/* Upload Image */}
                                    <div className="input-block mb-3">
                                        <label className="form-control-label">
                                            Update Service Image
                                        </label>
                                        {existingImage && (
                                            <div className="mb-2">
                                                <p>Current Image:</p>
                                                <img
                                                    src={`/uploads/${existingImage}`}
                                                    alt="Current service"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        padding: '5px'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="image"
                                            className={`form-control ${formErrors.image ? "is-invalid" : ""}`}
                                            onChange={handleFileChange}
                                        />
                                        {formErrors.image && (
                                            <div className="invalid-feedback">{formErrors.image}</div>
                                        )}
                                        <small className="text-muted">
                                            Leave empty to keep the existing image
                                        </small>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        className="btn btn-primary mt-4 mb-5"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Updating..."
                                            : "Update"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditService;