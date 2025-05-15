import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, MapPin, Star, TrendingUp } from 'lucide-react';
import PropertyGrid from '../components/property/PropertyGrid';

interface Property {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  uploadedAt: string;
  uploaderName: string;
}

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'miami', name: 'Miami' },
    { id: 'seattle', name: 'Seattle' },
  ];
  
  const sortOptions = [
    { id: 'latest', name: 'Latest Uploads' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'popular', name: 'Most Reviewed' },
  ];

  // In a real app, this would fetch from the API
  // Simulating API call with mock data for now
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, use API endpoint with filters
        // const response = await axios.get('/api/properties', {
        //   params: { search: searchQuery, location: selectedLocation, sort: sortBy }
        // });
        
        // Simulated data for the demo
        setTimeout(() => {
          const mockProperties: Property[] = [
            {
              id: 1,
              title: "Modern Apartment with City View",
              location: "New York, NY",
              imageUrl: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.7,
              reviewCount: 12,
              uploadedAt: "2023-09-15T14:48:00.000Z",
              uploaderName: "Alex Johnson"
            },
            {
              id: 2,
              title: "Spacious Family Home",
              location: "Los Angeles, CA",
              imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.5,
              reviewCount: 8,
              uploadedAt: "2023-09-10T10:30:00.000Z",
              uploaderName: "Maria Garcia"
            },
            {
              id: 3,
              title: "Luxury Condo with Ocean View",
              location: "Miami, FL",
              imageUrl: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.9,
              reviewCount: 15,
              uploadedAt: "2023-09-20T09:15:00.000Z",
              uploaderName: "John Smith"
            },
            {
              id: 4,
              title: "Cozy Studio in Downtown",
              location: "Chicago, IL",
              imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.2,
              reviewCount: 6,
              uploadedAt: "2023-09-05T16:20:00.000Z",
              uploaderName: "Emily Williams"
            },
            {
              id: 5,
              title: "Waterfront House with Dock",
              location: "Seattle, WA",
              imageUrl: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.8,
              reviewCount: 10,
              uploadedAt: "2023-09-18T11:45:00.000Z", 
              uploaderName: "Michael Brown"
            },
            {
              id: 6,
              title: "Rustic Mountain Cabin",
              location: "Denver, CO",
              imageUrl: "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.6,
              reviewCount: 9,
              uploadedAt: "2023-09-12T08:30:00.000Z",
              uploaderName: "Sarah Johnson"
            },
            {
              id: 7,
              title: "Renovated Historic Brownstone",
              location: "Boston, MA",
              imageUrl: "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.4,
              reviewCount: 7,
              uploadedAt: "2023-09-08T13:15:00.000Z",
              uploaderName: "David Miller"
            },
            {
              id: 8,
              title: "Contemporary Townhouse",
              location: "San Francisco, CA",
              imageUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.3,
              reviewCount: 5,
              uploadedAt: "2023-09-03T15:10:00.000Z",
              uploaderName: "Jessica Lee"
            }
          ];
          
          // Filter and sort based on selected options
          let filteredProperties = mockProperties;
          
          // Filter by location
          if (selectedLocation !== 'all') {
            const locationName = locations.find(l => l.id === selectedLocation)?.name.split(',')[0];
            filteredProperties = filteredProperties.filter(p => 
              p.location.toLowerCase().includes(locationName?.toLowerCase() || '')
            );
          }
          
          // Filter by search query
          if (searchQuery) {
            filteredProperties = filteredProperties.filter(p => 
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              p.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          // Sort properties
          if (sortBy === 'rating') {
            filteredProperties.sort((a, b) => b.rating - a.rating);
          } else if (sortBy === 'popular') {
            filteredProperties.sort((a, b) => b.reviewCount - a.reviewCount);
          } else {
            // Sort by latest
            filteredProperties.sort((a, b) => 
              new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            );
          }
          
          setProperties(filteredProperties);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [searchQuery, selectedLocation, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Find Your Next Home with Real Reviews
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover properties with authentic photos and honest ratings from real people who have visited them.
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Discover Properties'}
          </h2>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Property Grid */}
      <PropertyGrid properties={properties} loading={loading} />
    </div>
  );
};

export default Home;