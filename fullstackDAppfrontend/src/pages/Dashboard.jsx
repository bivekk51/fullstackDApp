import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { donationAPI, distributionAPI } from '../services/api';
import { Heart, Share, Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDistributions: 0,
    myDonations: 0,
    myDistributions: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentDistributions, setRecentDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [donationsRes, distributionsRes] = await Promise.all([
        donationAPI.getAll(),
        distributionAPI.getAll(),
      ]);

      setRecentDonations(donationsRes.data.slice(0, 5));
      setRecentDistributions(distributionsRes.data.slice(0, 5));

      let userDonations = 0;
      let userDistributions = 0;
      let totalDonationAmount = 0;
      let totalDistributionAmount = 0;

      if (user.role === 'donor') {
        const userDonationsRes = await donationAPI.getUserDonations();
        userDonations = userDonationsRes.data.length;
        totalDonationAmount = userDonationsRes.data.reduce((sum, donation) => sum + donation.amount, 0);
      }

      if (user.role === 'ngo') {
        const userDistributionsRes = await distributionAPI.getNgoDistributions();
        userDistributions = userDistributionsRes.data.length;
        totalDistributionAmount = userDistributionsRes.data.reduce((sum, dist) => sum + dist.amount, 0);
      }

      setStats({
        totalDonations: donationsRes.data.length,
        totalDistributions: distributionsRes.data.length,
        myDonations: user.role === 'donor' ? userDonations : totalDonationAmount,
        myDistributions: user.role === 'ngo' ? userDistributions : totalDistributionAmount,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your charitable activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Share className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Distributions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDistributions}</p>
              </div>
            </div>
          </div>

          {user.role === 'donor' && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Donations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.myDonations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Impact Score</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 100)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'ngo' && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Distributions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.myDistributions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">People Helped</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 500)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
            </div>
            <div className="p-6">
              {recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">${donation.amount}</p>
                        <p className="text-sm text-gray-600">{donation.description}</p>
                        <p className="text-xs text-gray-500">by {donation.donor?.name || 'Anonymous'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(donation.createdAt).toLocaleDateString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          donation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No donations yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Distributions</h2>
            </div>
            <div className="p-6">
              {recentDistributions.length > 0 ? (
                <div className="space-y-4">
                  {recentDistributions.map((distribution) => (
                    <div key={distribution._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">${distribution.amount}</p>
                        <p className="text-sm text-gray-600">{distribution.description}</p>
                        <p className="text-xs text-gray-500">by {distribution.ngo?.name || 'Unknown NGO'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(distribution.createdAt).toLocaleDateString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          distribution.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {distribution.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No distributions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
