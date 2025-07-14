import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import BookingModal from '../components/BookingModal';
import { Star, MapPin, Calendar, Clock, CloudRain, Sun, Cloud } from 'lucide-react';
import { toast } from 'react-toastify';

interface Ground {
  id: number;
  name: string;
  city: string;
  sport: string;
  image: string;
  price: number;
  rating: number;
}

interface Slot {
  ground_id: number;
  date: string;
  time: string;
  demand: 'low' | 'medium' | 'high';
  available: boolean;
  price: number;
}

interface Weather {
  day: string;
  high: number;
  low: number;
  icon: string;
}

const GroundDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ground, setGround] = useState<Ground | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [weather, setWeather] = useState<Weather[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGroundDetails();
      fetchSlots();
      fetchWeather();
    }
  }, [id, selectedDate]);

  const fetchGroundDetails = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/grounds');
      const grounds = await response.json();
      const currentGround = grounds.find((g: Ground) => g.id === parseInt(id!));
      setGround(currentGround);
    } catch (error) {
      console.error('Error fetching ground details:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/slots/${id}`);
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/forecast/${selectedDate}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    toast.success('Booking confirmed successfully!');
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandText = (demand: string) => {
    switch (demand) {
      case 'high': return 'High Demand';
      case 'medium': return 'Medium Demand';
      case 'low': return 'Low Demand';
      default: return 'Available';
    }
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloud': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'cloud-rain': return <CloudRain className="w-5 h-5 text-blue-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (isLoading || !ground) {
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
        {/* Ground Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="relative h-64">
            <img
              src={ground.image}
              alt={ground.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{ground.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5" />
                    <span>{ground.city}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>{ground.rating}</span>
                  </div>
                  <div className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                    {ground.sport === 'Cricket' ? '🏏' : '⚽'} {ground.sport}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Date Selection and Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
            {weather.length > 0 && (
              <div className="flex items-center space-x-2 text-gray-600">
                {getWeatherIcon(weather[0].icon)}
                <span>{weather[0].day}</span>
                <span>{weather[0].high}°/{weather[0].low}°C</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Available Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h2>
          
          {slots.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No slots available for selected date</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, index) => (
                <motion.div
                  key={`${slot.date}-${slot.time}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSlotClick(slot)}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(slot.demand)}`}>
                      {getDemandText(slot.demand)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-900">PKR {slot.price}</span>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && ground && (
          <BookingModal
            ground={ground}
            slot={selectedSlot}
            onClose={() => setShowBookingModal(false)}
            onConfirm={handleBookingComplete}
          />
        )}
      </div>
    </Layout>
  );
};

export default GroundDetails;