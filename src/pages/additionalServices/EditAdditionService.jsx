// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import { getDealerList } from "../../api";
// import axios from "axios";

// const EditAdditionService = () => {

//     const navigate = useNavigate()
//     const { id } = useParams();
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//     });

//     const [image, setImage] = useState(null);
//     const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
//     const [dealers, setDealers] = useState([]);
//     const [selectedDealer, setSelectedDealer] = useState("");
//     const [serviceData, setServiceData] = useState(null);

//     useEffect(() => {

//         const getServices = async () => {
//             try {
//                 const res = await axios.get(`https://api.mrbikedoctor.cloud/service/getAdditionalService/${id}`)
//                 console.log("Service Data:", res.data);
//                 if (res.status === 200) {
//                     console.log("Service Data:", res.data.data);
//                     setServiceData(res.data);
//                     setFormData({
//                         name: res.data.data.name,
//                         description: res.data.data.description,
//                     });
//                     setBikes(res.data.data.bikes || [{ cc: "", price: "" }]);
//                     setSelectedDealer(res.data.data.dealer_id?._id || "");
//                 }
//             }
//             catch (error) { }
//         }

//         const fetchDealers = async () => {
//             try {
//                 const response = await getDealerList();
//                 setDealers(response?.data || []);
//             } catch (error) {
//                 console.error("Failed to fetch dealers", error);
//                 setDealers([]);
//             }
//         };
//         getServices();
//         fetchDealers();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     const handleBikeChange = (index, e) => {
//         const { name, value } = e.target;
//         const updatedBikes = [...bikes];
//         updatedBikes[index][name] = value;
//         setBikes(updatedBikes);
//     };

//     const addBikeField = () => {
//         setBikes([...bikes, { cc: "", price: "" }]);
//     };

//     const removeBikeField = (index) => {
//         setBikes(bikes.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const form = new FormData();
//         form.append("name", formData.name);
//         form.append("description", formData.description);
//         form.append("dealer_id", selectedDealer);
//         form.append("bikes", JSON.stringify(bikes));

//         if (image) {
//             form.append("image", image);
//         }

//         try {
//             const response = await axios.put(
//                 // `https://travel-backend-dc16.onrender.com/bikedoctor/service/updateAdditionalService/${id}`,
//                 `https://api.mrbikedoctor.cloud/bikedoctor/service/updateAdditionalService/${id}`,
//                 form,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );
//             Swal.fire({
//                 title: "Success!",
//                 text: response.data.message || "Service updated successfully.",
//                 icon: "success",
//             });

//             if (response?.status === 200) {
//                 navigate("/additionalservices");
//             }
//         } catch (error) {
//             Swal.fire({
//                 title: "Error!",
//                 text: error.response?.data?.message || "Something went wrong!",
//                 icon: "error",
//             });
//         }
//     };

//     return (
//         <div className="page-wrapper">
//             <div className="content container-fluid">
//                 <div className="page-header">
//                     <div className="content-page-header">
//                         <h5>Edit Service</h5>
//                         <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
//                             <i className="fas fa-arrow-left me-2"></i> Back
//                         </button>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <div className="card-table card p-3">
//                             <div className="card-body">
//                                 <form className="form-horizontal" onSubmit={handleSubmit}>
//                                     {/* Service Name */}
//                                     <div className="input-block mb-3">
//                                         <label className="form-control-label">Service Name</label>
//                                         <input
//                                             className="form-control"
//                                             name="name"
//                                             type="text"
//                                             value={formData.name}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     {/* Description */}
//                                     <div className="input-block mb-3">
//                                         <label className="form-control-label">Description</label>
//                                         <textarea
//                                             className="form-control"
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleChange}
//                                             required
//                                         ></textarea>
//                                     </div>

//                                     {/* Dealer Dropdown */}
//                                     <div className="input-block mb-3">
//                                         <label className="form-control-label">Select Dealer</label>
//                                         <select
//                                             className="form-control"
//                                             value={selectedDealer}
//                                             onChange={(e) => setSelectedDealer(e.target.value)}
//                                             required
//                                         >
//                                             <option value="">Select a Dealer</option>
//                                             {dealers.length > 0 ? (
//                                                 dealers.map((dealer) => (
//                                                     <option key={dealer._id} value={dealer._id}>
//                                                         {dealer.shopName}
//                                                     </option>
//                                                 ))
//                                             ) : (
//                                                 <option disabled>No dealers available</option>
//                                             )}
//                                         </select>
//                                     </div>

//                                     {/* Bike CC & Price Fields */}
//                                     <div className="input-block mb-3">
//                                         <label className="form-control-label">Bike CC & Price</label>
//                                         {bikes.map((bike, index) => (
//                                             <div key={index} className="d-flex mb-2">
//                                                 <input
//                                                     className="form-control me-2"
//                                                     type="number"
//                                                     name="cc"
//                                                     placeholder="Bike CC"
//                                                     value={bike.cc}
//                                                     onChange={(e) => handleBikeChange(index, e)}
//                                                     required
//                                                 />
//                                                 <input
//                                                     className="form-control me-2"
//                                                     type="number"
//                                                     name="price"
//                                                     placeholder="Price"
//                                                     value={bike.price}
//                                                     onChange={(e) => handleBikeChange(index, e)}
//                                                     required
//                                                 />
//                                                 {index > 0 && (
//                                                     <button type="button" className="btn btn-danger" onClick={() => removeBikeField(index)}>
//                                                         X
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         ))}
//                                         <button type="button" className="btn btn-success mt-2" onClick={addBikeField}>
//                                             Add More
//                                         </button>
//                                     </div>

