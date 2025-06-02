import React from 'react';

interface YearRangeFilterProps {
  range: [number, number];
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({
  range,
  min,
  max,
  onChange,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(min, Math.min(range[1], parseInt(e.target.value)));
    onChange([newMin, range[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(max, Math.max(range[0], parseInt(e.target.value)));
    onChange([range[0], newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">From</label>
          <input
            type="number"
            min={min}
            max={range[1]}
            value={range[0]}
            onChange={handleMinChange}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">To</label>
          <input
            type="number"
            min={range[0]}
            max={max}
            value={range[1]}
            onChange={handleMaxChange}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={range[0]}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-border rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={range[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default YearRangeFilter;