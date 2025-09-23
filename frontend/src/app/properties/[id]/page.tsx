'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { reviewsApi, propertiesApi } from '@/lib/api';
import { Property, Review } from '@/types/review';

interface PropertyDetailProps {
  params: {
    id: string;
  };
}

export default function PropertyDetail({ params }: PropertyDetailProps) {
  const { id } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would use the API to fetch property data
        // Mock property for now
        const mockProperty: Property = {
          id,
          name: id === '123456' 
            ? '2B N1 A - 29 Shoreditch Heights'
            : id === '987421'
            ? 'Luxury Apartment in Central London'
            : id === '394872'
            ? 'Cozy Studio in Camden Town'
            : id === '736251'
            ? 'Modern Flat in Manchester'
            : 'Charming Cottage in Edinburgh',
          thumbnail: `https://picsum.photos/seed/prop${id.slice(-1)}/800/500`,
          averageRating: 8.7,
          reviewCount: 18,
          city: 'London',
          topCategory: 'cleanliness',
          trending: 'up'
        };
        
        setProperty(mockProperty);
        
        // Fetch property reviews
        // In a real app we'd use the actual API
        // Mock reviews for now
        const mockReviews: Review[] = [
          {
            id: `rev1-${id}`,
            listingId: id,
            listingName: mockProperty.name,
            reviewer: 'John Smith',
            type: 'guest-to-host',
            status: 'published',
            rating: 9,
            categories: {
              cleanliness: 9,
              communication: 10,
              check_in: 8,
              accuracy: 9,
              location: 10,
              value: 8
            },
            text: 'Great place to stay! The apartment was clean, comfortable and in a great location. The host was very responsive and helpful. Would definitely stay here again!',
            submittedAt: '2023-09-15T10:30:00Z',
            channel: 'airbnb',
            approved: true,
            source: 'hostaway',
            raw: {}
          },
          {
            id: `rev2-${id}`,
            listingId: id,
            listingName: mockProperty.name,
            reviewer: 'Sarah Johnson',
            type: 'guest-to-host',
            status: 'published',
            rating: 10,
            categories: {
              cleanliness: 10,
              communication: 10,
              check_in: 10,
              accuracy: 10,
              location: 10,
              value: 10
            },
            text: 'Absolutely perfect! Everything about this place exceeded our expectations. Super clean, beautiful decor, and the host was incredibly responsive. The location couldn\'t be better for exploring the city.',
            submittedAt: '2023-08-28T14:45:00Z',
            channel: 'booking.com',
            approved: true,
            source: 'hostaway',
            raw: {}
          },
          {
            id: `rev3-${id}`,
            listingId: id,
            listingName: mockProperty.name,
            reviewer: 'Mark Wilson',
            type: 'guest-to-host',
            status: 'published',
            rating: 7,
            categories: {
              cleanliness: 6,
              communication: 8,
              check_in: 7,
              accuracy: 7,
              location: 9,
              value: 6
            },
            text: 'Good location but the apartment could have been cleaner. The host was responsive when we had an issue with the heating. Decent value for the price.',
            submittedAt: '2023-09-05T09:15:00Z',
            channel: 'vrbo',
            approved: false, // This review shouldn't show up in the public display
            source: 'hostaway',
            raw: {}
          },
          {
            id: `rev4-${id}`,
            listingId: id,
            listingName: mockProperty.name,
            reviewer: 'Emma Thompson',
            type: 'guest-to-host',
            status: 'published',
            rating: 8,
            categories: {
              cleanliness: 9,
              communication: 7,
              check_in: 8,
              accuracy: 8,
              location: 9,
              value: 8
            },
            text: 'Very nice place in a great area. Had a small issue with the wifi but the host sorted it quickly. Would recommend!',
            submittedAt: '2023-09-20T16:30:00Z',
            channel: 'airbnb',
            approved: true,
            source: 'hostaway',
            raw: {}
          }
        ];
        
        setReviews(mockReviews);
      } catch (err) {
        setError('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  // Filter to only approved reviews for public display
  const approvedReviews = reviews.filter(review => review.approved);

  // Calculate average ratings for each category
  const categoryAverages = approvedReviews.reduce(
    (acc, review) => {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        if (rating !== undefined) {
          acc[category].total += rating;
          acc[category].count += 1;
        }
      });
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );

  // Convert to average ratings
  const categoryRatings = Object.entries(categoryAverages).map(([category, data]) => ({
    category,
    average: data.total / data.count,
    count: data.count,
  })).sort((a, b) => b.average - a.average);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12 text-red-500">
        {error || 'Property not found'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Property Header */}
      <div className="relative">
        <div className="h-64 md:h-96 w-full relative">
          <Image
            src={property.thumbnail || '/placeholder-image.jpg'}
            alt={property.name}
            className="object-cover"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
          <p className="text-sm md:text-base opacity-90 mt-2">{property.city}</p>
        </div>
      </div>

      {/* Property Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Property Details
              </h2>
              <div className="mt-4">
                <div className="flex items-center mb-3">
                  <span className="flex items-center text-amber-500 mr-2">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{property.averageRating?.toFixed(1) ?? 'N/A'}</span>
                  </span>
                  <span className="text-secondary-500 dark:text-secondary-400 text-sm">
                    ({property.reviewCount ?? 0} reviews)
                  </span>
                  <span
                    className={`ml-4 badge ${
                      property.trending === 'up'
                        ? 'badge-green'
                        : property.trending === 'down'
                        ? 'badge-red'
                        : 'badge-yellow'
                    }`}
                  >
                    {property.trending === 'up'
                      ? '↑ Trending up'
                      : property.trending === 'down'
                      ? '↓ Trending down'
                      : '→ Stable'}
                  </span>
                </div>
                
                <div className="mt-4 prose dark:prose-invert max-w-none">
                  <p>
                    Experience the very best of London in this exceptional property managed by Flex Living. This spacious accommodation features modern amenities, comfortable furnishings, and an ideal location for exploring the city.
                  </p>
                  <p>
                    Perfect for both business travelers and tourists, this property offers convenience, comfort and exceptional value.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                    Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>High-speed WiFi</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fully equipped kitchen</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Smart TV</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Weekly cleaning service</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 support</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Premium linens & towels</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Rating Breakdown
              </h2>
              
              {categoryRatings.map((category) => (
                <div key={category.category} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 capitalize">
                      {category.category.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">
                      {category.average.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(category.average / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <Link href={`/dashboard`} className="btn btn-outline w-full">
                  View in Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Reviews Section */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Guest Reviews
          </h2>

          {approvedReviews.length === 0 ? (
            <div className="text-center py-6 text-secondary-500 dark:text-secondary-400">
              No approved reviews available for this property yet.
            </div>
          ) : (
            <div className="space-y-6">
              {approvedReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-secondary-200 dark:border-secondary-700 pb-6 last:border-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                        {review.reviewer}
                      </h3>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {new Date(review.submittedAt).toLocaleDateString()} via {review.channel}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="flex items-center text-amber-500">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium">{review.rating.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-secondary-600 dark:text-secondary-400">{review.text}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(review.categories).map(([category, rating]) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300"
                      >
                        {category.replace('_', ' ')}: {rating}/10
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map & Location (placeholder for now) */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Location
          </h2>
          <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg h-64 flex items-center justify-center">
            <p className="text-secondary-500 dark:text-secondary-400">Map would be displayed here</p>
          </div>
          <div className="mt-4 text-secondary-600 dark:text-secondary-400">
            <p>Perfectly located in the heart of {property.city}, our property offers easy access to public transportation, restaurants, and major attractions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
