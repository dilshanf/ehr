import axios from "axios";
import { useUserStore } from '@/store/user';
import Cookies from 'js-cookie';
import router from '../router';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_SANCTUM_API_URL,
  withCredentials: true
});


// Function to login
export const loginUser = async (email, password) => {
  try {

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

    return response.data; // Return response data to the component
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getPagedUsers = async (params) => {

  params = JSON.parse(params.lazyEvent);

    try {
  
      var data = null;
      const response = await apiClient
          .get("/users", { params })
          .then((res) => data = res.data.data)
  
      return data; // Return response data to the component
    } catch (error) {
      if(error.status === 401) {
        router.push('/expired');
      }
      throw error.response ? error.response.data : error;
    }
  };
