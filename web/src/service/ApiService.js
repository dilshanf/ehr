import axios from "axios";
import { useUserStore } from '@/store/user';

// Create an Axios instance with a base URL


// Function to login
export const loginUser = async (email, password) => {
  try {

    var apiClient = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: false
      });

    const userStore = useUserStore()
    // Fetch CSRF cookie
    await apiClient.get('/sanctum/csrf-cookie')

    const response = await apiClient
        .post("/api/auth/login", {
            withCredentials: true,
            email: email,
            password: password
        })
        userStore.setUserDetails(response)

        const response1 = await apiClient
        .get("/api/users", {
            withCredentials: true
        })

    return response.data; // Return response data to the component
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUsers = async (email, password) => {
    try {
  
      const response = await apiClient
          .get("/api/users")
  
      return response.data; // Return response data to the component
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };
