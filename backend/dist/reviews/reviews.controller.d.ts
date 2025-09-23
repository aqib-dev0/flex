import { NormalizedReviewsResponse } from './interfaces/review.interface';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getHostawayReviews(): Promise<NormalizedReviewsResponse>;
    getGoogleReviews(placeId: string): Promise<NormalizedReviewsResponse>;
    getAllReviews(): Promise<NormalizedReviewsResponse>;
    approveReview(id: string, body: {
        approved: boolean;
    }): Promise<import("./interfaces/review.interface").Review>;
    bulkUpdateReviews(body: {
        ids: string[];
        approved: boolean;
    }): Promise<{
        updated: number;
        failed: number;
        totalProcessed: number;
    }>;
}
