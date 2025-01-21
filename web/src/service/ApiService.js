import axios from "axios";
import { useUserStore } from '@/store/user';

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
//   withCredentials: true, // Ensures CSRF cookies are sent
});

// Function to login
export const loginUser = async (email, password) => {
  try {

    const userStore = useUserStore()
    // Fetch CSRF cookie
    await apiClient.get('/sanctum/csrf-cookie');
    const response = await apiClient
        .post("/api/auth/login", {
            email: email,
            password: password
        })
        // .then((response) => {
        //     
            
        //     return response.data
        //     console.log(response.data)
        //     if (response.data.user.id === 2) {
        //         // admin user
        //         router.push('/dashboard');
        //     } else {
        //         // patient
        //     }
        // })
        userStore.setUserDetails(response)

    return response.data; // Return response data to the component
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUsers = async (email, password) => {
    try {
  
      const response = await apiClient
          .post("/users", {
              email: email,
              password: password
          })
          // .then((response) => {
          //     
              
          //     return response.data
          //     console.log(response.data)
          //     if (response.data.user.id === 2) {
          //         // admin user
          //         router.push('/dashboard');
          //     } else {
          //         // patient
          //     }
          // })
          userStore.setUserDetails(response)
  
      return response.data; // Return response data to the component
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };
