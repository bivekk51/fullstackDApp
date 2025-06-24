import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { distributionAPI } from '../services/api';
import { DollarSign, FileText, MapPin, Users, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const CreateDistribution = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    location: '',
    beneficiaries: '',
    category: 'education',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'food', label: 'Food & Nutrition' },
    { value: 'shelter', label: 'Shelter & Housing' },
    { value: 'disaster-relief', label: 'Disaster Relief' },
    { value: 'environment', label: 'Environment' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (parseFloat(formData.amount) <= 0) {
      setError('Distribution amount must be greater than 0');
      setLoading(false);
      return;
    }

    if (parseInt(formData.beneficiaries) <= 0) {
      setError('Number of beneficiaries must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      await distributionAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
        beneficiaries: parseInt(formData.beneficiaries),
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/distributions');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create distribution');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Distribution Created!</h2>
          <p className="text-gray-600 mb-4">
            Your distribution of ${formData.amount} to {formData.beneficiaries} beneficiaries has been successfully created.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your distributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Distribution</h1>
            <p className="text-gray-600 mt-1">Distribute aid to beneficiaries in need</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Distribution Amount ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min="1"
                    step="0.01"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beneficiaries
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="beneficiaries"
                    name="beneficiaries"
                    min="1"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Number of people"
                    value={formData.beneficiaries}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="City, State/Region, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Details
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe what you're distributing, who will benefit, and the expected impact..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Provide detailed information about the distribution for transparency
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">Upload Supporting Documents</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add photos, receipts, or other documentation (Optional)
                </p>
                <button
                  type="button"
                  className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Choose Files
                </button>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-2">Distribution Requirements</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Provide accurate beneficiary count</li>
                <li>• Include specific location details</li>
                <li>• Document distribution process</li>
                <li>• Submit proof of completion</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/distributions')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Distribution'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution Process</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Create Plan</h3>
              <p className="text-xs text-gray-600">Define distribution details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Execute</h3>
              <p className="text-xs text-gray-600">Distribute aid to beneficiaries</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Document</h3>
              <p className="text-xs text-gray-600">Upload proof and evidence</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Verify</h3>
              <p className="text-xs text-gray-600">Complete transparency record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDistribution;
