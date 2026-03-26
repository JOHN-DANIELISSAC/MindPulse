// src/components/MoodSlider.jsx
import { getSliderColor, getMoodEmoji } from '../utils/moodUtils'
import { motion, AnimatePresence } from 'framer-motion'

export default function MoodSlider({ value, onChange }) {
  const color = getSliderColor(value)
  const emoji = getMoodEmoji(value)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">How are you feeling?</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <span className="text-4xl">{emoji}</span>
            <span
              className="text-3xl font-extrabold tabular-nums"
              style={{ color }}
            >
              {value}
            </span>
            <span className="text-gray-400 text-lg font-medium">/10</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative py-2">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${(value - 1) / 9 * 100}%, #E9D5FF ${(value - 1) / 9 * 100}%, #E9D5FF 100%)`,
          }}
        />
        <style>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          input[type='range']::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}</style>
      </div>

      <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
        <span>Terrible</span>
        <span>Okay</span>
        <span>Amazing</span>
      </div>

      {/* Tick markers */}
      <div className="flex justify-between px-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-6 h-6 rounded-full text-xs font-bold transition-all duration-150 ${
              n === value
                ? 'text-white shadow-md scale-110'
                : 'bg-purple-100 text-purple-400 hover:bg-purple-200'
            }`}
            style={n === value ? { backgroundColor: color } : {}}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
