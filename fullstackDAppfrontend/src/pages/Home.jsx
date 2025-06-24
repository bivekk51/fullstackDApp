import { Link } from 'react-router-dom';
import { Heart, Shield, Globe, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">
              Transparent Charity with Blockchain
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our decentralized platform where every donation is tracked, verified, and distributed transparently. 
              Make a real impact with complete visibility into how your contributions help those in need.
            </p>
            <div className="space-x-4">
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/donations" 
                className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Donations
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How CharityChain Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform uses blockchain technology to ensure transparency and accountability in charitable giving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make a Donation</h3>
              <p className="text-gray-600">
                Donors can contribute funds to support various causes. Every donation is recorded on the blockchain for transparency.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Distribution</h3>
              <p className="text-gray-600">
                NGOs distribute funds to beneficiaries with proof and documentation, ensuring aid reaches those who need it most.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
              <p className="text-gray-600">
                View real-time updates on how your donations are making a difference in communities around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Join Our Community
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Whether you're a donor wanting to make a difference or an NGO looking to distribute aid transparently, 
                CharityChain provides the tools and transparency you need.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Join thousands of donors worldwide</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">100% transparent transactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Global impact tracking</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h3>
                <p className="text-gray-600 mb-6">
                  Create your account and begin making a transparent impact today.
                </p>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
