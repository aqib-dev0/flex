"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const hostaway_normalizer_1 = require("../normalizers/hostaway.normalizer");
const fs = __importStar(require("fs"));
const reviews_service_1 = require("../reviews.service");
describe('ReviewsService', () => {
    let service;
    let hostawayNormalizer;
    const mockHostawayNormalizer = {
        normalizeMany: jest.fn(),
        normalize: jest.fn(),
    };
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                reviews_service_1.ReviewsService,
                {
                    provide: hostaway_normalizer_1.HostawayNormalizer,
                    useValue: mockHostawayNormalizer,
                },
            ],
        }).compile();
        service = module.get(reviews_service_1.ReviewsService);
        hostawayNormalizer = module.get(hostaway_normalizer_1.HostawayNormalizer);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getHostawayReviews', () => {
        it('should return normalized Hostaway reviews', async () => {
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
            const normalizedReviews = [
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
            const result = await service.getHostawayReviews();
            expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('hostaway/reviews.json'), 'utf8');
            expect(mockHostawayNormalizer.normalizeMany).toHaveBeenCalledWith(rawHostawayReviews);
            expect(result.reviews).toEqual(normalizedReviews);
            expect(result.meta.total).toBe(1);
            expect(result.meta.source).toBe('hostaway');
        });
        it('should handle empty reviews', async () => {
            mockReadFileSync.mockReturnValue(JSON.stringify([]));
            mockHostawayNormalizer.normalizeMany.mockReturnValue([]);
            const result = await service.getHostawayReviews();
            expect(result.reviews).toEqual([]);
            expect(result.meta.total).toBe(0);
        });
        it('should handle file read errors', async () => {
            mockReadFileSync.mockImplementation(() => {
                throw new Error('File not found');
            });
            await expect(service.getHostawayReviews()).rejects.toThrow();
        });
        it('should handle JSON parse errors', async () => {
            mockReadFileSync.mockReturnValue('invalid JSON');
            await expect(service.getHostawayReviews()).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=reviews.service.spec.js.map