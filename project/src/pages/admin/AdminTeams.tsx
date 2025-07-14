import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { Users, Trophy, DollarSign, Calendar, Gift } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  bookings: number;
  total_spent: number;
}

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    discount_percentage: 10,
    min_bookings: 5,
    valid_until: '',
    points_multiplier: 2
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    // In a real app, this would make an API call
    console.log('Creating campaign:', campaign);
    setShowCampaignModal(false);
    setCampaign({
      name: '',
      description: '',
      discount_percentage: 10,
      min_bookings: 5,
      valid_until: '',
      points_multiplier: 2
    });
  };

  const loyaltyTiers = [
    { name: 'Bronze', min_spent: 0, benefits: '5% discount, 1x points', color: 'bg-orange-100 text-orange-800' },
    { name: 'Silver', min_spent: 25000, benefits: '10% discount, 1.5x points', color: 'bg-gray-100 text-gray-800' },
    { name: 'Gold', min_spent: 50000, benefits: '15% discount, 2x points', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Platinum', min_spent: 100000, benefits: '20% discount, 3x points', color: 'bg-purple-100 text-purple-800' },
  ];

  const getTeamTier = (totalSpent: number) => {
    if (totalSpent >= 100000) return loyaltyTiers[3];
    if (totalSpent >= 50000) return loyaltyTiers[2];
    if (totalSpent >= 25000) return loyaltyTiers[1];
    return loyaltyTiers[0];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Manager</h1>
            <p className="text-xl text-gray-600">Track teams and manage loyalty programs</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCampaignModal(true)}
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <Gift className="w-5 h-5" />
            <span>Create Campaign</span>
          </motion.button>
        </motion.div>

        {/* Top Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Teams by Spending</h3>
          
          <div className="space-y-4">
            {teams.map((team, index) => {
              const tier = getTeamTier(team.total_spent);
              return (
                <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{team.name}</h4>
                      <p className="text-sm text-gray-600">{team.bookings} bookings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${tier.color}`}>
                      {tier.name}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-blue-900">PKR {team.total_spent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total spent</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Loyalty Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Loyalty Tiers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loyaltyTiers.map((tier, index) => (
              <div key={tier.name} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{tier.name}</h4>
                  <Trophy className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Min. spend: PKR {tier.min_spent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{tier.benefits}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Campaign History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Campaigns</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div>
                <h4 className="font-bold text-green-900">Weekend Warriors</h4>
                <p className="text-sm text-green-700">20% off weekend bookings for teams with 10+ bookings</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600">Active</span>
                <p className="text-sm text-gray-600">Expires: Jan 31, 2025</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
              <div>
                <h4 className="font-bold text-yellow-900">Early Bird Special</h4>
                <p className="text-sm text-yellow-700">15% off morning slots (6AM-10AM)</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-yellow-600">Active</span>
                <p className="text-sm text-gray-600">Expires: Feb 15, 2025</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-bold text-gray-900">New Year Special</h4>
                <p className="text-sm text-gray-700">Double loyalty points on all bookings</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-600">Expired</span>
                <p className="text-sm text-gray-600">Ended: Jan 15, 2025</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Campaign Creation Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create Loyalty Campaign</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaign.name}
                    onChange={(e) => setCampaign({...campaign, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={campaign.description}
                    onChange={(e) => setCampaign({...campaign, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the campaign"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={campaign.discount_percentage}
                      onChange={(e) => setCampaign({...campaign, discount_percentage: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Bookings
                    </label>
                    <input
                      type="number"
                      value={campaign.min_bookings}
                      onChange={(e) => setCampaign({...campaign, min_bookings: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={campaign.valid_until}
                    onChange={(e) => setCampaign({...campaign, valid_until: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={campaign.points_multiplier}
                    onChange={(e) => setCampaign({...campaign, points_multiplier: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-4 py-2 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminTeams;