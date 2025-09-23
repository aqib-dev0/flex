import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { HostawayNormalizer } from '../normalizers/hostaway.normalizer';
import { Review, NormalizedReviewsResponse } from '../interfaces/review.interface';
import * as fs from 'fs';
import * as path from 'path';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let hostawayNormalizer: HostawayNormalizer;

  const mockHostawayNormalizer = {
    normalizeMany: jest.fn(),
    normalize: jest.fn(),
  };

  // Mock file system
  const mockReadFileSync = jest.spyOn(fs, 'readFileSync');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: HostawayNormalizer,
          useValue: mockHostawayNormalizer,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    hostawayNormalizer = module.get<HostawayNormalizer>(HostawayNormalizer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHostawayReviews', () => {
    it('should return normalized Hostaway reviews', async () => {
      // Arrange
      const rawHostawayReviews = [
        {
          id: '7453',
          reservationId: '61432',
          messageId: null,
          listingMapId: '123456',
          listingName: '2B N1 A - 29 Shoreditch Heights',
          reviewer: {
            id: '9872',
            name: 'Shane Finkelstein',
            picture: 'https://hostaway.com/users/shane.jpg',
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
            experience: 8,
          },
          channel: 'hostaway',
          createdTime: '2020-08-21T22:45:14.000Z',
          updatedTime: '2020-08-22T10:15:05.000Z',
        },
      ];

      const normalizedReviews: Review[] = [
        {
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
            experience: 8,
          },
          text: 'Shane and family are wonderful! Would definitely host again :)',
          submittedAt: '2020-08-21T22:45:14.000Z',
          channel: 'hostaway',
          approved: false,
          source: 'hostaway',
          raw: rawHostawayReviews[0],
        },
      ];

      mockReadFileSync.mockReturnValue(JSON.stringify(rawHostawayReviews));
      mockHostawayNormalizer.normalizeMany.mockReturnValue(normalizedReviews);

      // Act
      const result = await service.getHostawayReviews();

      // Assert
      expect(mockReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining('hostaway/reviews.json'),
        'utf8',
      );
      expect(mockHostawayNormalizer.normalizeMany).toHaveBeenCalledWith(
        rawHostawayReviews,
      );
      expect(result.reviews).toEqual(normalizedReviews);
      expect(result.meta.total).toBe(1);
      expect(result.meta.source).toBe('hostaway');
    });

    it('should handle empty reviews', async () => {
      // Arrange
      mockReadFileSync.mockReturnValue(JSON.stringify([]));
      mockHostawayNormalizer.normalizeMany.mockReturnValue([]);

      // Act
      const result = await service.getHostawayReviews();

      // Assert
      expect(result.reviews).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should handle file read errors', async () => {
      // Arrange
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act & Assert
      await expect(service.getHostawayReviews()).rejects.toThrow();
    });

    it('should handle JSON parse errors', async () => {
      // Arrange
      mockReadFileSync.mockReturnValue('invalid JSON');

      // Act & Assert
      await expect(service.getHostawayReviews()).rejects.toThrow();
    });
  });

  // Additional tests for other service methods would go here
});
