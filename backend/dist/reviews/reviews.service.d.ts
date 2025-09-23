import { HostawayNormalizer } from './normalizers/hostaway.normalizer';
import { NormalizedReviewsResponse, Review } from './interfaces/review.interface';
export declare class ReviewsService {
    private readonly hostawayNormalizer;
    private readonly logger;
    private reviewsStore;
    constructor(hostawayNormalizer: HostawayNormalizer);
    getHostawayReviews(): Promise<NormalizedReviewsResponse>;
    getGoogleReviews(placeId: string): Promise<NormalizedReviewsResponse>;
    getAllReviews(): Promise<NormalizedReviewsResponse>;
    approveReview(id: string, approved: boolean): Promise<Review>;
    bulkUpdateReviews(ids: string[], approved: boolean): Promise<{
        updated: number;
        failed: number;
        totalProcessed: number;
    }>;
}
