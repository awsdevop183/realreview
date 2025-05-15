import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, CheckCircle, XCircle, Camera, MapPin, Calendar, 
  MoreVertical, UserCheck, Filter, ArchiveIcon, RefreshCw 
} from 'lucide-react';
import { format } from 'date-fns';

interface PendingProperty {
  id: number;
  title: string;
  location: string;
  uploader_name: string;
  created_at: string;
  image_count: number;
  preview_image: string;
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    
    const fetchPendingProperties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, fetch from API
        // const response = await axios.get('/api/admin/properties/pending', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        
        // Mock data for demo
        setTimeout(() => {
          const mockPendingProperties: PendingProperty[] = [
            {
              id: 101,
              title: "Luxury Apartment in Downtown",
              location: "123 Main St, New York, NY",
              uploader_name: "John Smith",
              created_at: "2023-09-25T10:30:00.000Z",
              image_count: 5,
              preview_image: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            },
            {
              id: 102,
              title: "Beachfront Property",
              location: "456 Ocean Dr, Miami, FL",
              uploader_name: "Maria Garcia",
              created_at: "2023-09-24T14:15:00.000Z",
              image_count: 3,
              preview_image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            },
            {
              id: 103,
              title: "Modern Suburban Home",
              location: "789 Maple Ave, Chicago, IL",
              uploader_name: "David Johnson",
              created_at: "2023-09-23T09:45:00.000Z",
              image_count: 4,
              preview_image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            }
          ];
          
          setPendingProperties(mockPendingProperties);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching pending properties:', error);
        setError('Failed to load pending properties');
        setIsLoading(false);
      }
    };
    
    fetchPendingProperties();
  }, [user, isAdmin, navigate]);
  
  const handleApprove = async (id: number) => {
    try {
      // In a real implementation, call API
      // await axios.patch(`/api/admin/properties/${id}/approve`, {}, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // Mock update for demo
      setPendingProperties(pendingProperties.filter(prop => prop.id !== id));
      setShowActionMenu(null);
      
      // Show success notification
      alert('Property approved successfully');
    } catch (error) {
      console.error('Error approving property:', error);
      // Show error notification
      alert('Failed to approve property');
    }
  };
  
  const handleReject = async (id: number) => {
    try {
      // In a real implementation, call API
      // await axios.delete(`/api/admin/properties/${id}`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // Mock update for demo
      setPendingProperties(pendingProperties.filter(prop => prop.id !== id));
      setShowActionMenu(null);
      
      // Show success notification
      alert('Property rejected successfully');
    } catch (error) {
      console.error('Error rejecting property:', error);
      // Show error notification
      alert('Failed to reject property');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'pending'
                ? 'text-indigo-700 border-b-2 border-indigo-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Approval ({pendingProperties.length})</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'users'
                ? 'text-indigo-700 border-b-2 border-indigo-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>User Management</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'archived'
                ? 'text-indigo-700 border-b-2 border-indigo-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('archived')}
          >
            <div className="flex items-center space-x-2">
              <ArchiveIcon className="h-5 w-5" />
              <span>Archived Properties</span>
            </div>
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
            <button
              className="ml-2 text-red-700 hover:text-red-900 font-medium flex items-center"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </button>
          </div>
        )}
        
        {/* Pending Properties Tab */}
        {activeTab === 'pending' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Properties Pending Approval</h2>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </button>
            </div>
            
            {pendingProperties.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-gray-600">There are no properties pending approval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img
                        src={property.preview_image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(
                              showActionMenu === property.id ? null : property.id
                            )}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-700" />
                          </button>
                          
                          {showActionMenu === property.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20">
                              <div className="py-1">
                                <button
                                  onClick={() => handleApprove(property.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Approve Property
                                </button>
                                <button
                                  onClick={() => handleReject(property.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                  Reject Property
                                </button>
                                <a
                                  href={`/property/${property.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <Camera className="h-4 w-4 mr-2 text-blue-500" />
                                  View All Images
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                        {property.image_count} images
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location}</span>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-sm text-gray-500">
                        <div>Uploaded by {property.uploader_name}</div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{format(new Date(property.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex mt-4 space-x-2">
                        <button
                          onClick={() => handleApprove(property.id)}
                          className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(property.id)}
                          className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Other tabs content would go here */}
        {activeTab === 'users' && (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">
              This section allows you to manage user accounts, update roles, and handle user reports.
            </p>
            <p className="text-gray-500 italic">
              User management interface not implemented in this demo.
            </p>
          </div>
        )}
        
        {activeTab === 'archived' && (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Archived Properties</h3>
            <p className="text-gray-600 mb-4">
              View and manage properties that have been automatically archived after the 6-month period.
            </p>
            <p className="text-gray-500 italic">
              Archived properties interface not implemented in this demo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;