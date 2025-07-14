import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { Save, DollarSign, TrendingUp, Cloud, Users } from 'lucide-react';

interface PricingData {
  base_prices: {
    cricket: number;
    football: number;
  };
  multipliers: {
    peak_hours: number;
    off_peak: number;
    weekend: number;
    high_demand: number;
    rain_forecast: number;
  };
}

const AdminPricing: React.FC = () => {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/pricing');
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateBasePrice = (sport: 'cricket' | 'football', value: number) => {
    if (pricing) {
      setPricing({
        ...pricing,
        base_prices: {
          ...pricing.base_prices,
          [sport]: value
        }
      });
    }
  };

  const updateMultiplier = (key: keyof PricingData['multipliers'], value: number) => {
    if (pricing) {
      setPricing({
        ...pricing,
        multipliers: {
          ...pricing.multipliers,
          [key]: value
        }
      });
    }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Manager</h1>
            <p className="text-xl text-gray-600">Configure dynamic pricing rules</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </motion.div>

        {/* Base Prices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Base Prices</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cricket Ground (per hour)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                <input
                  type="number"
                  value={pricing?.base_prices.cricket || 0}
                  onChange={(e) => updateBasePrice('cricket', parseInt(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Football Ground (per hour)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                <input
                  type="number"
                  value={pricing?.base_prices.football || 0}
                  onChange={(e) => updateBasePrice('football', parseInt(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Multipliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Dynamic Pricing Multipliers</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peak Hours (6PM-10PM)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-3 text-gray-500">x</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricing?.multipliers.peak_hours || 0}
                  onChange={(e) => updateMultiplier('peak_hours', parseFloat(e.target.value))}
                  className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Off-Peak Hours (10AM-2PM)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-3 text-gray-500">x</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricing?.multipliers.off_peak || 0}
                  onChange={(e) => updateMultiplier('off_peak', parseFloat(e.target.value))}
                  className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekend Premium
              </label>
              <div className="relative">
                <span className="absolute right-3 top-3 text-gray-500">x</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricing?.multipliers.weekend || 0}
                  onChange={(e) => updateMultiplier('weekend', parseFloat(e.target.value))}
                  className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High Demand
              </label>
              <div className="relative">
                <span className="absolute right-3 top-3 text-gray-500">x</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricing?.multipliers.high_demand || 0}
                  onChange={(e) => updateMultiplier('high_demand', parseFloat(e.target.value))}
                  className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rain Forecast Discount
              </label>
              <div className="relative">
                <span className="absolute right-3 top-3 text-gray-500">x</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricing?.multipliers.rain_forecast || 0}
                  onChange={(e) => updateMultiplier('rain_forecast', parseFloat(e.target.value))}
                  className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-3">Cricket Ground - Peak Hour</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>PKR {pricing?.base_prices.cricket || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Multiplier:</span>
                  <span>x {pricing?.multipliers.peak_hours || 0}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Final Price:</span>
                    <span>PKR {Math.round((pricing?.base_prices.cricket || 0) * (pricing?.multipliers.peak_hours || 1))}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-bold text-green-900 mb-3">Football Ground - Off-Peak</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>PKR {pricing?.base_prices.football || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Off-Peak Multiplier:</span>
                  <span>x {pricing?.multipliers.off_peak || 0}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Final Price:</span>
                    <span>PKR {Math.round((pricing?.base_prices.football || 0) * (pricing?.multipliers.off_peak || 1))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weather Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Cloud className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900">Weather Rules</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium">Auto-disable bookings on rain forecast</h4>
                <p className="text-sm text-gray-600">Automatically block slots when rain is predicted</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium">Apply rain discount automatically</h4>
                <p className="text-sm text-gray-600">Reduce prices when rain is forecast</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminPricing;