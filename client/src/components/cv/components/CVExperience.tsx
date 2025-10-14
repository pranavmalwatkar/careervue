import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Calendar, MapPin, Building } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface CVExperienceProps {
  data: Experience[];
  isEditable: boolean;
  onChange: (data: Experience[]) => void;
  onAIAssist: (content: string) => void;
}

export const CVExperience: React.FC<CVExperienceProps> = ({ data, isEditable, onChange, onAIAssist }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    onChange([...data, newExperience]);
    setEditingId(newExperience.id);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addDescriptionPoint = (id: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      updateExperience(id, 'description', [...experience.description, '']);
    }
  };

  const removeDescriptionPoint = (id: string, index: number) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      const newDescription = experience.description.filter((_, i) => i !== index);
      updateExperience(id, 'description', newDescription);
    }
  };

  const updateDescriptionPoint = (id: string, index: number, value: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      const newDescription = [...experience.description];
      newDescription[index] = value;
      updateExperience(id, 'description', newDescription);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const EditableField: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
    type?: string;
  }> = ({ value, onChange, placeholder, className = '', type = 'text' }) => {
    if (!isEditable) {
      return <span className={className}>{value}</span>;
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${className} border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none transition-colors`}
      />
    );
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Professional Experience
        </h2>
        {isEditable && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAIAssist(data.map(exp => exp.description.join('\n')).join('\n\n'))}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              title="Improve with AI"
            >
              <Wand2 className="h-4 w-4" />
              <span>Improve</span>
            </button>
            <button
              onClick={addExperience}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Experience</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {data.map((experience) => (
          <div key={experience.id} className="relative">
            {isEditable && (
              <button
                onClick={() => removeExperience(experience.id)}
                className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-md"
                title="Remove experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                <EditableField
                  value={experience.title}
                  onChange={(value) => updateExperience(experience.id, 'title', value)}
                  placeholder="Job Title"
                  className="font-semibold"
                />
              </h3>
              
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <EditableField
                    value={experience.company}
                    onChange={(value) => updateExperience(experience.id, 'company', value)}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <EditableField
                    value={experience.location}
                    onChange={(value) => updateExperience(experience.id, 'location', value)}
                    placeholder="Location"
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {isEditable ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="month"
                          value={experience.startDate}
                          onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                          className="text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none"
                        />
                        <span>-</span>
                        {experience.current ? (
                          <span>Present</span>
                        ) : (
                          <input
                            type="month"
                            value={experience.endDate}
                            onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                            className="text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none"
                          />
                        )}
                        <label className="flex items-center space-x-1 text-xs">
                          <input
                            type="checkbox"
                            checked={experience.current}
                            onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                            className="rounded"
                          />
                          <span>Current</span>
                        </label>
                      </div>
                    ) : (
                      `${formatDate(experience.startDate)} - ${experience.current ? 'Present' : formatDate(experience.endDate)}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-4">
              {experience.description.map((point, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    {isEditable ? (
                      <div className="flex items-center space-x-2">
                        <textarea
                          value={point}
                          onChange={(e) => updateDescriptionPoint(experience.id, index, e.target.value)}
                          placeholder="Describe your achievement or responsibility..."
                          className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none resize-none"
                          rows={1}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                        {experience.description.length > 1 && (
                          <button
                            onClick={() => removeDescriptionPoint(experience.id, index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove point"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-700">{point}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditable && (
                <button
                  onClick={() => addDescriptionPoint(experience.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add point</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};