export declare class PropertiesService {
    private readonly logger;
    getAllProperties(): Promise<any[]>;
    getPropertyById(id: string): Promise<any>;
    private extractCity;
    private calculateAverageRating;
    private countReviews;
    private findTopCategory;
    private determineTrending;
}
