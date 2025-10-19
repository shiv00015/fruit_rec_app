import { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fruitData, setFruitData] = useState(null);
  const [error, setError] = useState(null);

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

      console.log('response', response.data)
      const temp = Object.values(response.data.fruit_analysis)
      setFruitData(temp[0]);
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
                <div className='flex flex-col space-y-4'>
                  <div className='flex justify-between items-center gap-4'>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      prev
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      next
                    </button>
                  </div>
                  <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {fruitData.name_of_fruit}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-semibold">Calories:</span>{' '}
                          {fruitData.calories_per_100g}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Carbohydrates:</span>{' '}
                          {fruitData.carbohydrates}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Fiber:</span>{' '}
                          {fruitData.fiber}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-600">Vitamins:</span>
                          <ul className="list-disc list-inside mt-1 text-gray-600">
                            {fruitData.vitamins.map((vitamin, index) => (
                              <li key={index}>{vitamin}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Benefits:</span>
                          <p className="mt-1 text-gray-600">
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
