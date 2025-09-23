import { Test, TestingModule } from '@nestjs/testing';
import { NormalizedReviewsResponse } from '../interfaces/review.interface';
import { ReviewsController } from '../reviews.controller';
import { ReviewsService } from '../reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReviewsService = {
    getHostawayReviews: jest.fn(),
    getGoogleReviews: jest.fn(),
    getAllReviews: jest.fn(),
    approveReview: jest.fn(),
    bulkUpdateReviews: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHostawayReviews', () => {
    it('should return normalized Hostaway reviews', async () => {
      // Arrange
      const expectedResponse: NormalizedReviewsResponse = {
        reviews: [
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
              experience: 8
            },
            text: 'Shane and family are wonderful! Would definitely host again :)',
            submittedAt: '2020-08-21T22:45:14.000Z',
            channel: 'hostaway',
            approved: false,
            source: 'hostaway',
            raw: {} // This would be the full raw data in reality
          }
        ],
        meta: {
          total: 1,
          source: 'hostaway'
        }
      };

      mockReviewsService.getHostawayReviews.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getHostawayReviews();

      // Assert
      expect(result).toBe(expectedResponse);
      expect(mockReviewsService.getHostawayReviews).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      mockReviewsService.getHostawayReviews.mockRejectedValue(new Error('Failed to fetch reviews'));

      // Act & Assert
      await expect(controller.getHostawayReviews()).rejects.toThrow('Failed to fetch reviews');
    });

    it('should handle empty review array', async () => {
      // Arrange
      const expectedResponse: NormalizedReviewsResponse = {
        reviews: [],
        meta: {
          total: 0,
          source: 'hostaway'
        }
      };

      mockReviewsService.getHostawayReviews.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getHostawayReviews();

      // Assert
      expect(result).toBe(expectedResponse);
      expect(result.reviews).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  // Additional tests for other controller methods would go here
});
