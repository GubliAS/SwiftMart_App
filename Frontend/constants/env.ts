// API environment config
// Change this value for development/production as needed

// Use EXPO_PUBLIC_API_URL from .env for backend integration
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"; // Set this in your .env file

// Usage:
// import { BASE_URL } from "@/constants/env";
// fetch(`${BASE_URL}/api/your-endpoint`) 