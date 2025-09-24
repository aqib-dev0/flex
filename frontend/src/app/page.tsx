import { Property } from '@/types/review';
import Image from 'next/image';
import Link from 'next/link';

// This would normally come from an API call, but we'll mock it for now
const mockProperties: Property[] = [
  {
    id: '123456',
    name: '2B N1 A - 29 Shoreditch Heights',
    thumbnail: 'https://picsum.photos/seed/prop1/400/300',
    averageRating: 9.5,
    reviewCount: 22,
    city: 'London',
    topCategory: 'cleanliness',
    trending: 'up'
  },
  {
    id: '987421',
    name: 'Luxury Apartment in Central London',
    thumbnail: 'https://picsum.photos/seed/prop2/400/300',
    averageRating: 8.5,
    reviewCount: 14,
    city: 'London',
    topCategory: 'location',
    trending: 'stable'
  },
  {
    id: '394872',
    name: 'Cozy Studio in Camden Town',
    thumbnail: 'https://picsum.photos/seed/prop3/400/300',
    averageRating: 7.0,
    reviewCount: 9,
    city: 'London',
    topCategory: 'value',
    trending: 'down'
  }
];

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero section with introduction text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="py-8 space-y-4">
          <h1 className="text-4xl font-bold text-primary-600">Welcome to Flex Living</h1>
          <p className="text-lg text-secondary-700">
            Luxury apartments with hotel services. Check in 24/7 with digital keys, use self-check lockboxes, and depart stress-free.
          </p>
          <button className="mt-4 btn">
            Explore Properties
          </button>
        </div>
        <div className="py-8 space-y-4 text-right">
          <h2 className="text-4xl font-bold text-primary-600">Premium Accommodations</h2>
          <p className="text-lg text-secondary-700">
            Fully-furnished apartments, high-speed WiFi, and smart TVs await — you just unpack and start living.
          </p>
        </div>
      </div>
      
      {/* Feature sections from the image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        {/* Curated Spaces Section */}
        <div className="space-y-8">
          <div className="overflow-hidden rounded-lg shadow-lg h-64 relative">
            <Image
              src="https://picsum.photos/seed/space1/800/500"
              alt="Curated living space with stylish decor"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">Curated Spaces</h2>
            <p className="text-secondary-700">
              All our apartments are to The Flex standard: prime locations, quality buildings, and polished off with our signature interior design.
            </p>
          </div>
        </div>
        
        {/* 24/7 Support Section */}
        <div className="space-y-8">
          <div className="overflow-hidden rounded-lg shadow-lg h-64 relative">
            <Image
              src="https://picsum.photos/seed/support/800/500"
              alt="Person working with laptop in comfortable living space"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">24/7 Support</h2>
            <p className="text-secondary-700">
              Text, call, or email us anytime, we're here to make your stay seamless. Need parking, a late checkout? No problem – We're on it.
            </p>
          </div>
        </div>
      </div>
      
      {/* Properties showcase */}
      <div className="mt-16">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary-600">
              Featured Properties
            </h2>
            <p className="mt-2 text-secondary-600">
              Explore our curated selection of premium accommodations
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/properties" className="btn">
              View All Properties
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProperties.map((property) => (
            <Link href={`/properties/${property.id}`} key={property.id} className="card hover:shadow-lg transition-shadow bg-white">
              <div className="relative w-full h-48">
                <Image
                  src={property.thumbnail || '/placeholder-image.jpg'}
                  alt={property.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute top-2 right-2">
                  <span className={`badge ${property.trending === 'up' ? 'badge-green' : property.trending === 'down' ? 'badge-red' : 'badge-yellow'}`}>
                    {property.trending === 'up' ? '↑ Trending up' : property.trending === 'down' ? '↓ Trending down' : '→ Stable'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-primary-700 truncate">
                    {property.name}
                  </h3>
                </div>
                <div className="mt-1 text-sm text-secondary-500">
                  {property.city}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center text-amber-500">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{property.averageRating?.toFixed(1) ?? 'N/A'}</span>
                    </span>
                    <span className="ml-2 text-secondary-500 text-sm">
                      ({property.reviewCount ?? 0} reviews)
                    </span>
                  </div>
                  <div>
                    <span className="badge bg-primary-100 text-primary-700">
                      Top: {property.topCategory}
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500" style={{ width: `${((property.averageRating ?? 0) / 10) * 100}%` }}></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
