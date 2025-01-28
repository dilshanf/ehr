import axios from "axios";
import { useUserStore } from '@/store/user';
import Cookies from 'js-cookie';

// Create an Axios instance with a base URL


// Function to login
export const loginUser = async (email, password) => {
  try {

    var apiClient = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true
      });

    const userStore = useUserStore()
    // Fetch CSRF cookie
    await apiClient.get('/sanctum/csrf-cookie')
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    const response = await apiClient
      .post("/login", {
          email: email,
          password: password
      },{
        headers: {
          "Accept": "application/json",  // Common header for Laravel
          "X-XSRF-TOKEN": xsrfToken
        }
      })
      userStore.setUserDetails(response)

      const response1 = await apiClient
      .get("/users", {
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
