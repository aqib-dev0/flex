"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reviews_controller_1 = require("../reviews.controller");
const reviews_service_1 = require("../reviews.service");
require("@types/jest");
describe('ReviewsController', () => {
    let controller;
    let service;
    const mockReviewsService = {
        getHostawayReviews: jest.fn(),
        getGoogleReviews: jest.fn(),
        getAllReviews: jest.fn(),
        approveReview: jest.fn(),
        bulkUpdateReviews: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [reviews_controller_1.ReviewsController],
            providers: [
                {
                    provide: reviews_service_1.ReviewsService,
                    useValue: mockReviewsService,
                },
            ],
        }).compile();
        controller = module.get(reviews_controller_1.ReviewsController);
        service = module.get(reviews_service_1.ReviewsService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('getHostawayReviews', () => {
        it('should return normalized Hostaway reviews', async () => {
            const mockReview = {
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
                raw: {}
            };
            const expectedResponse = {
                reviews: [mockReview],
                meta: {
                    total: 1,
                    source: 'hostaway'
                }
            };
            mockReviewsService.getHostawayReviews.mockResolvedValue(expectedResponse);
            const result = await controller.getHostawayReviews();
            expect(result).toEqual(expectedResponse);
            expect(mockReviewsService.getHostawayReviews).toHaveBeenCalled();
        });
        it('should handle errors gracefully', async () => {
            const errorMessage = 'Failed to fetch reviews';
            mockReviewsService.getHostawayReviews.mockRejectedValue(new Error(errorMessage));
            await expect(controller.getHostawayReviews()).rejects.toThrow(errorMessage);
        });
        it('should handle empty review array', async () => {
            const expectedResponse = {
                reviews: [],
                meta: {
                    total: 0,
                    source: 'hostaway'
                }
            };
            mockReviewsService.getHostawayReviews.mockResolvedValue(expectedResponse);
            const result = await controller.getHostawayReviews();
            expect(result).toEqual(expectedResponse);
            expect(result.reviews).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });
    });
});
//# sourceMappingURL=reviews.controller.spec.js.map