//                                     {/* Upload Image */}
//                                     <div className="input-block mb-3">
//                                         <label className="form-control-label">Upload Service Image</label>
//                                         <input
//                                             type="file"
//                                             className="form-control"
//                                             name="image"
//                                             onChange={handleFileChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="form-group col-lg-12 mb-3">
//                                         <button className="btn btn-primary mt-4 mb-5" type="submit">
//                                             Update
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default EditAdditionService
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getDealerList } from "../../api";
import ImagePreview from "../../components/Global/ImagePreview";
import axios from "axios";

const EditAdditionService = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [bikes, setBikes] = useState([{ cc: "", price: "" }]);
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialImage, setInitialImage] = useState(null); // show existing image if needed

    useEffect(() => {
        // if id changes, refetch
        if (!id) return;

        let mounted = true;

        const getServices = async () => {
            try {
                const res = await axios.get(
                    // `https://travel-backend-dc16.onrender.com/bikedoctor/service/getAdditionalService/${id}`
                    `https://api.mrbikedoctor.cloud/bikedoctor/service/getAdditionalService/${id}`
                );

                if (!mounted) return;

                if (res?.status === 200) {
                    const data = res.data?.data || {};
                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                    });
                    setBikes(Array.isArray(data.bikes) && data.bikes.length ? data.bikes : [{ cc: "", price: "" }]);
                    setSelectedDealer(data.dealer_id?._id || "");
                    setInitialImage(data.image || null);
                } else {
                    Swal.fire("Error", res?.data?.message || "Failed to fetch service", "error");
                }
            } catch (error) {
                console.error("getServices error:", error);
                Swal.fire("Error", error.response?.data?.message || "Failed to fetch service", "error");
            }
        };

        const fetchDealers = async () => {
            try {
                const response = await getDealerList();
                // assume API returns { data: [...] }
                setDealers(response?.data || []);
            } catch (error) {
                console.error("Failed to fetch dealers", error);
                setDealers([]);
            }
        };

        getServices();
        fetchDealers();

        return () => {
            mounted = false;
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
    };

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setImage(f || null);
    };

    const handleBikeChange = (index, e) => {
        const { name, value } = e.target;
        setBikes((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [name]: value };
            return copy;
        });
    };

    const addBikeField = () => setBikes((prev) => [...prev, { cc: "", price: "" }]);

    const removeBikeField = (index) => {
        // keep at least one
        setBikes((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            Swal.fire("Validation", "Service name is required", "warning");
            return false;
        }
        if (!selectedDealer) {
            Swal.fire("Validation", "Please select a dealer", "warning");
            return false;
        }
        // bikes validation: cc and price > 0
        for (let i = 0; i < bikes.length; i++) {
            const cc = Number(bikes[i].cc);
            const price = Number(bikes[i].price);
            if (!Number.isFinite(cc) || cc <= 0) {
                Swal.fire("Validation", `Bike #${i + 1}: CC must be a number > 0`, "warning");
                return false;
            }
            if (!Number.isFinite(price) || price <= 0) {
                Swal.fire("Validation", `Bike #${i + 1}: Price must be a number > 0`, "warning");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append("dealer_id", selectedDealer);
            form.append("bikes", JSON.stringify(bikes));

            // only append if user selected a new image on edit
            if (image) form.append("image", image);

            // DO NOT set Content-Type manually — axios will set boundary for multipart
            const base =  "https://api.mrbikedoctor.cloud";
            const response = await axios.put(`${base}/bikedoctor/service/updateAdditionalService/${id}`, form, {
                // no custom Content-Type header
                timeout: 20000
            });

            Swal.fire("Success", response.data.message || "Service updated successfully.", "success");
            if (response?.status === 200) navigate("/additionalservices");
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error", error.response?.data?.message || "Something went wrong!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5>Edit Service</h5>
                        <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left me-2" /> Back
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
                                            className="form-control"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Description</label>
                                        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                                    </div>

                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Select Dealer</label>
                                        <select className="form-control" value={selectedDealer} onChange={(e) => setSelectedDealer(e.target.value)} required>
                                            <option value="">Select a Dealer</option>
                                            {dealers.length > 0 ? (
                                                dealers.map((dealer) => (
                                                    <option key={dealer._id} value={dealer._id}>
                                                        {dealer.shopName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No dealers available</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="input-block mb-3">
                                        <label className="form-control-label">Bike CC & Price</label>
                                        {bikes.map((bike, index) => (
                                            <div key={index} className="d-flex mb-2">
                                                <input
                                                    className="form-control me-2"
                                                    type="number"
                                                    name="cc"
                                                    placeholder="Bike CC"
                                                    value={bike.cc}
                                                    onChange={(e) => handleBikeChange(index, e)}
                                                    required
                                                />
                                                <input
                                                    className="form-control me-2"
                                                    type="number"
                                                    name="price"
                                                    placeholder="Price"
                                                    value={bike.price}
                                                    onChange={(e) => handleBikeChange(index, e)}
                                                    required
                                                />
                                                {index > 0 && (
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
                                        <label className="form-control-label">Upload Service Image (optional)</label>
                                        <input type="file" className="form-control" name="image" onChange={handleFileChange} />
                                        {initialImage && !image && (
                                            <small className="text-muted">Current image: {<ImagePreview image={initialImage} /> }</small>
                                        )}
                                    </div>

                                    <div className="form-group col-lg-12 mb-3">
                                        <button className="btn btn-primary mt-4 mb-5" type="submit" disabled={loading}>
                                            {loading ? "Updating..." : "Update Service"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAdditionService;
