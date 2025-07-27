import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '@/constants/env';

// Types for better type safety
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount?: number;
  rating: string;
  productImage: string;
  condition: string;
  categoryId: number;
  barcode?: string;
  createdAt?: string;
  updatedAt?: string;
  variants?: any[];
  shippingOptions?: any[];
  reviews?: any[];
}

export interface Review {
  id: number;
  orderedProductId: number;
  ratingValue: number;
  rating: number; // Add rating property for frontend compatibility
  comment: string;
  productId: number;
  userId: number;
  images?: string[];
  date: string;
  reviewerName?: string;
}

export interface ShippingOption {
  id: number;
  type: string;
  duration: string;
  price: number;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  name?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Safe API URL construction with fallback
const getApiUrl = () => {
  // Try to get BASE_URL from env, fallback to localhost
  const baseUrl = `${BASE_URL.replace(':8080', ':8097')}`; // Product service runs on 8097
  return `${baseUrl}/api/products`;
};

const getReviewsApiUrl = () => {
  const baseUrl = `${BASE_URL.replace(':8080', ':8087')}`; // User review service runs on 8087
  return `${baseUrl}/api/reviews`;
};

export const API_URL = getApiUrl();
export const REVIEWS_API_URL = getReviewsApiUrl();

// Axios instance with better configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const reviewsClient = axios.create({
  baseURL: REVIEWS_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Generic error handler
const handleApiError = (error: any, operation: string): never => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
  console.error(`[${operation}] Error:`, errorMessage);
  throw new Error(`${operation} failed: ${errorMessage}`);
};

// Enhanced API functions with better error handling and type safety

export async function fetchProducts(page = 0, size = 20): Promise<Product[]> {
  try {
    const response = await apiClient.get('', { 
      params: { page, size } 
    });
    
    // Handle both paginated and non-paginated responses
    const products = response.data.content || response.data;
    
    if (!Array.isArray(products)) {
      throw new Error('Invalid response format: expected array of products');
    }
    
    return products;
  } catch (error) {
    return handleApiError(error, 'fetchProducts');
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
    if (!id || isNaN(id)) {
      throw new Error('Invalid product ID');
    }
    
    const response = await apiClient.get(`/${id}`);
    const product = response.data;
    
    // Fetch reviews in parallel
    const reviewsResponse = await Promise.allSettled([
      fetchProductReviews(id)
    ]);
    
    // Add reviews to product
    if (reviewsResponse[0].status === 'fulfilled') {
      product.reviews = reviewsResponse[0].value;
    }
    
    // Shipping options are now included in the product response from backend
    // If no shipping options are returned, provide defaults
    if (!product.shippingOptions || product.shippingOptions.length === 0) {
      product.shippingOptions = getDefaultShippingOptions(id);
    }
    
    return product;
  } catch (error) {
    return handleApiError(error, 'fetchProductById');
  }
}

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  try {
    if (!productId || isNaN(productId)) {
      throw new Error('Invalid product ID');
    }
    
    // Try to get reviews from the backend using the new endpoint
    const response = await reviewsClient.get(`/by-product/${productId}`);
    const reviews = response.data || [];
    
    // Transform backend review structure to frontend expected structure
    const transformedReviews = reviews.map((review: any) => ({
      id: review.id,
      orderedProductId: review.orderedProductId,
      ratingValue: review.ratingValue,
      rating: review.ratingValue, // Map ratingValue to rating for frontend compatibility
      comment: review.comment,
      productId: review.productId,
      userId: review.userId,
      images: review.images || [],
      date: review.date ? new Date(review.date).toLocaleDateString() : 'Unknown date',
      reviewerName: `User ${review.userId}` // Generate a placeholder name since backend doesn't provide it
    }));
    
    return transformedReviews;
  } catch (error) {
    console.error('[fetchProductReviews] Error:', error);
    return []; // Return empty array if API fails
  }
}

// Helper function to get default shipping options based on product ID
function getDefaultShippingOptions(productId: number): ShippingOption[] {
  // Return standard shipping options - only Standard and Express
  const baseOptions = [
    { type: 'Standard', duration: '5-10 days', price: 0 },
    { type: 'Express', duration: '2-5 days', price: 9.99 }
  ];
  
  return baseOptions.map((option, index) => ({
    id: index + 1, // Simple sequential IDs
    type: option.type,
    duration: option.duration,
    price: option.price
  }));
}



export async function fetchProductsByCategory(categoryName: string): Promise<Product[]> {
  try {
    if (!categoryName || typeof categoryName !== 'string') {
      throw new Error('Invalid category name');
    }
    
    const response = await apiClient.get(`/category/${encodeURIComponent(categoryName)}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetchProductsByCategory');
  }
}

export async function fetchProductsByCategoryId(categoryId: number): Promise<Product[]> {
  try {
    if (!categoryId || isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    
    const response = await apiClient.get(`/category/id/${categoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetchProductsByCategoryId');
  }
}

export async function fetchProductsBySearch(query: string): Promise<Product[]> {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid search query');
    }
    
    const response = await apiClient.get('/search', { 
      params: { query } 
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetchProductsBySearch');
  }
}

export async function searchProducts(params: ProductSearchParams): Promise<Product[]> {
  try {
    const response = await apiClient.get('/search', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'searchProducts');
  }
}

export async function fetchProductsByBarcode(barcode: string): Promise<Product> {
  try {
    if (!barcode || typeof barcode !== 'string') {
      throw new Error('Invalid barcode');
    }
    
    const response = await apiClient.get(`/barcode/${encodeURIComponent(barcode)}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetchProductsByBarcode');
  }
}

export async function fetchSpecialOffers(): Promise<Product[]> {
  try {
    // Get all products and filter for those with discounts
    const allProducts = await fetchProducts(0, 1000);
    return allProducts.filter(product => product.discount && product.discount > 0);
  } catch (error) {
    return handleApiError(error, 'fetchSpecialOffers');
  }
}

// Utility function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get('', { params: { page: 0, size: 1 } });
    return true;
  } catch (error) {
    console.error('[API Health Check] Failed:', error);
    return false;
  }
}

// Export the API URL for debugging
export { API_URL as PRODUCT_API_URL }; 
export default {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchProductsByCategoryId,
  fetchProductsBySearch,
  searchProducts,
  fetchProductsByBarcode,
  fetchProductReviews,
}