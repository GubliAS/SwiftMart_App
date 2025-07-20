import { Platform } from 'react-native';

// API environment config
// Change this value for development/production as needed

// Use EXPO_PUBLIC_API_URL from .env for backend integration
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For physical devices on the same network, use the computer's IP address
  // This works for both Android and iOS physical devices
  return "http://10.10.10.98:8080"; // Direct to auth service
};

export const BASE_URL = getBaseUrl();

// Usage:
// import { BASE_URL } from "@/constants/env";
// fetch(`${BASE_URL}/api/your-endpoint`) 