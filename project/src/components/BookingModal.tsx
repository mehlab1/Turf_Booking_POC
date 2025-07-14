import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { X, Clock, MapPin, User, Star, Gift } from 'lucide-react';

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

interface BookingModalProps {
  ground: Ground;
  slot: Slot;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ ground, slot, onClose, onConfirm }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [duration, setDuration] = useState('1');
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 Hour', multiplier: 1 },
    { value: '2', label: '2 Hours', multiplier: 2 },
    { value: '4', label: 'Half Day (4 hours)', multiplier: 4 },
    { value: '8', label: 'Full Day (8 hours)', multiplier: 8 },
  ];

  const selectedDuration = durationOptions.find(d => d.value === duration)!;
  const basePrice = slot.price * selectedDuration.multiplier;
  const loyaltyDiscount = loyaltyPointsUsed * 10; // 1 point = 10 PKR discount
  const finalPrice = Math.max(0, basePrice - loyaltyDiscount);

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ground_id: ground.id,
          date: slot.date,
          time: slot.time,
          duration: selectedDuration.label,
          loyalty_points_used: loyaltyPointsUsed,
          total_price: finalPrice,
        }),
      });

      if (response.ok) {
        onConfirm();
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Duration</h3>
        <p className="text-gray-600">Choose how long you want to play</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {durationOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDuration(option.value)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              duration === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              <span className="text-blue-900 font-bold">
                PKR {slot.price * option.multiplier}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
        >
          Next: Loyalty Points
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Use Loyalty Points</h3>
        <p className="text-gray-600">Apply your points for discounts</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="w-8 h-8 text-blue-600" />
          <div>
            <h4 className="font-bold text-blue-900">Available Points: {user?.loyalty_points}</h4>
            <p className="text-sm text-blue-700">1 point = PKR 10 discount</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points to use (max: {Math.min(user?.loyalty_points || 0, Math.floor(basePrice / 10))})
            </label>
            <input
              type="number"
              min="0"
              max={Math.min(user?.loyalty_points || 0, Math.floor(basePrice / 10))}
              value={loyaltyPointsUsed}
              onChange={(e) => setLoyaltyPointsUsed(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span>Base Price:</span>
              <span>PKR {basePrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Loyalty Discount:</span>
              <span className="text-green-600">-PKR {loyaltyDiscount}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Final Price:</span>
                <span className="text-blue-900">PKR {finalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Confirm</h3>
        <p className="text-gray-600">Please review your booking details</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Ground Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{ground.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{ground.rating} rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{ground.sport === 'Cricket' ? '🏏' : '⚽'}</span>
                <span>{ground.sport}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Booking Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{slot.date} at {slot.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{selectedDuration.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-gray-500" />
                <span>{loyaltyPointsUsed} points used</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Amount:</span>
            <span className="text-blue-900">PKR {finalPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {isBooking ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Ground</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-900' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;