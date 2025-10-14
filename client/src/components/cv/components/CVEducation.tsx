import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, MapPin, Calendar, Award } from 'lucide-react';

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  achievements: string[];
}

interface CVEducationProps {
  data: Education[];
  isEditable: boolean;
  onChange: (data: Education[]) => void;
}

export const CVEducation: React.FC<CVEducationProps> = ({ data, isEditable, onChange }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      achievements: []
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addAchievement = (id: string) => {
    const education = data.find(edu => edu.id === id);
    if (education) {
      updateEducation(id, 'achievements', [...education.achievements, '']);
    }
  };

  const removeAchievement = (id: string, index: number) => {
    const education = data.find(edu => edu.id === id);
    if (education) {
      const newAchievements = education.achievements.filter((_, i) => i !== index);
      updateEducation(id, 'achievements', newAchievements);
    }
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const education = data.find(edu => edu.id === id);
    if (education) {
      const newAchievements = [...education.achievements];
      newAchievements[index] = value;
      updateEducation(id, 'achievements', newAchievements);
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
          Education
        </h2>
        {isEditable && (
          <button
            onClick={addEducation}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Education</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {data.map((education) => (
          <div key={education.id} className="relative">
            {isEditable && (
              <button
                onClick={() => removeEducation(education.id)}
                className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-md"
                title="Remove education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                <EditableField
                  value={education.degree}
                  onChange={(value) => updateEducation(education.id, 'degree', value)}
                  placeholder="Degree Name"
                  className="font-semibold"
                />
              </h3>
              
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4" />
                  <EditableField
                    value={education.institution}
                    onChange={(value) => updateEducation(education.id, 'institution', value)}
                    placeholder="Institution Name"
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <EditableField
                    value={education.location}
                    onChange={(value) => updateEducation(education.id, 'location', value)}
                    placeholder="Location"
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {isEditable ? (
                      <input
                        type="month"
                        value={education.graduationDate}
                        onChange={(e) => updateEducation(education.id, 'graduationDate', e.target.value)}
                        className="text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none"
                      />
                    ) : (
                      formatDate(education.graduationDate)
                    )}
                  </span>
                </div>

                {(education.gpa || isEditable) && (
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">
                      GPA: <EditableField
                        value={education.gpa || ''}
                        onChange={(value) => updateEducation(education.id, 'gpa', value)}
                        placeholder="3.8"
                        className="text-sm"
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {(education.achievements.length > 0 || isEditable) && (
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Achievements & Honors</h4>
                {education.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      {isEditable ? (
                        <div className="flex items-center space-x-2">
                          <input
                            value={achievement}
                            onChange={(e) => updateAchievement(education.id, index, e.target.value)}
                            placeholder="Achievement or honor..."
                            className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none"
                          />
                          <button
                            onClick={() => removeAchievement(education.id, index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove achievement"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-700 text-sm">{achievement}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {isEditable && (
                  <button
                    onClick={() => addAchievement(education.id)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm mt-2"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add achievement</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};