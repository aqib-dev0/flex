# Flex Living Review System

A comprehensive review management system for Flex Living properties, featuring review normalization, approval workflows, and insightful dashboards.

## Project Overview

This application is a full-stack solution that handles the normalization and presentation of property reviews from multiple sources (Hostaway, Google). It provides property managers with tools to approve reviews, analyze trends, and gain insights into customer feedback.

Key features:
- Normalization of review data from different sources into a consistent schema
- Portfolio dashboard with property performance metrics
- Property-level dashboards with detailed analytics
- Review approval workflow
- Public property pages with manager-approved reviews
- Integration with Google Reviews (currently mocked)

## Tech Stack

### Backend
- **NestJS**: Modern, TypeScript-based framework for building scalable server-side applications
- **TypeScript**: For type-safe code that is easier to maintain and debug
- **Jest**: For comprehensive unit and integration testing
- **Supertest**: For API endpoint testing

### Frontend
- **Next.js**: React framework with SSR/SSG capabilities
- **TypeScript**: For type-safe frontend code
- **Tailwind CSS**: For rapid UI development with utility classes
- **Chart.js/React-chartjs-2**: For data visualization
- **React Testing Library**: For component testing

### Persistence
- **In-memory storage**: Currently using Map objects for data persistence (for demo purposes)
- Could be easily extended to use SQLite/lowdb or any other database

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd flex-living-review-system
```

2. Install dependencies
```bash
npm install
```

3. Seed review data
```bash
npm run seed:reviews
```

4. Start the development servers
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend server on http://localhost:3000

## API Behavior

### Endpoints

#### GET /api/reviews/hostaway
- Retrieves and normalizes reviews from Hostaway
- Returns JSON array of normalized reviews
- Handles missing/null fields gracefully

#### GET /api/reviews/google?placeId={placeId}
- Retrieves and normalizes reviews from Google
- Requires a placeId parameter
- Returns JSON array of normalized reviews

#### PATCH /api/reviews/:id
- Updates the approval status of a review
- Accepts a JSON body with `approved` boolean field
- Returns the updated review

#### POST /api/reviews/bulk
- Bulk updates multiple reviews' approval status
- Accepts a JSON body with `ids` array and `approved` boolean
- Returns a summary of the update operation

### Normalized Review Schema

```typescript
{
  "id": "7453",                            // Unique review ID
  "listingId": "123456",                   // Property/listing ID
  "listingName": "2B N1 A - 29 Shoreditch Heights",  // Property name
  "reviewer": "Shane Finkelstein",         // Name of reviewer
  "type": "host-to-guest",                 // Type of review
  "status": "published",                   // Review status
  "rating": 9.5,                           // Overall rating (0-10)
  "categories": {                          // Category-specific ratings
    "cleanliness": 10,
    "communication": 10,
    "respect_house_rules": 10
  },
  "text": "Shane and family are wonderful! Would definitely host again :)",
  "submittedAt": "2020-08-21T22:45:14Z",   // ISO timestamp
  "channel": "hostaway",                   // Original channel
  "approved": false,                       // Manager approval status
  "source": "hostaway",                    // Source system
  "raw": {...}                             // Original raw data
}
```

### Google Reviews Integration

For a production implementation, Google Reviews integration would require:

- **Google Places API**: Specifically the Place Details API with the `reviews` field
- **API Key**: A Google Cloud Platform API key with Places API enabled
- **Billing Account**: Required for Google Cloud Platform API usage

Required parameters:
- `placeId`: The unique identifier for a location in Google Maps
- `key`: Your API key

For this implementation, we've mocked the Google Reviews integration for demonstration purposes, but the code architecture allows for easy replacement with the actual API integration.

## Running Tests

Run all tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:cov
```

Run backend tests only:
```bash
cd backend && npm run test
```

Run frontend tests only:
```bash
cd frontend && npm run test
```

## Sample curl commands

### Get Hostaway Reviews
```bash
curl http://localhost:3001/api/reviews/hostaway
```

### Get Google Reviews
```bash
curl http://localhost:3001/api/reviews/google?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4
```

### Approve a Review
```bash
curl -X PATCH http://localhost:3001/api/reviews/7453 \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'
```

### Bulk Update Reviews
```bash
curl -X POST http://localhost:3001/api/reviews/bulk \
  -H "Content-Type: application/json" \
  -d '{"ids": ["7453", "8932"], "approved": true}'
```

## Project Structure

- `backend/`: NestJS backend application
  - `src/`: Source code
    - `reviews/`: Reviews module with controllers, services, and normalizers
    - `data/`: Mock data for development
- `frontend/`: Next.js frontend application
  - `src/`: Source code
    - `app/`: Next.js 13+ app directory structure
    - `components/`: React components
    - `lib/`: Utility functions and API clients
    - `types/`: TypeScript type definitions
- `scripts/`: Utility scripts including data seeding

## Future Enhancements

- Implement actual database persistence (e.g., SQLite, PostgreSQL)
- Add user authentication and role-based access control
- Implement real Google Reviews integration
- Add CSV export functionality
- Implement sentiment analysis for review text
- Add scheduled weekly reports
