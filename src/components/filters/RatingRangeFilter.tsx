import React from 'react';
import { Star } from 'lucide-react';

interface RatingRangeFilterProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

const RatingRangeFilter: React.FC<RatingRangeFilterProps> = ({ range, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    onChange([newMin, Math.max(newMin, range[1])]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    onChange([Math.min(range[0], newMax), newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-sm text-text-secondary">
          {range[0].toFixed(1)} - {range[1].toFixed(1)} stars
        </span>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Minimum Rating</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={range[0]}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm text-text-secondary mb-2">Maximum Rating</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={range[1]}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default RatingRangeFilter;