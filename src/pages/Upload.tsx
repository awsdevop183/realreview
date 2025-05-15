import React from 'react';
import UploadForm from '../components/property/UploadForm';

const Upload: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Property Photos</h1>
        <p className="text-gray-600 mb-8">
          Share your authentic property photos with our community. Your uploads help newcomers 
          find great locations and make informed decisions about where to live.
        </p>
        
        <UploadForm />
      </div>
    </div>
  );
};

export default Upload;