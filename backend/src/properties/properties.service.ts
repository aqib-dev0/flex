import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  /**
   * Get all properties from the data source
   * @returns Array of properties
   */
  async getAllProperties() {
    try {
      // In a real app, this would come from a database
      // For now, we'll derive properties from review data
      const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const reviews = JSON.parse(rawData);

      // Extract unique properties from reviews
      const propertiesMap = new Map();

      reviews.forEach((review: any) => {
        const propertyId = review.listingMapId;
        if (!propertiesMap.has(propertyId)) {
          propertiesMap.set(propertyId, {
            id: propertyId,
            name: review.listingName,
            city: this.extractCity(review.listingName),
            thumbnail: `https://picsum.photos/seed/prop${propertyId.slice(-1)}/400/300`,
            averageRating: this.calculateAverageRating(reviews, propertyId),
            reviewCount: this.countReviews(reviews, propertyId),
            topCategory: this.findTopCategory(reviews, propertyId),
            trending: this.determineTrending(reviews, propertyId)
          });
        }
      });

      return Array.from(propertiesMap.values());
    } catch (error) {
      this.logger.error(`Failed to get properties: ${error}`);
      throw new Error(`Failed to get properties: ${error}`);
    }
  }

  /**
   * Get a specific property by ID
   * @param id Property ID
   * @returns Detailed property information
   */
  async getPropertyById(id: string) {
    try {
      const properties = await this.getAllProperties();
      const property = properties.find(p => p.id === id);

      if (!property) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      return property;
    } catch (error) {
      this.logger.error(`Failed to get property by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Extract city from property name
   */
  private extractCity(name: string): string {
    const cityMappings: {[key: string]: string} = {
      'Shoreditch': 'London',
      'Central London': 'London',
      'Camden Town': 'London',
      'Manchester': 'Manchester',
      'Edinburgh': 'Edinburgh'
    };

    for (const [key, city] of Object.entries(cityMappings)) {
      if (name.includes(key)) {
        return city;
      }
    }

    return 'Unknown';
  }

  /**
   * Calculate average rating for a property
   */
  private calculateAverageRating(reviews: any[], propertyId: string): number {
    const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
    const validRatings = propertyReviews
      .map(r => r.score?.general)
      .filter(rating => rating !== undefined && rating !== null);

    if (validRatings.length === 0) return 0;

    const avgRating = validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
    return Number(avgRating.toFixed(1));
  }

  /**
   * Count reviews for a property
   */
  private countReviews(reviews: any[], propertyId: string): number {
    return reviews.filter(r => r.listingMapId === propertyId).length;
  }

  /**
   * Find top category for a property
   */
  private findTopCategory(reviews: any[], propertyId: string): string {
    const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
    const categoryCounts: {[key: string]: number} = {};

    propertyReviews.forEach(review => {
      if (review.score) {
        Object.keys(review.score)
          .filter(key => key !== 'general')
          .forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
      }
    });

    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    return topCategory || 'N/A';
  }

  /**
   * Determine trending status for a property
   */
  private determineTrending(reviews: any[], propertyId: string): 'up' | 'down' | 'stable' {
    const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
    const ratings = propertyReviews
      .map(r => r.score?.general)
      .filter(rating => rating !== undefined && rating !== null);

    if (ratings.length < 2) return 'stable';

    const trend = ratings[ratings.length - 1] - ratings[0];
    if (trend > 1) return 'up';
    if (trend < -1) return 'down';
    return 'stable';
  }
}
