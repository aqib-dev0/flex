# Flex Living Reviews Dashboard - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Key Features](#key-features)
5. [API Documentation](#api-documentation)
6. [Data Normalization](#data-normalization)
7. [Google Reviews Integration](#google-reviews-integration)
8. [Setup Instructions](#setup-instructions)
9. [Implementation Details](#implementation-details)
10. [Future Enhancements](#future-enhancements)

## Project Overview

The Flex Living Reviews Dashboard is a comprehensive system for managing and displaying guest reviews for Flex Living properties. This tool helps property managers assess how each property is performing based on guest reviews from various platforms.

The system integrates with the Hostaway API to fetch review data, normalizes it for consistent display, and provides a user-friendly dashboard for property managers to monitor, filter, analyze trends, and approve reviews for public display on property detail pages.

### Project Requirements

The project was developed to meet the following requirements:

1. **Hostaway Integration (Mocked)**
   - Integration with the Hostaway Reviews API (sandboxed)
   - Handling and normalizing review data from provided JSON
   - Parsing and normalizing reviews by listing, review type, channel, and date

2. **Manager Dashboard**
   - User-friendly, modern dashboard interface
   - Per-property performance metrics
   - Filtering and sorting by rating, category, channel, and time
   - Trend spotting and issue identification
   - Review approval functionality for public display

3. **Review Display Page**
   - Replication of Flex Living website property details layout
   - Dedicated section for displaying approved guest reviews
   - Consistent design matching Flex Living style

4. **Google Reviews Integration**
   - Exploration of Google Places API integration
   - Findings and implementation recommendations

## Tech Stack

### Backend
- **NestJS**: Modern, TypeScript-based framework for building scalable server-side applications
- **TypeScript**: For type-safe code that is easier to maintain and debug
- **Jest**: For comprehensive unit and integration testing
- **Supertest**: For API endpoint testing

### Frontend
- **Next.js 13+**: React framework with App Router for modern React-based UI with SSR/SSG capabilities
- **TypeScript**: For type-safe frontend code and better developer experience
- **Tailwind CSS**: For styling and responsive design with utility classes
- **Chart.js/React-chartjs-2**: For data visualization of review metrics
- **Axios**: For API requests
- **React Testing Library**: For component testing

### Persistence
- **In-memory storage**: Currently using Map objects for data persistence (for demo purposes)
- Designed for easy extension to use SQLite/lowdb or any other database in production

## Architecture

The application follows a layered architecture designed for scalability, maintainability, and extensibility:

### Backend Architecture

1. **API Layer (Controllers)**
   - Handles HTTP requests and responses
   - Input validation and error handling
   - Routes to appropriate service methods
   - Located in `backend/src/reviews/reviews.controller.ts`

2. **Normalization Layer (Normalizers)**
   - Processes and standardizes data from different sources
   - Converts platform-specific formats to consistent internal schema
   - Handles edge cases and missing data
   - Located in `backend/src/reviews/normalizers/hostaway.normalizer.ts`

3. **Service Layer (Services)**
   - Implements business logic
   - Manages data retrieval, transformation, and storage
   - Handles approval workflow
   - Located in `backend/src/reviews/reviews.service.ts`

4. **Data Layer**
   - In-memory storage using Map (for demo purposes)
   - Mock data based on Hostaway API response format
   - Located in `backend/src/data/hostaway/reviews.json`

### Frontend Architecture

1. **Page Components**
   - Dashboard view for management (`frontend/src/app/dashboard/page.tsx`)
   - Property detail pages with approved reviews (`frontend/src/app/properties/[id]/page.tsx`)
   - Reviews overview page (`frontend/src/app/reviews/page.tsx`)

2. **API Client**
   - Centralized API communication
   - Type-safe request and response handling
   - Located in `frontend/src/lib/api.ts`

3. **Type Definitions**
   - Shared type interfaces for consistent data handling
   - Located in `frontend/src/types/review.ts`

## Key Features

### Manager Dashboard

The dashboard is designed to provide property managers with a comprehensive view of all review data and powerful tools to manage them:

- **Property-focused review management**
  - Reviews grouped by property for easy management
  - Quick links to property detail pages
  - Performance indicators for each property

- **Advanced filtering capabilities**
  - By rating (minimum threshold)
  - By review category (cleanliness, communication, etc.)
  - By channel (Airbnb, Booking.com, VRBO)
  - By date range (last 30 days, 90 days, 6 months, year, all time)

- **Approval Management**
  - Individual review approval/unapproval
  - Bulk approval/unapproval functionality
  - Clear visual indicators of approval status

- **Performance Insights**
  - Visual indicators of property trending performance (up/down)
  - Category ratings breakdown
  - Rating badges with color-coding (green, yellow, red)

### Property Details Page

Property detail pages showcase individual properties with their approved reviews:

- **Property Information Display**
  - Hero image with property name and location
  - Property description and key details
  - Average rating and review count

- **Ratings Breakdown**
  - Visual representation of ratings by category
  - Progress bars showing relative performance
  - Numeric scores for each category

- **Approved Reviews Display**
  - Only manager-approved reviews shown
  - Reviewer details, submission date, and channel
  - Full review text
  - Category-specific ratings

- **Visual Design**
  - Consistent with Flex Living branding
  - Clean, modern UI with appropriate spacing
  - Responsive layout for all device sizes

### Review Browsing

A dedicated reviews page for browsing all reviews across properties:

- **Comprehensive filtering options**
- **Sortable columns**
- **Bulk approval management**
- **Quick links to property pages**

## API Documentation

The system implements a RESTful API with the following endpoints:

### Reviews Endpoints

#### GET `/api/reviews/hostaway`
- **Description**: Retrieves and normalizes reviews from Hostaway
- **Parameters**: None
- **Response**: `NormalizedReviewsResponse` containing normalized Hostaway reviews
- **Status Codes**:
  - `200 OK`: Successfully retrieved reviews
  - `500 Internal Server Error`: Error retrieving reviews

```json
{
  "reviews": [
    {
      "id": "7453",
      "listingId": "123456",
      "listingName": "2B N1 A - 29 Shoreditch Heights",
      "reviewer": "Shane Finkelstein",
      "type": "host-to-guest",
      "status": "published",
      "rating": 10,
      "categories": {
        "cleanliness": 10,
        "communication": 10,
        "respect_house_rules": 10
      },
      "text": "Shane and family are wonderful! Would definitely host again :)",
      "submittedAt": "2020-08-21T22:45:14Z",
      "channel": "hostaway",
      "approved": false,
      "source": "hostaway",
      "raw": { /* Original raw data */ }
    }
  ],
  "meta": {
    "total": 1,
    "source": "hostaway"
  }
}
```

#### GET `/api/reviews/google`
- **Description**: Retrieves and normalizes reviews from Google Places API
- **Parameters**: 
  - `placeId` (query): The Google Place ID to fetch reviews for
- **Response**: `NormalizedReviewsResponse` containing normalized Google reviews
- **Status Codes**:
  - `200 OK`: Successfully retrieved reviews
  - `400 Bad Request`: Missing place ID
  - `500 Internal Server Error`: Error retrieving reviews

#### GET `/api/reviews`
- **Description**: Retrieves all reviews from all sources
- **Parameters**: None
- **Response**: `NormalizedReviewsResponse` containing all normalized reviews
- **Status Codes**:
  - `200 OK`: Successfully retrieved reviews
  - `500 Internal Server Error`: Error retrieving reviews

#### PATCH `/api/reviews/:id`
- **Description**: Updates a review's approval status
- **Parameters**:
  - `id` (path): The ID of the review to update
- **Request Body**:
```json
{
  "approved": true
}
```
- **Response**: The updated review
- **Status Codes**:
  - `200 OK`: Successfully updated review
  - `404 Not Found`: Review not found
  - `500 Internal Server Error`: Error updating review

#### POST `/api/reviews/bulk`
- **Description**: Bulk updates multiple reviews' approval status
- **Request Body**:
```json
{
  "ids": ["7453", "8932"],
  "approved": true
}
```
- **Response**: Summary of the update operation
```json
{
  "updated": 2,
  "failed": 0,
  "totalProcessed": 2
}
```
- **Status Codes**:
  - `200 OK`: Successfully processed bulk update
  - `500 Internal Server Error`: Error processing bulk update

## Data Normalization

A core feature of the system is its ability to normalize review data from different sources into a consistent format. This normalization is handled by source-specific normalizers.

### Normalized Review Schema

```typescript
interface Review {
  id: string;                       // Unique review ID
  listingId: string;                // Property/listing ID
  listingName: string;              // Property name
  reviewer: string;                 // Name of reviewer
  type: ReviewType;                 // host-to-guest, guest-to-host, public, unknown
  status: ReviewStatus;             // published, pending, draft, deleted, unknown
  rating: number;                   // Overall rating (0-10)
  categories: {                     // Category-specific ratings
    cleanliness?: number;
    communication?: number;
    check_in?: number;
    accuracy?: number;
    location?: number;
    value?: number;
    respect_house_rules?: number;
    [key: string]: number | undefined;
  };
  text: string;                     // Review text content
  submittedAt: string;              // ISO timestamp
  channel: string;                  // Original channel (e.g., airbnb, booking.com)
  approved: boolean;                // Manager approval status
  source: ReviewSource;             // hostaway, google, unknown
  raw: Record<string, any>;         // Original raw data
}
```

### Hostaway Normalization

The `HostawayNormalizer` handles the following transformations:

- Maps Hostaway-specific fields to standard schema
- Handles missing or null values with sensible defaults
- Converts rating scales to consistent 0-10 scale
- Normalizes timestamps to ISO format
- Preserves original data in the `raw` field
- Maps category-specific ratings to standard categories

## Google Reviews Integration

The integration with Google Places API for fetching Google reviews was explored as part of this project.

### Findings

1. **Feasibility**: Integration with Google Places API is technically feasible.
   
2. **Requirements**:
   - Google Cloud Platform account with Places API enabled
   - API key with appropriate restrictions
   - Place IDs for each Flex Living property
   - Billing account (Google charges for Places API usage)

3. **Implementation Path**:
   - Use the Place Details API with the `reviews` field
   - Create a Google normalizer similar to the Hostaway normalizer
   - Map Google review format to our normalized schema
   - Associate Google Place IDs with Flex Living properties

4. **API Endpoint**:
   ```
   https://maps.googleapis.com/maps/api/place/details/json
   ?place_id={PLACE_ID}
   &fields=name,rating,reviews
   &key={API_KEY}
   ```

5. **Challenges**:
   - Determining Place IDs for all properties
   - Managing API quota and costs
   - Handling Google's review format differences
   - Limited filtering options in the Google API

6. **Current Status**:
   - Basic structure for Google reviews integration is included in the codebase
   - Mock implementation is provided for demonstration
   - Full implementation would require additional configuration and testing

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository
```bash
git clone git@github.com:aqib-dev0/flex.git
cd flex
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

### Running Tests

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

## Implementation Details

### Review Approval System

The system implements a review approval mechanism where property managers can:
1. View all reviews in the dashboard
2. Select individual reviews or use bulk selection
3. Approve or unapprove reviews for public display
4. Only approved reviews appear on the public property pages

The approval status is persisted in the review data and used to filter which reviews appear on the public property pages.

### Data Flow

1. **Data Acquisition**:
   - Reviews are fetched from the Hostaway API (mocked in this implementation)
   - Reviews could also come from Google Places API (structure in place)

2. **Normalization**:
   - Source-specific normalizers convert to standard format
   - Edge cases and missing data are handled gracefully

3. **Data Storage**:
   - Normalized reviews are stored in-memory (Map objects)
   - Could be extended to use a database for persistence

4. **Review Management**:
   - Managers can filter, sort, and approve reviews
   - Approval status changes are persisted

5. **Public Display**:
   - Only approved reviews are displayed on property pages
   - Reviews are grouped and formatted for user-friendly display

### UI/UX Considerations

- **Clean, Intuitive Dashboard**:
  - Property-focused organization
  - Clear filtering controls
  - Visual indicators for ratings

- **Responsive Design**:
  - Adaptive layouts for desktop, tablet, and mobile
  - Appropriate typography and spacing

- **Visual Performance Indicators**:
  - Color-coded badges (green, yellow, red)
  - Progress bars for category ratings
  - Trend indicators (up, down, stable)

- **Filtering System**:
  - Intuitive controls for finding relevant reviews
  - Multiple filter dimensions (rating, category, channel, time)

- **Clear Approval Controls**:
  - Checkbox selection for individual or bulk approval
  - Visible indicators of approval status
  - Success/error messages for actions

### Performance Optimizations

- **Client-side Filtering**:
  - Reduces server load for common filtering operations
  - Improves responsiveness of the dashboard

- **Efficient Review Grouping**:
  - Reviews are grouped by property for easier management
  - Reduces data processing needs

- **Selective Loading**:
  - Only approved reviews are shown on public property pages
  - Reduces data transfer and rendering requirements

- **Type Safety**:
  - TypeScript interfaces ensure consistent data handling
  - Reduces runtime errors and improves maintainability

## Future Enhancements

Based on the current implementation and real-world usage requirements, several future enhancements could be considered:

1. **Database Integration**:
   - Implement actual database persistence (PostgreSQL, MongoDB, etc.)
   - Add caching layer for improved performance

2. **Authentication and Authorization**:
   - User authentication system
   - Role-based access control (admin, manager, viewer)
   - Multi-tenant support

3. **Enhanced Google Reviews Integration**:
   - Complete the Google Places API integration
   - Auto-fetch reviews on a schedule
   - Place ID management system

4. **Advanced Analytics**:
   - Sentiment analysis of review text
   - Trend analysis over time
   - Comparative analytics across properties

5. **Expanded Features**:
   - Response management for reviews
   - Email notifications for new reviews
   - Review response templates
   - CSV/PDF export functionality

6. **Operational Improvements**:
   - Scheduled weekly/monthly reports
   - Email digests of new reviews
   - Integration with property management systems
   - Mobile app for on-the-go management

7. **UI Enhancements**:
   - Dark mode support
   - Additional data visualizations
   - Customizable dashboard layouts
   - More detailed property performance metrics
