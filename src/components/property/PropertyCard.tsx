import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Camera } from 'lucide-react';
import { format } from 'date-fns';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    uploadedAt: string;
    uploaderName: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const {
    id,
    title,
    location,
    imageUrl,
    rating,
    reviewCount,
    uploadedAt,
    uploaderName
  } = property;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <Link to={`/property/${id}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium text-sm">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/property/${id}`}>
          <h3 className="font-semibold text-lg mb-1 text-gray-900 hover:text-indigo-700">
            {title}
          </h3>
        </Link>

        <div className="flex items-center mb-2 text-gray-600">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{location}</span>
        </div>

        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Camera className="h-3.5 w-3.5 mr-1" />
            <span>{uploaderName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{format(new Date(uploadedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;