import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { distributionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Share, Plus, Filter, Search, Calendar, MapPin } from 'lucide-react';

const Distributions = () => {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState([]);
  const [filteredDistributions, setFilteredDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDistributions();
  }, []);

  useEffect(() => {
    filterDistributions();
  }, [distributions, searchTerm, statusFilter]);

  const loadDistributions = async () => {
    try {
      const response = user.role === 'ngo' 
        ? await distributionAPI.getNgoDistributions()
        : await distributionAPI.getAll();
      setDistributions(response.data);
    } catch (error) {
      console.error('Error loading distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDistributions = () => {
    let filtered = distributions;

    if (searchTerm) {
      filtered = filtered.filter(distribution =>
        distribution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distribution.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distribution.ngo?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(distribution => distribution.status === statusFilter);
    }

    setFilteredDistributions(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'ngo' ? 'My Distributions' : 'All Distributions'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'ngo' 
                ? 'Track your aid distributions and their impact' 
                : 'View all aid distributions made through the platform'
              }
            </p>
          </div>
          {user.role === 'ngo' && (
            <Link
              to="/create-distribution"
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Distribution</span>
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
                  placeholder="Search distributions..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredDistributions.length > 0 ? (
          <div className="grid gap-6">
            {filteredDistributions.map((distribution) => (
              <div key={distribution._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Share className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          ${distribution.amount.toLocaleString()}
                        </h3>
                        <p className="text-gray-600 mb-3">{distribution.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(distribution.createdAt).toLocaleDateString()}</span>
                          </div>
                          {distribution.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{distribution.location}</span>
                            </div>
                          )}
                          {distribution.ngo && user.role !== 'ngo' && (
                            <div>
                              <span>by {distribution.ngo.name}</span>
                            </div>
                          )}
                        </div>
                        {distribution.beneficiaries && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">
                              Beneficiaries: {distribution.beneficiaries}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        distribution.status === 'completed' ? 'bg-green-100 text-green-800' :
                        distribution.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        distribution.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {distribution.status}
                      </span>
                      {distribution.transactionHash && (
                        <p className="text-xs text-gray-500 mt-2">
                          TX: {distribution.transactionHash.substring(0, 10)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {distribution.category && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {distribution.category}
                        </span>
                        {distribution.proofOfDistribution && (
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            View Proof
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Share className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No distributions found</h3>
            <p className="text-gray-500 mb-6">
              {user.role === 'ngo' 
                ? "You haven't created any distributions yet. Start distributing aid today!"
                : "No distributions match your current filters."
              }
            </p>
            {user.role === 'ngo' && (
              <Link
                to="/create-distribution"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Distribution
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Distributions;
