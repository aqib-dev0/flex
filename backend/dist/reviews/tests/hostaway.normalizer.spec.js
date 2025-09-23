"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hostaway_normalizer_1 = require("../normalizers/hostaway.normalizer");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('HostawayNormalizer', () => {
    let normalizer;
    (0, globals_1.beforeEach)(() => {
        normalizer = new hostaway_normalizer_1.HostawayNormalizer();
    });
    (0, globals_1.describe)('normalize', () => {
        (0, globals_1.it)('should normalize a valid Hostaway review', () => {
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
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result).toEqual({
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
        (0, globals_1.it)('should handle missing reviewer information', () => {
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
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result.reviewer).toBe('Unknown Reviewer');
            (0, globals_1.expect)(result.type).toBe('guest-to-host');
        });
        (0, globals_1.it)('should handle missing scores', () => {
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
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result.rating).toBe(0);
            (0, globals_1.expect)(result.categories).toEqual({});
        });
        (0, globals_1.it)('should handle missing or empty comment', () => {
            const rawReview = {
                id: '12345',
                listingMapId: '67890',
                listingName: 'Test Listing',
                reviewer: {
                    name: 'John Doe'
                },
                reviewerType: 'guest',
                status: 'VISIBLE',
                comment: '',
                score: {
                    general: 8.0
                },
                channel: 'airbnb',
                createdTime: '2022-01-01T00:00:00.000Z'
            };
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result.text).toBe('');
        });
        (0, globals_1.it)('should handle unknown status', () => {
            const rawReview = {
                id: '12345',
                listingMapId: '67890',
                listingName: 'Test Listing',
                reviewer: {
                    name: 'John Doe'
                },
                reviewerType: 'guest',
                status: 'UNKNOWN_STATUS',
                comment: 'Great stay!',
                score: {
                    general: 8.0
                },
                channel: 'airbnb',
                createdTime: '2022-01-01T00:00:00.000Z'
            };
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result.status).toBe('unknown');
        });
        (0, globals_1.it)('should handle invalid date formats', () => {
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
                createdTime: 'invalid-date'
            };
            const result = normalizer.normalize(rawReview);
            (0, globals_1.expect)(result.submittedAt).not.toBe('invalid-date');
            (0, globals_1.expect)(() => new Date(result.submittedAt)).not.toThrow();
        });
        (0, globals_1.it)('should throw error if review data is null', () => {
            (0, globals_1.expect)(() => normalizer.normalize(null)).toThrow('Review data is required');
        });
    });
    (0, globals_1.describe)('normalizeMany', () => {
        (0, globals_1.it)('should normalize an array of reviews', () => {
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
            const results = normalizer.normalizeMany(rawReviews);
            (0, globals_1.expect)(results.length).toBe(2);
            (0, globals_1.expect)(results[0].id).toBe('1');
            (0, globals_1.expect)(results[1].id).toBe('2');
        });
        (0, globals_1.it)('should filter out null or undefined reviews', () => {
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
            const results = normalizer.normalizeMany(rawReviews);
            (0, globals_1.expect)(results.length).toBe(2);
            (0, globals_1.expect)(results[0].id).toBe('1');
            (0, globals_1.expect)(results[1].id).toBe('2');
        });
        (0, globals_1.it)('should return empty array if input is not an array', () => {
            (0, globals_1.expect)(normalizer.normalizeMany(null)).toEqual([]);
            (0, globals_1.expect)(normalizer.normalizeMany(undefined)).toEqual([]);
            (0, globals_1.expect)(normalizer.normalizeMany({})).toEqual([]);
        });
    });
});
//# sourceMappingURL=hostaway.normalizer.spec.js.map