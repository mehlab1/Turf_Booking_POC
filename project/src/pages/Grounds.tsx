import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search, MapPin, Star, Filter } from 'lucide-react';

interface Ground {
  id: number;
  name: string;
  city: string;
  sport: string;
  image: string;
  price: number;
  rating: number;
}

const Grounds: React.FC = () => {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGrounds();
  }, []);

  useEffect(() => {
    filterGrounds();
  }, [grounds, searchTerm, selectedCity, selectedSport]);

  const fetchGrounds = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/grounds');
      const data = await response.json();
      setGrounds(data);
      setFilteredGrounds(data);
    } catch (error) {
      console.error('Error fetching grounds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGrounds = () => {
    let filtered = grounds;

    if (searchTerm) {
      filtered = filtered.filter(ground =>
        ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ground.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(ground => ground.city === selectedCity);
    }

    if (selectedSport) {
      filtered = filtered.filter(ground => ground.sport === selectedSport);
    }

    setFilteredGrounds(filtered);
  };

  const cities = [...new Set(grounds.map(ground => ground.city))];
  const sports = [...new Set(grounds.map(ground => ground.sport))];

  const getSportIcon = (sport: string) => {
    return sport === 'Cricket' ? '🏏' : '⚽';
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
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Ground</h1>
          <p className="text-xl text-gray-600">Choose from premium cricket and football venues</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search grounds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Sports</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <button className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
              View Map
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-600"
        >
          <p>{filteredGrounds.length} ground{filteredGrounds.length !== 1 ? 's' : ''} found</p>
        </motion.div>

        {/* Ground Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrounds.map((ground, index) => (
            <motion.div
              key={ground.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={ground.image}
                  alt={ground.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{ground.rating}</span>
                </div>
                <div className="absolute top-4 left-4 bg-blue-900 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {getSportIcon(ground.sport)} {ground.sport}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ground.name}</h3>
                <div className="flex items-center space-x-1 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{ground.city}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-900">PKR {ground.price}</span>
                    <span className="text-gray-600 text-sm">/hour</span>
                  </div>
                  <Link
                    to={`/ground/${ground.id}`}
                    className="bg-blue-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-800 transition-colors"
                  >
                    View Slots
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGrounds.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">No grounds found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedSport('');
              }}
              className="mt-4 text-blue-900 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Grounds;