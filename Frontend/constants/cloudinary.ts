// Cloudinary Configuration
// TODO: Replace 'your-cloud-name' with your actual Cloudinary cloud name
export const CLOUDINARY_CONFIG = {
  cloudName: 'dnbthgvlh', // ⚠️ REPLACE THIS with your actual cloud name from Cloudinary dashboard
  uploadPreset: 'swiftmart_profile', // This should match the preset you created
  apiUrl: 'https://api.cloudinary.com/v1_1',
};

// Helper function to get the full upload URL
export const getCloudinaryUploadUrl = () => {
  return `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, width = 300, height = 300) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/c_fill,w_${width},h_${height},f_auto,q_auto/${publicId}`;
};

// Validation function to check if configuration is set up
export const isCloudinaryConfigured = () => {
  return CLOUDINARY_CONFIG.cloudName && 
         CLOUDINARY_CONFIG.cloudName !== 'your-cloud-name' && 
         CLOUDINARY_CONFIG.cloudName.length > 0;
}; 