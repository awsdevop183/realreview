import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, User, Star, Calendar, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { format } from 'date-fns';
import RatingStars from '../components/property/RatingStars';
import { useAuth } from '../context/AuthContext';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  uploadedAt: string;
  uploaderName: string;
  uploaderId: number;
  approved: boolean;
}

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Navigate through images
  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Fetch property and reviews data
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, use API endpoints
        // const propertyResponse = await axios.get(`/api/properties/${id}`);
        // const reviewsResponse = await axios.get(`/api/properties/${id}/reviews`);
        
        // Mock data for demo
        setTimeout(() => {
          // Mock property data
          const mockProperty: Property = {
            id: parseInt(id || '1'),
            title: "Modern Apartment with City View",
            description: "This beautiful apartment features stunning city views, modern appliances, and is in a prime location. Perfect for young professionals or small families looking for a comfortable living space in the heart of the city. Recently renovated with high-end finishes throughout.",
            location: "123 Main St, New York, NY 10001",
            images: [
              "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            ],
            rating: 4.7,
            reviewCount: 12,
            uploadedAt: "2023-09-15T14:48:00.000Z",
            uploaderName: "Alex Johnson",
            uploaderId: 2,
            approved: true
          };
          
          // Mock reviews
          const mockReviews: Review[] = [
            {
              id: 1,
              userId: 3,
              userName: "Sarah Miller",
              rating: 5,
              comment: "Absolutely loved this place! The view is even better than the photos show. Great location with easy access to transportation and restaurants.",
              createdAt: "2023-09-20T10:30:00.000Z"
            },
            {
              id: 2,
              userId: 4,
              userName: "Michael Brown",
              rating: 4,
              comment: "Nice apartment with modern amenities. The building is well-maintained and secure. Only giving 4 stars because the street noise can be a bit much at night.",
              createdAt: "2023-09-18T15:45:00.000Z"
            },
            {
              id: 3,
              userId: 5,
              userName: "Jessica Lee",
              rating: 5,
              comment: "Perfect location! Close to everything you need. The apartment is spacious and gets great natural light. Would definitely recommend!",
              createdAt: "2023-09-16T09:15:00.000Z"
            }
          ];
          
          setProperty(mockProperty);
          setReviews(mockReviews);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to load property details. Please try again.');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);
  
  // Submit a new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }
    
    if (userRating === 0) {
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      // In a real implementation, POST to API
      // await axios.post(`/api/properties/${id}/reviews`, {
      //   rating: userRating,
      //   comment: reviewText
      // }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // Mock adding the review locally
      const newReview: Review = {
        id: reviews.length + 1,
        userId: user.id,
        userName: user.name,
        rating: userRating,
        comment: reviewText,
        createdAt: new Date().toISOString()
      };
      
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setUserRating(0);
      
      // Update property rating
      if (property) {
        const newTotalRating = property.rating * property.reviewCount + userRating;
        const newReviewCount = property.reviewCount + 1;
        const newAvgRating = newTotalRating / newReviewCount;
        
        setProperty({
          ...property,
          rating: parseFloat(newAvgRating.toFixed(1)),
          reviewCount: newReviewCount
        });
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4 mb-6 rounded"></div>
          <div className="h-96 bg-gray-300 w-full mb-8 rounded-lg"></div>
          <div className="h-4 bg-gray-200 w-1/2 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-3/4 mb-6 rounded"></div>
          <div className="h-32 bg-gray-200 w-full mb-8 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || 'Property not found'}</p>
          <Link 
            to="/" 
            className="inline-block mt-4 px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="text-indigo-700 hover:text-indigo-900 flex items-center mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to listings
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-y-2">
          <div className="flex items-center mr-6">
            <MapPin className="h-5 w-5 mr-1 text-indigo-600" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center mr-6">
            <User className="h-5 w-5 mr-1 text-indigo-600" />
            <span>Uploaded by {property.uploaderName}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1 text-indigo-600" />
            <span>{format(new Date(property.uploadedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="ml-1 font-semibold">{property.rating}</span>
          </div>
          <span className="text-gray-600">({property.reviewCount} reviews)</span>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="mb-10 relative">
        <div className="relative h-[500px] overflow-hidden rounded-xl shadow-lg">
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail navigation */}
        {property.images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-indigo-600' : 'opacity-70'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>
          
          {/* Report button */}
          <button className="flex items-center text-red-600 hover:text-red-800 transition-colors">
            <Flag className="h-4 w-4 mr-1" />
            <span>Report this listing</span>
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4">Location Details</h3>
          <div className="h-48 bg-gray-200 rounded-md mb-4">
            {/* Map would be rendered here */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map view
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            <MapPin className="h-4 w-4 inline mr-2 text-indigo-600" />
            {property.location}
          </p>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium mb-2">Nearby amenities:</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Public transportation (0.2 miles)</li>
              <li>• Grocery stores (0.3 miles)</li>
              <li>• Restaurants (0.1 miles)</li>
              <li>• Parks (0.5 miles)</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Reviews ({property.reviewCount})
        </h2>
        
        {/* Add review form */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <RatingStars
                initialRating={userRating}
                onRate={setUserRating}
                size="lg"
              />
              {userRating === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  Please select a rating
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="reviewText" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="reviewText"
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this property..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors disabled:bg-indigo-400"
              disabled={userRating === 0 || submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 text-center">
            <p className="mb-4">Please log in to leave a review.</p>
            <Link 
              to="/login" 
              className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors inline-block"
            >
              Log In
            </Link>
          </div>
        )}
        
        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{review.userName}</div>
                    <div className="flex items-center mt-1">
                      <RatingStars
                        initialRating={review.rating}
                        readOnly
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 text-center py-6 bg-gray-50 rounded-lg">
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;