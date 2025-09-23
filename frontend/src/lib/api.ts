import axios from 'axios';
import { 
  Review, 
  NormalizedReviewsResponse,
  BulkUpdateRequest, 
  BulkUpdateResponse 
} from '@/types/review';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: '/api',  // This will be proxied to the backend in development
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const reviewsApi = {
  /**
   * Get normalized Hostaway reviews
   */
  getHostawayReviews: async (): Promise<NormalizedReviewsResponse> => {
    const response = await api.get<NormalizedReviewsResponse>('/reviews/hostaway');
    return response.data;
  },

  /**
   * Get normalized Google reviews for a specific place
   * @param placeId Google Place ID
   */
  getGoogleReviews: async (placeId: string): Promise<NormalizedReviewsResponse> => {
    const response = await api.get<NormalizedReviewsResponse>(`/reviews/google?placeId=${placeId}`);
    return response.data;
  },

  /**
   * Get all reviews from all sources
   */
  getAllReviews: async (): Promise<NormalizedReviewsResponse> => {
    const response = await api.get<NormalizedReviewsResponse>('/reviews');
    return response.data;
  },

  /**
   * Get reviews for a specific property
   * @param propertyId Property ID
   */
  getPropertyReviews: async (propertyId: string): Promise<NormalizedReviewsResponse> => {
    const response = await api.get<NormalizedReviewsResponse>(`/properties/${propertyId}/reviews`);
    return response.data;
  },

  /**
   * Update a review's approval status
   * @param reviewId Review ID
   * @param approved New approval status
   */
  approveReview: async (reviewId: string, approved: boolean): Promise<Review> => {
    const response = await api.patch<Review>(`/reviews/${reviewId}`, {
      approved,
    });
    return response.data;
  },

  /**
   * Bulk update multiple reviews' approval status
   * @param ids Array of review IDs
   * @param approved New approval status
   */
  bulkUpdateReviews: async (ids: string[], approved: boolean): Promise<BulkUpdateResponse> => {
    const request: BulkUpdateRequest = {
      ids,
      approved,
    };
    const response = await api.post<BulkUpdateResponse>('/reviews/bulk', request);
    return response.data;
  }
};

// API endpoint for properties
export const propertiesApi = {
  /**
   * Get all properties
   */
  getProperties: async () => {
    const response = await api.get('/properties');
    return response.data;
  },

  /**
   * Get a specific property by ID
   * @param propertyId Property ID
   */
  getProperty: async (propertyId: string) => {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data;
  }
};

export default api;
