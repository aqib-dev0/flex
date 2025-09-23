"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostawayNormalizer = void 0;
class HostawayNormalizer {
    normalize(rawReview) {
        if (!rawReview) {
            throw new Error('Review data is required');
        }
        return {
            id: this.getStringValue(rawReview.id),
            listingId: this.getStringValue(rawReview.listingMapId),
            listingName: this.getStringValue(rawReview.listingName),
            reviewer: this.getReviewerName(rawReview.reviewer),
            type: this.getReviewType(rawReview.reviewerType),
            status: this.getReviewStatus(rawReview.status),
            rating: this.getRating(rawReview.score),
            categories: this.getCategories(rawReview.score),
            text: this.getStringValue(rawReview.comment),
            submittedAt: this.getSubmittedAt(rawReview.createdTime),
            channel: this.getStringValue(rawReview.channel, 'hostaway'),
            approved: false,
            source: 'hostaway',
            raw: rawReview,
        };
    }
    normalizeMany(rawReviews) {
        if (!Array.isArray(rawReviews)) {
            return [];
        }
        return rawReviews
            .filter(review => review !== null && review !== undefined)
            .map(review => this.normalize(review));
    }
    getStringValue(value, defaultValue = '') {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        return String(value);
    }
    getReviewerName(reviewer) {
        if (!reviewer || !reviewer.name) {
            return 'Unknown Reviewer';
        }
        return this.getStringValue(reviewer.name);
    }
    getReviewType(reviewerType) {
        if (!reviewerType) {
            return 'unknown';
        }
        const typeMap = {
            'host': 'host-to-guest',
            'guest': 'guest-to-host'
        };
        return typeMap[reviewerType.toLowerCase()] || 'unknown';
    }
    getReviewStatus(status) {
        if (!status) {
            return 'unknown';
        }
        const statusMap = {
            'VISIBLE': 'published',
            'HIDDEN': 'deleted',
            'DRAFT': 'draft'
        };
        return statusMap[status] || 'unknown';
    }
    getRating(score) {
        if (!score || typeof score.general !== 'number') {
            return 0;
        }
        return Number(score.general);
    }
    getCategories(score) {
        if (!score) {
            return {};
        }
        const categories = {};
        const categoryMap = {
            'cleanliness': 'cleanliness',
            'communication': 'communication',
            'check_in': 'check_in',
            'accuracy': 'accuracy',
            'location': 'location',
            'value': 'value',
            'respect_house_rules': 'respect_house_rules'
        };
        Object.keys(score).forEach(key => {
            if (key !== 'general' && typeof score[key] === 'number') {
                const mappedKey = categoryMap[key] || key;
                categories[mappedKey] = Number(score[key]);
            }
        });
        return categories;
    }
    getSubmittedAt(createdTime) {
        if (!createdTime) {
            return new Date().toISOString();
        }
        try {
            return new Date(createdTime).toISOString();
        }
        catch (error) {
            return new Date().toISOString();
        }
    }
}
exports.HostawayNormalizer = HostawayNormalizer;
//# sourceMappingURL=hostaway.normalizer.js.map