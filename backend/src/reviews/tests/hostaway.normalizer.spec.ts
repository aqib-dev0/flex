import { HostawayNormalizer } from '../normalizers/hostaway.normalizer';
import { Review, ReviewType, ReviewStatus } from '../interfaces/review.interface';
import { expect, describe, beforeEach, it } from '@jest/globals';

describe('HostawayNormalizer', () => {
  let normalizer: HostawayNormalizer;

  beforeEach(() => {
    normalizer = new HostawayNormalizer();
  });

  describe('normalize', () => {
    it('should normalize a valid Hostaway review', () => {
      // Arrange
      const rawReview = {
        id: '7453',
        reservationId: '61432',
        messageId: null,
        listingMapId: '123456',
        listingName: '2B N1 A - 29 Shoreditch Heights',
        reviewer: {
          id: '9872',
          name: 'Shane Finkelstein',
          picture: 'https://hostaway.com/users/shane.jpg'
        },
        reviewerType: 'host',
        hostId: '1234',
        guestId: '9872',
        type: 'RESERVATION',
        status: 'VISIBLE',
        comment: 'Shane and family are wonderful! Would definitely host again :)',
        privateComment: 'They left the place very clean, great communication.',
        score: {
          general: 9.5,
          cleanliness: 10,
          communication: 10,
          respect_house_rules: 10,
          experience: 8
        },
        channel: 'hostaway',
        createdTime: '2020-08-21T22:45:14.000Z',
        updatedTime: '2020-08-22T10:15:05.000Z'
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result).toEqual({
        id: '7453',
        listingId: '123456',
        listingName: '2B N1 A - 29 Shoreditch Heights',
        reviewer: 'Shane Finkelstein',
        type: 'host-to-guest',
        status: 'published',
        rating: 9.5,
        categories: {
          cleanliness: 10,
          communication: 10,
          respect_house_rules: 10,
          experience: 8
        },
        text: 'Shane and family are wonderful! Would definitely host again :)',
        submittedAt: '2020-08-21T22:45:14.000Z',
        channel: 'hostaway',
        approved: false,
        source: 'hostaway',
        raw: rawReview
      });
    });

    it('should handle missing reviewer information', () => {
      // Arrange
      const rawReview = {
        id: '12345',
        listingMapId: '67890',
        listingName: 'Test Listing',
        reviewer: null,
        reviewerType: 'guest',
        status: 'VISIBLE',
        comment: 'Great stay!',
        score: {
          general: 8.0
        },
        channel: 'airbnb',
        createdTime: '2022-01-01T00:00:00.000Z'
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result.reviewer).toBe('Unknown Reviewer');
      expect(result.type).toBe('guest-to-host');
    });

    it('should handle missing scores', () => {
      // Arrange
      const rawReview = {
        id: '12345',
        listingMapId: '67890',
        listingName: 'Test Listing',
        reviewer: {
          name: 'John Doe'
        },
        reviewerType: 'guest',
        status: 'VISIBLE',
        comment: 'Great stay!',
        score: null,
        channel: 'airbnb',
        createdTime: '2022-01-01T00:00:00.000Z'
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result.rating).toBe(0);
      expect(result.categories).toEqual({});
    });

    it('should handle missing or empty comment', () => {
      // Arrange
      const rawReview = {
        id: '12345',
        listingMapId: '67890',
        listingName: 'Test Listing',
        reviewer: {
          name: 'John Doe'
        },
        reviewerType: 'guest',
        status: 'VISIBLE',
        comment: '',  // Empty comment
        score: {
          general: 8.0
        },
        channel: 'airbnb',
        createdTime: '2022-01-01T00:00:00.000Z'
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result.text).toBe('');
    });

    it('should handle unknown status', () => {
      // Arrange
      const rawReview = {
        id: '12345',
        listingMapId: '67890',
        listingName: 'Test Listing',
        reviewer: {
          name: 'John Doe'
        },
        reviewerType: 'guest',
        status: 'UNKNOWN_STATUS',  // Unknown status
        comment: 'Great stay!',
        score: {
          general: 8.0
        },
        channel: 'airbnb',
        createdTime: '2022-01-01T00:00:00.000Z'
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result.status).toBe('unknown');
    });

    it('should handle invalid date formats', () => {
      // Arrange
      const rawReview = {
        id: '12345',
        listingMapId: '67890',
        listingName: 'Test Listing',
        reviewer: {
          name: 'John Doe'
        },
        reviewerType: 'guest',
        status: 'VISIBLE',
        comment: 'Great stay!',
        score: {
          general: 8.0
        },
        channel: 'airbnb',
        createdTime: 'invalid-date'  // Invalid date
      };

      // Act
      const result = normalizer.normalize(rawReview);

      // Assert
      expect(result.submittedAt).not.toBe('invalid-date');
      // Should be a valid ISO date string
      expect(() => new Date(result.submittedAt)).not.toThrow();
    });

    it('should throw error if review data is null', () => {
      // Act & Assert
      expect(() => normalizer.normalize(null as any)).toThrow('Review data is required');
    });
  });

  describe('normalizeMany', () => {
    it('should normalize an array of reviews', () => {
      // Arrange
      const rawReviews = [
        {
          id: '1',
          listingMapId: '123',
          listingName: 'Listing 1',
          reviewer: { name: 'User 1' },
          reviewerType: 'guest',
          status: 'VISIBLE',
          comment: 'Review 1',
          score: { general: 9.0 },
          channel: 'airbnb',
          createdTime: '2022-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          listingMapId: '456',
          listingName: 'Listing 2',
          reviewer: { name: 'User 2' },
          reviewerType: 'host',
          status: 'VISIBLE',
          comment: 'Review 2',
          score: { general: 8.5 },
          channel: 'booking',
          createdTime: '2022-02-01T00:00:00.000Z'
        }
      ];

      // Act
      const results = normalizer.normalizeMany(rawReviews);

      // Assert
      expect(results.length).toBe(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('2');
    });

    it('should filter out null or undefined reviews', () => {
      // Arrange
      const rawReviews = [
        {
          id: '1',
          listingMapId: '123',
          listingName: 'Listing 1',
          reviewer: { name: 'User 1' },
          reviewerType: 'guest',
          status: 'VISIBLE',
          comment: 'Review 1',
          score: { general: 9.0 },
          channel: 'airbnb',
          createdTime: '2022-01-01T00:00:00.000Z'
        },
        null,
        undefined,
        {
          id: '2',
          listingMapId: '456',
          listingName: 'Listing 2',
          reviewer: { name: 'User 2' },
          reviewerType: 'host',
          status: 'VISIBLE',
          comment: 'Review 2',
          score: { general: 8.5 },
          channel: 'booking',
          createdTime: '2022-02-01T00:00:00.000Z'
        }
      ];

      // Act
      const results = normalizer.normalizeMany(rawReviews as any);

      // Assert
      expect(results.length).toBe(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('2');
    });

    it('should return empty array if input is not an array', () => {
      // Act & Assert
      expect(normalizer.normalizeMany(null as any)).toEqual([]);
      expect(normalizer.normalizeMany(undefined as any)).toEqual([]);
      expect(normalizer.normalizeMany({} as any)).toEqual([]);
    });
  });
});
