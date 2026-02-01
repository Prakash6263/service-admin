import axios from "axios"
import Swal from "sweetalert2"

const API_BASE_URL = "https://api.mrbikedoctor.cloud/bikedoctor"

const getAuthToken = () => localStorage.getItem("adminToken")

const apiRequest = async (method, endpoint, data = {}, showAlert = true, requiresAuth = true) => {
  try {
    const headers = {}

    if (requiresAuth) {
      const token = getAuthToken()
      if (token) headers["token"] = token
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers,
    })
    return response.data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message)

    if (requiresAuth && error.response?.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please log in again.",
      })
      localStorage.removeItem("token")
    }

    if (showAlert) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      })
    }

    throw error
  }
}

/**
 * BASE ADDITIONAL SERVICE API
 */

// Get all base additional services for dropdown
export const getBaseAdditionalServices = () =>
  apiRequest("GET", "/base-additional-service", {}, false)

/**
 * ADMIN ADDITIONAL SERVICE API
 */

// Create a new additional service
export const createAdditionalService = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/additional-service/admin/additional-services`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          token: getAuthToken(),
        },
      }
    )

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Additional service created successfully",
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data
  } catch (error) {
    console.error("Error creating additional service:", error.response?.data || error.message)

    Swal.fire({
      icon: "error",
      title: "Failed to Create Service",
      text: error.response?.data?.message || "Something went wrong!",
    })

    throw error
  }
}

// Get all additional services
export const getAdditionalServices = () =>
  apiRequest("GET", "/additional-service/admin/additional-services", {}, false)

// Get a single additional service by ID
export const getAdditionalServiceById = (id) =>
  apiRequest("GET", `/additional-service/admin/additional-services/${id}`, {}, false)

// Update an additional service
export const updateAdditionalService = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/additional-service/admin/additional-services/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          token: getAuthToken(),
        },
      }
    )

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Additional service updated successfully",
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data
  } catch (error) {
    console.error("Error updating additional service:", error.response?.data || error.message)

    Swal.fire({
      icon: "error",
      title: "Failed to Update Service",
      text: error.response?.data?.message || "Something went wrong!",
    })

    throw error
  }
}

// Delete an additional service
export const deleteAdditionalService = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/additional-service/admin/additional-services/${id}`,
      {
        headers: {
          token: getAuthToken(),
        },
      }
    )

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message || "Additional service deleted successfully",
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data
  } catch (error) {
    console.error("Error deleting additional service:", error.response?.data || error.message)

    Swal.fire({
      icon: "error",
      title: "Failed to Delete Service",
      text: error.response?.data?.message || "Something went wrong!",
    })

    throw error
  }
}
