import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { DollarSign, FileText, Tag, AlertCircle, CheckCircle } from 'lucide-react';

const CreateDonation = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
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
      setError('Donation amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      await donationAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/donations');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create donation');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Created!</h2>
          <p className="text-gray-600 mb-4">
            Your donation of ${formData.amount} has been successfully created and is now active.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
            <p className="text-gray-600 mt-1">Make a difference by contributing to a charitable cause</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Minimum donation amount is $1.00
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of your donation and what impact you hope to make..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Help others understand what motivates your donation
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Donation Benefits</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 100% transparent tracking on blockchain</li>
                <li>• Real-time updates on fund usage</li>
                <li>• Direct impact on beneficiaries</li>
                <li>• Verifiable proof of distribution</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/donations')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How Your Donation Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Create Donation</h3>
              <p className="text-sm text-gray-600">Your donation is recorded on the blockchain for transparency</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">NGO Distribution</h3>
              <p className="text-sm text-gray-600">Verified NGOs distribute funds to those who need them most</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Track Impact</h3>
              <p className="text-sm text-gray-600">See real proof of how your donation made a difference</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
