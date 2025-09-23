import { Review } from '../interfaces/review.interface';
export declare class HostawayNormalizer {
    normalize(rawReview: any): Review;
    normalizeMany(rawReviews: any[]): Review[];
    private getStringValue;
    private getReviewerName;
    private getReviewType;
    private getReviewStatus;
    private getRating;
    private getCategories;
    private getSubmittedAt;
}
