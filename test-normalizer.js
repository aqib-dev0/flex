/**
 * Simple test script for the Hostaway normalizer
 * This demonstrates the review normalization functionality without needing a full NestJS server
 */
const fs = require('fs');
const path = require('path');

// Mock implementation of the HostawayNormalizer class based on our TypeScript implementation
class HostawayNormalizer {
  /**
   * Normalizes a single Hostaway review
   * @param {Object} rawReview The raw Hostaway review data
   * @returns {Object} A normalized Review object
   */
  normalize(rawReview) {
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
      source: 'hostaway',
      raw: rawReview, // Store the original raw data
    };
  }

  /**
   * Normalizes an array of Hostaway reviews
   * @param {Array} rawReviews Array of raw Hostaway reviews
   * @returns {Array} Array of normalized Review objects
   */
  normalizeMany(rawReviews) {
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
  getStringValue(value, defaultValue = '') {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return String(value);
  }

  /**
   * Extracts the reviewer name from the reviewer object
   */
  getReviewerName(reviewer) {
    if (!reviewer || !reviewer.name) {
      return 'Unknown Reviewer';
    }
    return this.getStringValue(reviewer.name);
  }

  /**
   * Maps Hostaway reviewer types to our standardized ReviewType
   */
  getReviewType(reviewerType) {
    if (!reviewerType) {
      return 'unknown';
    }

    const typeMap = {
      'host': 'host-to-guest',
      'guest': 'guest-to-host'
    };

    return typeMap[reviewerType.toLowerCase()] || 'unknown';
  }

  /**
   * Maps Hostaway status to our standardized ReviewStatus
   */
  getReviewStatus(status) {
    if (!status) {
      return 'unknown';
    }

    const statusMap = {
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
  getRating(score) {
    if (!score || typeof score.general !== 'number') {
      return 0;
    }
    return Number(score.general);
  }

  /**
   * Maps Hostaway score categories to our standardized ReviewCategories
   */
  getCategories(score) {
    if (!score) {
      return {};
    }

    const categories = {};
    const categoryMap = {
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
  getSubmittedAt(createdTime) {
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

// Main function to run the test
async function runTest() {
  try {
    console.log('🔍 Testing Hostaway Review Normalization');
    
    // Read the raw Hostaway reviews from the data file
    const filePath = path.join(__dirname, 'backend/src/data/hostaway/reviews.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const rawReviews = JSON.parse(rawData);
    
    console.log(`📊 Found ${rawReviews.length} raw reviews to normalize\n`);
    
    // Create a new normalizer and normalize the reviews
    const normalizer = new HostawayNormalizer();
    const normalizedReviews = normalizer.normalizeMany(rawReviews);
    
    // Create a response object like the API would return
    const response = {
      reviews: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        source: 'hostaway'
      }
    };
    
    // Print an example normalized review
    console.log('✅ Example of a normalized review:');
    console.log(JSON.stringify(normalizedReviews[0], null, 2));
    
    console.log(`\n🎉 Successfully normalized ${normalizedReviews.length} reviews`);
    console.log('\n📝 Response structure that would be returned by the API:');
    console.log(JSON.stringify({
      reviews: '[array of normalized reviews]',
      meta: response.meta
    }, null, 2));
    
    // Test handling edge cases
    console.log('\n🧪 Testing handling of edge cases:');
    
    // Test with null reviewer
    const nullReviewerTest = normalizer.normalize({
      id: '12345',
      listingMapId: '67890',
      listingName: 'Test Listing',
      reviewer: null,
      reviewerType: 'guest',
      status: 'VISIBLE',
      comment: 'Great stay!',
      score: { general: 8.0 },
      createdTime: '2022-01-01T00:00:00.000Z'
    });
    
    console.log('✅ Handling null reviewer:', nullReviewerTest.reviewer === 'Unknown Reviewer' ? 'PASSED' : 'FAILED');
    
    // Test with missing scores
    const missingScoresTest = normalizer.normalize({
      id: '12345',
      listingMapId: '67890',
      listingName: 'Test Listing',
      reviewer: { name: 'John' },
      reviewerType: 'guest',
      status: 'VISIBLE',
      comment: 'Great stay!',
      score: null,
      createdTime: '2022-01-01T00:00:00.000Z'
    });
    
    console.log('✅ Handling missing scores:', missingScoresTest.rating === 0 && 
      Object.keys(missingScoresTest.categories).length === 0 ? 'PASSED' : 'FAILED');
      
    // Test with unknown status
    const unknownStatusTest = normalizer.normalize({
      id: '12345',
      listingMapId: '67890',
      listingName: 'Test Listing',
      reviewer: { name: 'John' },
      reviewerType: 'guest',
      status: 'UNKNOWN_STATUS',
      comment: 'Great stay!',
      score: { general: 8.0 },
      createdTime: '2022-01-01T00:00:00.000Z'
    });
    
    console.log('✅ Handling unknown status:', unknownStatusTest.status === 'unknown' ? 'PASSED' : 'FAILED');
    
    return response;
  } catch (error) {
    console.error('❌ Error testing normalizer:', error);
    throw error;
  }
}

// Run the test
runTest().catch(console.error);
