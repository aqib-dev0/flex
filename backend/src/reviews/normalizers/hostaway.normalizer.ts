import { Review, ReviewType, ReviewStatus, ReviewCategories, ReviewSource } from '../interfaces/review.interface';

/**
 * Normalizes Hostaway review data to the standardized format
 * Handles edge cases including null values, missing fields, etc.
 */
export class HostawayNormalizer {
  /**
   * Normalizes a single Hostaway review
   * @param rawReview The raw Hostaway review data
   * @returns A normalized Review object
   */
  normalize(rawReview: any): Review {
    if (!rawReview) {
      throw new Error('Review data is required');
    }

    return {
      id: this.getStringValue(rawReview.id),
      listingId: this.getStringValue(rawReview.listingMapId),
      listingName: this.getStringValue(rawReview.listingName),
      reviewer: this.getReviewerName(rawReview.reviewer),
      type: this.getReviewType(rawReview.reviewerType),
      status: this.getReviewStatus(rawReview.status),
      rating: this.getRating(rawReview.score),
      categories: this.getCategories(rawReview.score),
      text: this.getStringValue(rawReview.comment),
      submittedAt: this.getSubmittedAt(rawReview.createdTime),
      channel: this.getStringValue(rawReview.channel, 'hostaway'),
      approved: false, // Default to false as reviews need approval in our system
      source: 'hostaway' as ReviewSource,
      raw: rawReview, // Store the original raw data
    };
  }

  /**
   * Normalizes an array of Hostaway reviews
   * @param rawReviews Array of raw Hostaway reviews
   * @returns Array of normalized Review objects
   */
  normalizeMany(rawReviews: any[]): Review[] {
    if (!Array.isArray(rawReviews)) {
      return [];
    }
    
    return rawReviews
      .filter(review => review !== null && review !== undefined)
      .map(review => this.normalize(review));
  }

  /**
   * Safely extracts string values, providing a default if the value is missing
   */
  private getStringValue(value: any, defaultValue: string = ''): string {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return String(value);
  }

  /**
   * Extracts the reviewer name from the reviewer object
   */
  private getReviewerName(reviewer: any): string {
    if (!reviewer || !reviewer.name) {
      return 'Unknown Reviewer';
    }
    return this.getStringValue(reviewer.name);
  }

  /**
   * Maps Hostaway reviewer types to our standardized ReviewType
   */
  private getReviewType(reviewerType: string): ReviewType {
    if (!reviewerType) {
      return 'unknown';
    }

    const typeMap: Record<string, ReviewType> = {
      'host': 'host-to-guest',
      'guest': 'guest-to-host'
    };

    return typeMap[reviewerType.toLowerCase()] || 'unknown';
  }

  /**
   * Maps Hostaway status to our standardized ReviewStatus
   */
  private getReviewStatus(status: string): ReviewStatus {
    if (!status) {
      return 'unknown';
    }

    const statusMap: Record<string, ReviewStatus> = {
      'VISIBLE': 'published',
      'HIDDEN': 'deleted',
      'DRAFT': 'draft'
    };

    return statusMap[status] || 'unknown';
  }

  /**
   * Extracts the general rating from Hostaway scores
   * Defaults to 0 if no valid score is found
   */
  private getRating(score: any): number {
    if (!score || typeof score.general !== 'number') {
      return 0;
    }
    return Number(score.general);
  }

  /**
   * Maps Hostaway score categories to our standardized ReviewCategories
   */
  private getCategories(score: any): ReviewCategories {
    if (!score) {
      return {};
    }

    const categories: ReviewCategories = {};
    const categoryMap: Record<string, keyof ReviewCategories> = {
      'cleanliness': 'cleanliness',
      'communication': 'communication',
      'check_in': 'check_in',
      'accuracy': 'accuracy',
      'location': 'location',
      'value': 'value',
      'respect_house_rules': 'respect_house_rules'
    };

    // Map known categories and preserve any other categories
    Object.keys(score).forEach(key => {
      if (key !== 'general' && typeof score[key] === 'number') {
        const mappedKey = categoryMap[key] || key;
        categories[mappedKey] = Number(score[key]);
      }
    });

    return categories;
  }

  /**
   * Normalizes the timestamp format
   */
  private getSubmittedAt(createdTime: string): string {
    if (!createdTime) {
      return new Date().toISOString();
    }
    
    try {
      // Ensure consistent ISO format
      return new Date(createdTime).toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }
}
