# Flex Living Reviews Dashboard - Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Key Features](#key-features)
5. [API Integration](#api-integration)
6. [Google Reviews Integration](#google-reviews-integration)
7. [Implementation Details](#implementation-details)

## Overview
The Flex Living Reviews Dashboard is a comprehensive system for managing and displaying guest reviews for Flex Living properties. The system integrates with the Hostaway API to fetch review data, normalizes it for consistent display, and provides a user-friendly dashboard for property managers to monitor, filter, and approve reviews for public display.

## Tech Stack
### Frontend
- **Next.js 13+** with App Router for modern React-based UI
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for styling and responsive design
- **Axios** for API requests

### Backend
- **NestJS** for a robust and scalable API
- **TypeScript** for type safety and consistency
- **Jest** for testing

## Architecture
The application follows a layered architecture:

1. **API Layer**: Handles communication with external services (Hostaway API)
2. **Normalization Layer**: Processes and standardizes data from different sources
3. **Service Layer**: Manages business logic, data filtering, and approval status
4. **UI Layer**: Provides interfaces for both managers and end users

## Key Features

### Manager Dashboard
- Property-focused review management
- Advanced filtering capabilities:
  - By rating (minimum threshold)
  - By review category (cleanliness, communication, etc.)
  - By channel (Airbnb, Booking.com, VRBO)
  - By date range
- Bulk approval/unapproval of reviews
- Performance insights with visual indicators (trending up/down)
- Category ratings breakdown

### Property Details Page
- Property information display
- Ratings breakdown by category
- Display of approved guest reviews only
- Visual indicators of property performance

### Review Browsing
- Comprehensive filtering options
- Ability to view all reviews across all properties
- Quick links to property pages

## API Integration

### Hostaway Integration
The system integrates with the Hostaway API to fetch review data. Since the sandbox API contains no real reviews, a mock system has been implemented to provide realistic data based on the JSON format provided by Hostaway.

### Data Normalization
Reviews from different sources (Hostaway, Google) are normalized into a consistent format with the following attributes:
- Review ID
- Property/Listing ID and Name
- Reviewer Name
- Review Type (guest-to-host, host-to-guest, etc.)
- Status
- Rating (overall and by category)
- Review Text
- Submission Date
- Channel (Airbnb, Booking.com, etc.)
- Approval Status
- Source (Hostaway, Google)

## Google Reviews Integration

**Exploration Findings**:
Integration with Google Places API is feasible for fetching Google reviews. The implementation would require:

1. A Google Cloud Platform account with the Places API enabled
2. An API key with appropriate restrictions
3. Creating a normalizer for Google review format
4. Extending the API to support fetching reviews by Google Place ID

A basic structure for this integration has been included in the codebase, but full implementation would require:
- Setting up proper authentication with Google API
- Mapping Google review format to our normalized schema
- Associating Google Place IDs with Flex Living properties

## Implementation Details

### Review Approval System
The system implements a review approval mechanism where property managers can:
1. View all reviews in the dashboard
2. Select individual reviews or use bulk selection
3. Approve or unapprove reviews for public display
4. Only approved reviews appear on the public property pages

### Data Flow
1. Reviews are fetched from the Hostaway API (mocked in this implementation)
2. Reviews are normalized to a standard format
3. Reviews are stored and can be filtered/searched
4. Managers can approve/unapprove reviews
5. Approved reviews are displayed on property pages

### UI/UX Considerations
- Clean, intuitive dashboard layout
- Responsive design for both desktop and mobile use
- Visual indicators of performance (badges, ratings)
- Filtering system for easily finding relevant reviews
- Clear approval indicators and controls

### Performance Optimizations
- Client-side filtering to reduce server load
- Efficient review grouping by property
- Selective loading of approved reviews for public display

### Future Enhancements
- Full Google Reviews integration
- Additional data visualizations and trends
- Email notifications for new reviews
- Response management for reviews
- Sentiment analysis of review content
