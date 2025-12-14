import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = 'https://api.mrbikedoctor.cloud/bikedoctor';
// const API_BASE_URL = 'http://localhost:8001/bikedoctor';

// test 

const getAuthToken = () => localStorage.getItem("adminToken");

const apiRequest = async (method, endpoint, data = {}, showAlert = true, requiresAuth = true) => {
  try {
    const headers = {};

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) headers["token"] = token;
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    if (requiresAuth && error.response?.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please log in again.",
      });
      localStorage.removeItem("token");
    }

    if (showAlert) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }

    throw error;
  }
};

export const loginUser = (email, password) =>
  apiRequest("POST", "/adminauth/suadminLogin", { email, password }, true, false);

export const createUser = (userData) =>
  apiRequest("POST", "/adminauth/subadminsignup", userData);

export const getAdmins = () =>
  apiRequest("GET", "/adminauth/getalladmin", {}, false);

export const deleteAdmin = (adminId) =>
  apiRequest("DELETE", `/adminauth/deleteadmin/${adminId}`, { admin_id: adminId });

export const addDealer = async (dealerData) => {
  try {
    console.log("Dealer data here api section:-",dealerData);
    
    const response = await axios.post(
      `${API_BASE_URL}/dealer/addDealer`,
      dealerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Dealer Added Successfully!",
      text: response.data.message || "The dealer has been created.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding dealer:", error.response?.data || error.message);
    Swal.fire({
      icon: "error",
      title: "Failed to Add Dealer",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const updateDealer = async (formData) => {
  try {
    console.log("Form data:", formData);

    const response = await axios.put(
      `${API_BASE_URL}/dealer/editDealer`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating dealer:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Failed to Update Dealer",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const getDealerList = () =>
  apiRequest("GET", "/dealer/dealerList", {}, false);

export const getAllDealersWithVerifyFalse = () =>
  apiRequest("GET", "/dealer/dealersWithVerifyFalse", {}, false);

export const getAllDealersWithDocFalse = () =>
  apiRequest("GET", "/dealer/dealersWithDocFalse", {}, false)

export const updateDealerVerification = async (dealerId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/dealer/updateVerification`,
      { id: dealerId },
      {
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating dealer:", error.response?.data || error.message);
    throw error;
  }
};

export const updateDealerDocStatus = async (dealerId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/dealer/updateDocStatus`,
      { id: dealerId },
      {
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),  // Pass token in headers
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating dealer:", error.response?.data || error.message);
    throw error;
  }
};

export const getCustomerList = () =>
  apiRequest("GET", "/customers/customerlist", {}, false);

export const getAllBookings = () =>
  apiRequest("GET", "/bookings/getallbookings", {}, false);

export const getAllPayment = () =>
  apiRequest("GET", "/payment/all-payments", {}, false);


export const addBikeCompany = (data) =>
  apiRequest("POST", "/bike/add-bike-company", data, true, true);

export const addBikeModel = (data) =>
  apiRequest("POST", "/bike/add-bike-model", data, true, true);

export const addBikeVariant = (data) =>
  apiRequest("POST", "/bike/add-bike-variant", data, true, true);

// ✅ Fetch all bike companies (for dropdown)
export const getBikeCompanies = () => apiRequest("GET", "/bike/get-bike-companies", {}, false);

// ✅ Fetch all bike models for a selected company (for dropdown)
export const getBikeModels = (companyId) => apiRequest("GET", `/bike/get-bike-models/${companyId}`, {}, false);

// ✅ Fetch all bike variants for a selected model (for dropdown)
export const getBikeVariants = (modelId) => apiRequest("GET", `/bike/get-bike-variants/${modelId}`, {}, false);


// ✅ Fetch all bikes
export const getBikes = () => apiRequest("GET", "/bike/bikes", {}, false);

export const deleteBike = async (bikeId) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
const userId = userData?._id;


    if (!userId) {
      Swal.fire("Error", "Admin ID missing. Please login again.", "error");
      return;
    }

    const response = await axios.delete(
      `${API_BASE_URL}/bike/deleteBike/${userId}`,
      {
        data: { bike_id: bikeId },
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: response.data.message || "Bike deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete Bike",
    });

    throw error;
  }
};


export const addService = async (serviceData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/service/addservice`,  // ✅ API base URL
      // `http://:8001/bikedoctor/service/addservice`,  // ✅ API base URL
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(),  // ✅ Ensure correct token header
        },
      }
    );

    // ✅ Show success message
    Swal.fire({
      icon: "success",
      title: "Service Added Successfully!",
      text: response.data.message || "The service has been created.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding service:", error.response?.data || error.message);

    // ✅ Show proper error message
    Swal.fire({
      icon: "error",
      title: "Failed to Add Service",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const AaddService = async (serviceData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/service/addservice`,  // ✅ API base URL
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(),  // ✅ Ensure correct token header
        },
      }
    );

    // ✅ Show success message
    Swal.fire({
      icon: "success",
      title: "Service Added Successfully!",
      text: response.data.message || "The service has been created.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding service:", error.response?.data || error.message);

    // ✅ Show proper error message
    Swal.fire({
      icon: "error",
      title: "Failed to Add Service",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const getServiceList = () => apiRequest("GET", "/service/servicelist", {}, false);
export const getAServiceList = () => apiRequest("GET", "/service/servicelist", {}, false);

export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/service/deleteService`,
      {
        data: { service_id: serviceId },  // DELETE with body
        headers: {
          "Content-Type": "application/json",  // Not multipart/form-data
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Service deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete service",
    });

    throw error;
  }
};


export const addBanner = async (bannerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/banner/addbanner`,  // ✅ API base URL
      bannerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(),  // ✅ Ensure correct token header
        },
      }
    );

    // ✅ Show success message
    Swal.fire({
      icon: "success",
      title: "Banner Added Successfully!",
      text: response.data.message || "The banner has been created.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding banner:", error.response?.data || error.message);

    // ✅ Show proper error message
    Swal.fire({
      icon: "error",
      title: "Failed to Add Banner",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

// ✅ Fetch all banners
export const getBannerList = () => apiRequest("GET", "/banner/bannerlist", {}, false);

export const deleteBanner = async (bannerId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/banner/deletebanner`,
      {
        data: { banner_id: bannerId },  // DELETE with body
        headers: {
          "Content-Type": "application/json",  // Not multipart/form-data
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Banner deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete banner",
    });

    throw error;
  }
};


export const getAllRewards = () => apiRequest("GET", "/reward/rewards", {}, false);

export const getOffers = () => apiRequest("GET", "/offer/offerlist", {}, false);

export const deleteOffers = async (offerId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/offer/deleteoffer`,
      {
        data: { offer_id: offerId },  // DELETE with body
        headers: {
          "Content-Type": "application/json",  // Not multipart/form-data
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Offer deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete Offer",
    });

    throw error;
  }
};

export const editDealer = async (dealerData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/dealer/editDealer`,
      dealerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": getAuthToken(), 
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Dealer Updated Successfully!",
      text: response.data.message || "Dealer info has been updated.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating dealer:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Failed to Update Dealer",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};


export const deleteDealer = async (dealerId) => {
  try {
    console.log("Deleaer id",dealerId);
    
    const response = await axios.delete(
      // `${API_BASE_URL}/dealer/deleteDealer`,
      `${API_BASE_URL}/dealer/deleteDealer`,
      {
        data: { dealer_id: dealerId },
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Dealer deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete dealer",
    });

    throw error;
  }
};

export const deleteCustomer = async (dealerId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/customers/deletecustomer`,
      {
        data: { customer_id: dealerId },  // DELETE with body
        headers: {
          "Content-Type": "application/json",  // Not multipart/form-data
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Dealer deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error.response?.data?.message || "Could not delete dealer",
    });

    throw error;
  }
};

export const getDealerPayouts = () => apiRequest("GET", "/dealer/pending", {}, false);


export const approveDealerPayout = (orderId, status = "APPROVED") =>
  apiRequest("POST", "/payment/approvePayout", { orderId, status });


export const addOffer = async (offerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/offer/addoffer`,
      offerData,
      {
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Offer Added Successfully!",
      text: response.data.message || "The offer has been created.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding offer:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Failed to Add Offer",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const getServices = () =>
  apiRequest("GET", "/service/adminservices", {}, false);

export const getOfferById = async (id) =>
  apiRequest("GET", `/offer/Singleoffer/${id}`, {}, false);


export const editOffer = async (id, offerData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/offer/editoffer/${id}`,
      offerData,
      {
        headers: {
          "Content-Type": "application/json",
          "token": getAuthToken(),
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Offer Updated Successfully!",
      text: response.data.message || "The offer has been updated.",
      timer: 2000,
      showConfirmButton: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating offer:", error.response?.data || error.message);

    Swal.fire({
      icon: "error",
      title: "Failed to Update Offer",
      text: error.response?.data?.message || "Something went wrong!",
    });

    throw error;
  }
};

export const getDealersVerify = () =>
  apiRequest("GET", "/dealerAuth/pending-registrations", {}, false);