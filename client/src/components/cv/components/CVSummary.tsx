import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface CVSummaryProps {
  data: string;
  isEditable: boolean;
  onChange: (data: string) => void;
  onAIAssist: (content: string) => void;
}

export const CVSummary: React.FC<CVSummaryProps> = ({ data, isEditable, onChange, onAIAssist }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(data);

  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(data);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(data);
    setIsEditing(false);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Professional Summary
        </h2>
        {isEditable && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAIAssist(data)}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              title="Improve with AI"
            >
              <Wand2 className="h-4 w-4" />
              <span>Improve</span>
            </button>
          </div>
        )}
      </div>

      {isEditable && isEditing ? (
        <div className="space-y-3">
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            placeholder="Write a compelling professional summary..."
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p
          className={`text-gray-700 leading-relaxed ${
            isEditable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors' : ''
          }`}
          onClick={isEditable ? handleEdit : undefined}
          title={isEditable ? 'Click to edit' : undefined}
        >
          {data || (isEditable ? 'Click to add your professional summary...' : '')}
        </p>
      )}
    </section>
  );
};