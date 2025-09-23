import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HostawayNormalizer } from './normalizers/hostaway.normalizer';
import { NormalizedReviewsResponse, Review, ReviewSource } from './interfaces/review.interface';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service handling review-related operations
 * Responsible for fetching, normalizing, and managing reviews from various sources
 */
@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private reviewsStore: Map<string, Review> = new Map();

  constructor(private readonly hostawayNormalizer: HostawayNormalizer) {}

  /**
   * Retrieves and normalizes Hostaway reviews
   * @returns NormalizedReviewsResponse containing normalized Hostaway reviews
   */
  async getHostawayReviews(): Promise<NormalizedReviewsResponse> {
    try {
      // In a real app, this would call an API or database
      // For this assignment, we'll read from a mock JSON file
      const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      
      // Parse the raw JSON data
      const rawReviews = JSON.parse(rawData);
      
      // Normalize the reviews using the HostawayNormalizer
      const normalizedReviews = this.hostawayNormalizer.normalizeMany(rawReviews);

      // Store the normalized reviews for later use (persistence)
      normalizedReviews.forEach(review => {
        this.reviewsStore.set(review.id, review);
      });

      // Return the normalized reviews and metadata
      return {
        reviews: normalizedReviews,
        meta: {
          total: normalizedReviews.length,
          source: 'hostaway',
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get Hostaway reviews: ${error}`);
      throw new Error(`Failed to get Hostaway reviews: ${error}`);
    }
  }

  /**
   * Retrieves and normalizes Google reviews
   * @param placeId Google Place ID to fetch reviews for
   * @returns NormalizedReviewsResponse containing normalized Google reviews
   */
  async getGoogleReviews(placeId: string): Promise<NormalizedReviewsResponse> {
    try {
      if (!placeId) {
        throw new Error('Place ID is required');
      }

      // For this assignment, we'll return a mock response
      // In a real application, this would call the Google Places API
      
      this.logger.log(`Fetching Google reviews for place ID: ${placeId}`);

      return {
        reviews: [],
        meta: {
          total: 0,
          source: 'google',
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get Google reviews: ${error}`);
      throw new Error(`Failed to get Google reviews: ${error}`);
    }
  }

  /**
   * Retrieves and combines all reviews from all sources
   * @returns NormalizedReviewsResponse containing all normalized reviews
   */
  async getAllReviews(): Promise<NormalizedReviewsResponse> {
    try {
      // Get reviews from all sources
      const hostawayResponse = await this.getHostawayReviews();
      // Other sources would be added here (e.g., Google)

      // Combine all reviews
      const allReviews = [...hostawayResponse.reviews];

      return {
        reviews: allReviews,
        meta: {
          total: allReviews.length,
          source: 'all',
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get all reviews: ${error}`);
      throw new Error(`Failed to get all reviews: ${error}`);
    }
  }

  /**
   * Updates a review's approval status
   * @param id Review ID
   * @param approved New approval status
   * @returns Updated review
   */
  async approveReview(id: string, approved: boolean): Promise<Review> {
    try {
      const review = this.reviewsStore.get(id);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      // Update the approval status
      const updatedReview = { ...review, approved };
      
      // Save the updated review in memory
      this.reviewsStore.set(id, updatedReview);

      // Persist changes to the JSON file
      const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const reviews = JSON.parse(rawData);

      // Find and update the review in the original data
      const reviewIndex = reviews.findIndex((r: any) => r.id === id);
      if (reviewIndex !== -1) {
        // Preserve original data structure while updating approval
        reviews[reviewIndex] = {
          ...reviews[reviewIndex],
          approved: approved
        };

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
      }

      return updatedReview;
    } catch (error) {
      this.logger.error(`Failed to approve review: ${error}`);
      throw error;
    }
  }

  /**
   * Bulk updates multiple reviews' approval status
   * @param ids Array of review IDs to update
   * @param approved New approval status
   * @returns Summary of the update operation
   */
  async bulkUpdateReviews(ids: string[], approved: boolean): Promise<{
    updated: number;
    failed: number;
    totalProcessed: number;
  }> {
    try {
      let updated = 0;
      let failed = 0;

      for (const id of ids) {
        try {
          await this.approveReview(id, approved);
          updated++;
        } catch (error) {
          failed++;
          this.logger.warn(`Failed to update review ${id}: ${error}`);
        }
      }

      return {
        updated,
        failed,
        totalProcessed: ids.length,
      };
    } catch (error) {
      this.logger.error(`Failed bulk update: ${error}`);
      throw new Error(`Failed bulk update: ${error}`);
    }
  }
}
