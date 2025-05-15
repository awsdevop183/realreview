import React, { useState } from 'react';
import { Upload, MapPin, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UploadForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      navigate(`/property/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Upload failed');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">You need to be logged in to upload properties</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Property Images</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Property Title
        </label>
        <input
          type="text"
          id="title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            id="location"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter property address"
            required
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images
        </label>
        
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="h-36 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
          
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center p-4">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add photos</span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          You can upload multiple images. Each image will be verified with the location provided.
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors disabled:bg-indigo-400"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Property'}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;