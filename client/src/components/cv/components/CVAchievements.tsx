import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Trophy } from 'lucide-react';

interface CVAchievementsProps {
  data: string[];
  isEditable: boolean;
  onChange: (data: string[]) => void;
  onAIAssist: (content: string) => void;
}

export const CVAchievements: React.FC<CVAchievementsProps> = ({ data, isEditable, onChange, onAIAssist }) => {
  const [newAchievement, setNewAchievement] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      onChange([...data, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateAchievement = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onChange(newData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAchievement();
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Key Achievements
        </h2>
        {isEditable && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAIAssist(data.join('\n'))}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              title="Improve with AI"
            >
              <Wand2 className="h-4 w-4" />
              <span>Improve</span>
            </button>
            <button
              onClick={addAchievement}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Achievement</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {data.map((achievement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Trophy className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {isEditable ? (
                <div className="flex items-center space-x-2">
                  <textarea
                    value={achievement}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    placeholder="Describe a key achievement with quantifiable results..."
                    className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none resize-none"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                  <button
                    onClick={() => removeAchievement(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove achievement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-700">{achievement}</p>
              )}
            </div>
          </div>
        ))}

        {isEditable && (
          <div className="flex items-center space-x-3 mt-4">
            <Trophy className="h-5 w-5 text-gray-300 flex-shrink-0" />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new achievement..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={addAchievement}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};