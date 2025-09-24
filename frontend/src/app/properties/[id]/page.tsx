'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

        // Mock property
        const mockProperty: Property = {
          id,
          name:
            id === '123456'
              ? '2B N1 A - 29 Shoreditch Heights'
              : id === '987421'
              ? 'Luxury Apartment in Central London'
              : id === '394872'
              ? 'Cozy Studio in Camden Town'
              : id === '736251'
              ? 'Modern Flat in Manchester'
              : 'Charming Cottage in Edinburgh',
          thumbnail: `https://picsum.photos/seed/prop${id.slice(-1)}/1000/600`,
          averageRating: 8.7,
          reviewCount: 18,
          city: 'London',
          topCategory: 'cleanliness',
          trending: 'up',
        };

        setProperty(mockProperty);

        // Mock reviews
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
              value: 8,
            },
            text: 'Great place to stay! The apartment was clean, comfortable and in a great location. The host was very responsive and helpful. Would definitely stay here again!',
            submittedAt: '2023-09-15T10:30:00Z',
            channel: 'airbnb',
            approved: true,
            source: 'hostaway',
            raw: {},
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
              value: 10,
            },
            text: "Absolutely perfect! Everything about this place exceeded our expectations. Super clean, beautiful decor, and the host was incredibly responsive. The location couldn't be better for exploring the city.",
            submittedAt: '2023-08-28T14:45:00Z',
            channel: 'booking.com',
            approved: true,
            source: 'hostaway',
            raw: {},
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
              value: 8,
            },
            text: 'Very nice place in a great area. Had a small issue with the wifi but the host sorted it quickly. Would recommend!',
            submittedAt: '2023-09-20T16:30:00Z',
            channel: 'airbnb',
            approved: true,
            source: 'hostaway',
            raw: {},
          },
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

  const approvedReviews = reviews.filter((review) => review.approved);

  const categoryAverages = approvedReviews.reduce(
    (acc, review) => {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (rating !== undefined) {
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0 };
          }
          acc[category].total += rating;
          acc[category].count += 1;
        }
      });
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );

  const categoryRatings = Object.entries(categoryAverages)
    .map(([category, data]) => ({
      category,
      average: data.total / data.count,
      count: data.count,
    }))
    .sort((a, b) => b.average - a.average);

  if (loading) {
    return (
      <div className="text-center py-12 text-lg font-medium">Loading property details...</div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12 text-red-500 text-lg font-medium">
        {error || 'Property not found'}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={property.thumbnail || '/placeholder-image.jpg'}
          alt={property.name}
          className="object-cover"
          width={1200}
          height={600}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{property.name}</h1>
          <p className="text-base opacity-90 mt-2">{property.city}</p>
        </div>
      </div>

      {/* Overview + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">About this Property</h2>
            <div className="flex items-center mb-4 space-x-4">
              <span className="flex items-center text-amber-500 text-lg">
                ★ {property.averageRating?.toFixed(1) ?? 'N/A'}
              </span>
              <span className="text-secondary-500 text-sm">
                ({property.reviewCount ?? 0} reviews)
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.trending === 'up'
                    ? 'bg-green-100 text-green-700'
                    : property.trending === 'down'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {property.trending === 'up'
                  ? '↑ Trending up'
                  : property.trending === 'down'
                  ? '↓ Trending down'
                  : '→ Stable'}
              </span>
            </div>

            <p className="text-secondary-700 mb-2">
              Experience the very best of London in this exceptional property managed by Flex
              Living. This spacious accommodation features modern amenities, comfortable
              furnishings, and an ideal location.
            </p>
            <p className="text-secondary-700">
              Perfect for both business travelers and tourists, this property offers convenience,
              comfort, and exceptional value.
            </p>
          </div>

          {/* Guest Reviews */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>

            {approvedReviews.length === 0 ? (
              <div className="text-center py-6 text-secondary-500">
                No approved reviews available yet.
              </div>
            ) : (
              <div className="space-y-6">
                {approvedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-secondary-200 dark:border-secondary-700 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{review.reviewer}</h3>
                        <p className="text-sm text-secondary-500">
                          {new Date(review.submittedAt).toLocaleDateString()} via {review.channel}
                        </p>
                      </div>
                      <span className="text-amber-500 font-medium">★ {review.rating.toFixed(1)}</span>
                    </div>

                    <p className="mt-3 text-secondary-700">{review.text}</p>

                    <div className="mt-3 text-sm text-secondary-600 flex flex-col gap-1">
                      {Object.entries(review.categories)
                        .reduce<string[][]>(
                          (rows, [category, rating], index) => {
                            if (index % 2 === 0) rows.push([]);
                            rows[rows.length - 1].push(`${category.replace('_', ' ')}: ${rating}`);
                            return rows;
                          },
                          []
                        )
                        .map((row, i) => (
                          <p key={i}>{row.join(', ')}</p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Rating Breakdown</h2>
            {categoryRatings.map((category) => (
              <div key={category.category} className="mb-3">
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span className="capitalize">{category.category.replace('_', ' ')}</span>
                  <span>{category.average.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(category.average / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <Link href={`/dashboard`} className="btn btn-outline w-full mt-6">
              View in Dashboard
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="bg-secondary-100 rounded-lg h-52 flex items-center justify-center">
              <p className="text-secondary-500">Map would be displayed here</p>
            </div>
            <p className="mt-4 text-secondary-700">
              Perfectly located in the heart of {property.city}, with easy access to public
              transport, restaurants, and attractions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
