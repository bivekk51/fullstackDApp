import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { donationAPI, distributionAPI } from '../services/api';
import { User, Mail, Shield, Edit, Heart, Share, Calendar, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (user.role === 'donor') {
        const response = await donationAPI.getUserDonations();
        const donations = response.data;
        const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
        setStats({
          totalAmount,
          totalCount: donations.length,
          recentActivity: donations.slice(0, 5),
        });
      } else if (user.role === 'ngo') {
        const response = await distributionAPI.getNgoDistributions();
        const distributions = response.data;
        const totalAmount = distributions.reduce((sum, dist) => sum + dist.amount, 0);
        setStats({
          totalAmount,
          totalCount: distributions.length,
          recentActivity: distributions.slice(0, 5),
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'donor':
        return <Heart className="w-5 h-5 text-blue-600" />;
      case 'ngo':
        return <Share className="w-5 h-5 text-green-600" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'donor':
        return 'bg-blue-100 text-blue-800';
      case 'ngo':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
                      {getRoleIcon()}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Total {user.role === 'donor' ? 'Donated' : 'Distributed'}
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {user.role === 'donor' ? (
                    <Heart className="w-6 h-6 text-green-600" />
                  ) : (
                    <Share className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCount}</p>
                <p className="text-sm text-gray-600">
                  {user.role === 'donor' ? 'Donations Made' : 'Distributions Created'}
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600">Member Since</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50 capitalize">
                      {user.role}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((activity, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              ${activity.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description.length > 50 
                                ? `${activity.description.substring(0, 50)}...` 
                                : activity.description
                              }
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.status === 'active' || activity.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.role === 'donor' && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Impact Summary</h3>
                <p className="text-blue-800 mb-4">
                  Your generous contributions have made a real difference in the lives of many people. 
                  Thank you for being part of our transparent charity network.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Communities Helped:</span>
                    <span className="font-medium text-blue-900">{Math.floor(Math.random() * 20) + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Impact Score:</span>
                    <span className="font-medium text-blue-900">{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'ngo' && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Distribution Summary</h3>
                <p className="text-green-800 mb-4">
                  Your organization has successfully distributed aid to communities in need. 
                  Your transparency and commitment help build trust in charitable giving.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">People Served:</span>
                    <span className="font-medium text-green-900">{Math.floor(Math.random() * 1000) + 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Efficiency Rating:</span>
                    <span className="font-medium text-green-900">{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
