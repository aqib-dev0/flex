export interface Review {
    id: string;
    listingId: string;
    listingName: string;
    reviewer: string;
    type: ReviewType;
    status: ReviewStatus;
    rating: number;
    categories: ReviewCategories;
    text: string;
    submittedAt: string;
    channel: string;
    approved: boolean;
    source: ReviewSource;
    raw: Record<string, any>;
}
export type ReviewType = 'host-to-guest' | 'guest-to-host' | 'public' | 'unknown';
export type ReviewStatus = 'published' | 'pending' | 'draft' | 'deleted' | 'unknown';
export type ReviewSource = 'hostaway' | 'google' | 'unknown';
export interface ReviewCategories {
    cleanliness?: number;
    communication?: number;
    check_in?: number;
    accuracy?: number;
    location?: number;
    value?: number;
    respect_house_rules?: number;
    [key: string]: number | undefined;
}
export interface NormalizedReviewsResponse {
    reviews: Review[];
    meta: {
        total: number;
        source: ReviewSource | 'all';
    };
}
