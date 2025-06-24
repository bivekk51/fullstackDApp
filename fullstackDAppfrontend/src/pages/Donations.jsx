import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Plus, Filter, Search, Calendar } from 'lucide-react';

const Donations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, searchTerm, statusFilter]);

  const loadDonations = async () => {
    try {
      const response = user.role === 'donor' 
        ? await donationAPI.getUserDonations()
        : await donationAPI.getAll();
      setDonations(response.data);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    setFilteredDonations(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'donor' ? 'My Donations' : 'All Donations'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'donor' 
                ? 'Track your charitable contributions and their impact' 
                : 'View all donations made through the platform'
              }
            </p>
          </div>
          {user.role === 'donor' && (
            <Link
              to="/create-donation"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Donation</span>
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredDonations.length > 0 ? (
          <div className="grid gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          ${donation.amount.toLocaleString()}
                        </h3>
                        <p className="text-gray-600 mb-3">{donation.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                          </div>
                          {donation.donor && user.role !== 'donor' && (
                            <div>
                              <span>by {donation.donor.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        donation.status === 'active' ? 'bg-green-100 text-green-800' :
                        donation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status}
                      </span>
                      {donation.transactionHash && (
                        <p className="text-xs text-gray-500 mt-2">
                          TX: {donation.transactionHash.substring(0, 10)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {donation.category && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {donation.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-500 mb-6">
              {user.role === 'donor' 
                ? "You haven't made any donations yet. Start making a difference today!"
                : "No donations match your current filters."
              }
            </p>
            {user.role === 'donor' && (
              <Link
                to="/create-donation"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Make Your First Donation
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
