import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserData {
  username?: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  street_name?: string;
  postal_code?: string;
  city?: string;
  house_number?: string;
}

export const register = (userData: UserData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (userData: UserData) => {
  return axios.post(`${API_URL}/login`, userData);
};
