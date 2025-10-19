import { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fruitResults, setFruitResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const fruitData = fruitResults[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(fruitResults.length - 1, prev + 1));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    // Convert the selected image to base64 and send as JSON { mime_type, data }

    try {

      const fd = new FormData();
      fd.append("file", selectedImage);

      // Replace with your actual API endpoint
      const response = await axios.post("http://127.0.0.1:8000/api/v1/analyze-image", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log('response', response.data);
      const results = Object.values(response.data.fruit_analysis);
      setFruitResults(results);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(fruitData);
  return (
    <div className="min-h-scree">
      <div className="w-full h-full">
        <div className="bg-white overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600">
            <h1 className="text-2xl font-bold text-white text-center">
              Fruit Recognition App
            </h1>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Image Upload Section */}
            <div className='flex gap-10'>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-full max-w-lg">
                    <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200">
                      <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-sm">Select an image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Section */}
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-xs h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading || !selectedImage}
                    className={`px-6 py-2 rounded-md text-white font-semibold
                    ${loading || !selectedImage
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {fruitData && (
                <div className='flex flex-col space-y-4 bg-white p-6 rounded-xl shadow-lg max-w-2xl'>
                  {/* Results Header */}
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Analysis Results
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({fruitResults.length} fruits detected)
                      </span>
                    </h3>
                    <span className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Match {Math.round((1 / fruitResults.length) * 100)}% confidence
                    </span>
                  </div>

                  {/* Navigation Controls */}
                  <div className='flex items-center justify-between gap-4 py-2'>
                    <button 
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentIndex === 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    <span className="px-4 py-1 bg-gray-50 text-sm font-medium text-gray-600 rounded-full border">
                      {currentIndex + 1} of {fruitResults.length}
                    </span>

                    <button 
                      onClick={handleNext}
                      disabled={currentIndex === fruitResults.length - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentIndex === fruitResults.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md'
                      }`}
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Results Card */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {fruitData.name_of_fruit}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nutrition Facts */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                          Nutrition Facts
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600">Calories</span>
                            <span className="font-medium text-gray-800">{fruitData.calories_per_100g}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600">Carbohydrates</span>
                            <span className="font-medium text-gray-800">{fruitData.carbohydrates}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600">Fiber</span>
                            <span className="font-medium text-gray-800">{fruitData.fiber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Vitamins & Benefits */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            Vitamins
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {fruitData?.vitamins?.map((vitamin, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                              >
                                {vitamin}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            Health Benefits
                          </h3>
                          <p className="mt-3 text-gray-600 bg-white p-3 rounded-lg">
                            {fruitData.benefits_for_human_body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default App
