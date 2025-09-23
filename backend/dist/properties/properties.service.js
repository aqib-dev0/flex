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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var PropertiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let PropertiesService = PropertiesService_1 = class PropertiesService {
    constructor() {
        this.logger = new common_1.Logger(PropertiesService_1.name);
    }
    async getAllProperties() {
        try {
            const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const reviews = JSON.parse(rawData);
            const propertiesMap = new Map();
            reviews.forEach((review) => {
                const propertyId = review.listingMapId;
                if (!propertiesMap.has(propertyId)) {
                    propertiesMap.set(propertyId, {
                        id: propertyId,
                        name: review.listingName,
                        city: this.extractCity(review.listingName),
                        thumbnail: `https://picsum.photos/seed/prop${propertyId.slice(-1)}/400/300`,
                        averageRating: this.calculateAverageRating(reviews, propertyId),
                        reviewCount: this.countReviews(reviews, propertyId),
                        topCategory: this.findTopCategory(reviews, propertyId),
                        trending: this.determineTrending(reviews, propertyId)
                    });
                }
            });
            return Array.from(propertiesMap.values());
        }
        catch (error) {
            this.logger.error(`Failed to get properties: ${error}`);
            throw new Error(`Failed to get properties: ${error}`);
        }
    }
    async getPropertyById(id) {
        try {
            const properties = await this.getAllProperties();
            const property = properties.find(p => p.id === id);
            if (!property) {
                throw new common_1.NotFoundException(`Property with ID ${id} not found`);
            }
            return property;
        }
        catch (error) {
            this.logger.error(`Failed to get property by ID: ${error}`);
            throw error;
        }
    }
    extractCity(name) {
        const cityMappings = {
            'Shoreditch': 'London',
            'Central London': 'London',
            'Camden Town': 'London',
            'Manchester': 'Manchester',
            'Edinburgh': 'Edinburgh'
        };
        for (const [key, city] of Object.entries(cityMappings)) {
            if (name.includes(key)) {
                return city;
            }
        }
        return 'Unknown';
    }
    calculateAverageRating(reviews, propertyId) {
        const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
        const validRatings = propertyReviews
            .map(r => { var _a; return (_a = r.score) === null || _a === void 0 ? void 0 : _a.general; })
            .filter(rating => rating !== undefined && rating !== null);
        if (validRatings.length === 0)
            return 0;
        const avgRating = validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
        return Number(avgRating.toFixed(1));
    }
    countReviews(reviews, propertyId) {
        return reviews.filter(r => r.listingMapId === propertyId).length;
    }
    findTopCategory(reviews, propertyId) {
        var _a;
        const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
        const categoryCounts = {};
        propertyReviews.forEach(review => {
            if (review.score) {
                Object.keys(review.score)
                    .filter(key => key !== 'general')
                    .forEach(category => {
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });
            }
        });
        const topCategory = (_a = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])[0]) === null || _a === void 0 ? void 0 : _a[0];
        return topCategory || 'N/A';
    }
    determineTrending(reviews, propertyId) {
        const propertyReviews = reviews.filter(r => r.listingMapId === propertyId);
        const ratings = propertyReviews
            .map(r => { var _a; return (_a = r.score) === null || _a === void 0 ? void 0 : _a.general; })
            .filter(rating => rating !== undefined && rating !== null);
        if (ratings.length < 2)
            return 'stable';
        const trend = ratings[ratings.length - 1] - ratings[0];
        if (trend > 1)
            return 'up';
        if (trend < -1)
            return 'down';
        return 'stable';
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = PropertiesService_1 = __decorate([
    (0, common_1.Injectable)()
], PropertiesService);
//# sourceMappingURL=properties.service.js.map