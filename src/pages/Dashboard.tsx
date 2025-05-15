import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, MapPin, Star, Calendar, Upload, Settings, 
  Grid, List, LogOut, Camera, Heart, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/property/PropertyCard';

interface UserProperty {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SavedProperty {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  savedAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('uploads');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // In a real app, fetch from API
        // const uploadsResponse = await axios.get('/api/user/properties', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        // const savedResponse = await axios.get('/api/user/saved', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        
        // Mock data for demo
        setTimeout(() => {
          const mockUploads: UserProperty[] = [
            {
              id: 1,
              title: "Modern Apartment with City View",
              location: "New York, NY",
              imageUrl: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.7,
              reviewCount: 12,
              uploadedAt: "2023-09-15T14:48:00.000Z",
              status: 'approved'
            },
            {
              id: 2,
              title: "Spacious Family Home",
              location: "Los Angeles, CA",
              imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 0,
              reviewCount: 0,
              uploadedAt: "2023-09-25T10:30:00.000Z",
              status: 'pending'
            }
          ];
          
          const mockSaved: SavedProperty[] = [
            {
              id: 3,
              title: "Luxury Condo with Ocean View",
              location: "Miami, FL",
              imageUrl: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.9,
              reviewCount: 15,
              savedAt: "2023-09-20T09:15:00.000Z"
            },
            {
              id: 4,
              title: "Cozy Studio in Downtown",
              location: "Chicago, IL",
              imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              rating: 4.2,
              reviewCount: 6,
              savedAt: "2023-09-22T16:20:00.000Z"
            }
          ];
          
          setUserProperties(mockUploads);
          setSavedProperties(mockSaved);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-4">
                  <User className="h-10 w-10 text-indigo-700" />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('uploads')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'uploads'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Upload className="mr-3 h-5 w-5 flex-shrink-0" />
                  My Uploads
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'saved'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Heart className="mr-3 h-5 w-5 flex-shrink-0" />
                  Saved Properties
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                  Logout
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/upload"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Upload New Property
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            {/* My Uploads Tab */}
            {activeTab === 'uploads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Property Uploads</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${
                        viewMode === 'grid'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${
                        viewMode === 'list'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
                    {[1, 2].map((item) => (
                      <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-300" />
                        <div className="p-4 space-y-3">
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userProperties.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Camera className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't uploaded any properties yet. Start sharing your property photos!
                    </p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800"
                    >
                      Upload Property
                    </Link>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userProperties.map((property) => (
                      <div 
                        key={property.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <Link to={`/property/${property.id}`} className="block">
                          <div className="relative h-48">
                            <img
                              src={property.imageUrl}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                            {property.status === 'pending' && (
                              <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-sm">
                                Pending Approval
                              </div>
                            )}
                            {property.status === 'rejected' && (
                              <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 text-sm">
                                Rejected
                              </div>
                            )}
                            {property.reviewCount > 0 && (
                              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium text-sm">{property.rating.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({property.reviewCount})</span>
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        <div className="p-4">
                          <Link to={`/property/${property.id}`}>
                            <h3 className="font-semibold text-lg mb-1 text-gray-900 hover:text-indigo-700">
                              {property.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center mb-2 text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate">{property.location}</span>
                          </div>
                          
                          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Uploaded</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{format(new Date(property.uploadedAt), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex"
                      >
                        <Link to={`/property/${property.id}`} className="block w-48 h-32">
                          <div className="relative w-full h-full">
                            <img
                              src={property.imageUrl}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                            {property.status === 'pending' && (
                              <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-center py-0.5 text-xs">
                                Pending
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link to={`/property/${property.id}`}>
                                <h3 className="font-semibold text-lg mb-1 text-gray-900 hover:text-indigo-700">
                                  {property.title}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center mb-2 text-gray-600">
                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                            </div>
                            
                            {property.reviewCount > 0 && (
                              <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium text-sm">{property.rating.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({property.reviewCount})</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            Uploaded on {format(new Date(property.uploadedAt), 'MMMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Saved Properties</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${
                        viewMode === 'grid'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${
                        viewMode === 'list'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
                    {[1, 2].map((item) => (
                      <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-300" />
                        <div className="p-4 space-y-3">
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : savedProperties.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Heart className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't saved any properties yet. Browse the listings and save your favorites!
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={{
                          id: property.id,
                          title: property.title,
                          location: property.location,
                          imageUrl: property.imageUrl,
                          rating: property.rating,
                          reviewCount: property.reviewCount,
                          uploadedAt: property.savedAt,
                          uploaderName: 'Unknown' // Would be fetched from API in real app
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex"
                      >
                        <Link to={`/property/${property.id}`} className="block w-48 h-32">
                          <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link to={`/property/${property.id}`}>
                                <h3 className="font-semibold text-lg mb-1 text-gray-900 hover:text-indigo-700">
                                  {property.title}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center mb-2 text-gray-600">
                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-sm">{property.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-500">({property.reviewCount})</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            Saved on {format(new Date(property.savedAt), 'MMMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md"
                          value={user.name}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md"
                          value={user.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Password</h3>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="comments"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            Email me when someone comments on my property
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="ratings"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="ratings" className="font-medium text-gray-700">
                            Email me when someone rates my property
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="newsletter"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="newsletter" className="font-medium text-gray-700">
                            Email me with RealReview newsletter and updates
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Once you delete your account, there is no going back.
                    </p>
                    <button className="mt-4 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;