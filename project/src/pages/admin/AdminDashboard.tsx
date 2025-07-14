import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Trophy, MapPin, Clock } from 'lucide-react';

interface Analytics {
  total_bookings: number;
  total_revenue: number;
  occupancy_rate: number;
  popular_slots: string[];
  revenue_by_day: { day: string; revenue: number }[];
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];

  const occupancyData = [
    { name: 'Occupied', value: analytics?.occupancy_rate || 0 },
    { name: 'Available', value: 100 - (analytics?.occupancy_rate || 0) },
  ];

  const statsCards = [
    {
      title: 'Total Bookings',
      value: analytics?.total_bookings || 0,
      icon: Calendar,
      color: 'bg-blue-600',
      change: '+12%'
    },
    {
      title: 'Revenue',
      value: `PKR ${analytics?.total_revenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-green-600',
      change: '+18%'
    },
    {
      title: 'Occupancy Rate',
      value: `${analytics?.occupancy_rate || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-600',
      change: '+5%'
    },
    {
      title: 'Active Grounds',
      value: '4',
      icon: MapPin,
      color: 'bg-orange-600',
      change: '+0%'
    }
  ];

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
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your grounds and bookings</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">{card.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-gray-600">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.revenue_by_day || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`PKR ${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#1E3A8A" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Occupancy Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ground Occupancy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Popular Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Time Slots</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics?.popular_slots?.map((slot, index) => (
              <div key={slot} className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{slot}</p>
                  <p className="text-sm text-gray-600">Peak slot #{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 rounded-xl p-4 transition-colors">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Add New Slot</p>
                <p className="text-sm text-gray-600">Schedule new time slot</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 bg-green-50 hover:bg-green-100 rounded-xl p-4 transition-colors">
              <Users className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Walk-in Booking</p>
                <p className="text-sm text-gray-600">Book for walk-in customer</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 bg-purple-50 hover:bg-purple-100 rounded-xl p-4 transition-colors">
              <Trophy className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-medium">Loyalty Campaign</p>
                <p className="text-sm text-gray-600">Create new campaign</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;