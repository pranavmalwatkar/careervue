import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Camera, X } from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  profilePhoto?: string;
}

interface CVHeaderProps {
  data: PersonalInfo;
  isEditable: boolean;
  onChange: (data: PersonalInfo) => void;
}

export const CVHeader: React.FC<CVHeaderProps> = ({ data, isEditable, onChange }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field: string) => {
    onChange({
      ...data,
      [field]: tempValue
    });
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          ...data,
          profilePhoto: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({
      ...data,
      profilePhoto: undefined
    });
  };

  const EditableField: React.FC<{
    field: string;
    value: string;
    className?: string;
    placeholder?: string;
  }> = ({ field, value, className = '', placeholder }) => {
    if (!isEditable) {
      return <span className={className}>{value}</span>;
    }

    if (editingField === field) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave(field)}
            onBlur={() => handleSave(field)}
            className={`${className} border-b border-blue-500 bg-transparent focus:outline-none`}
            placeholder={placeholder}
            autoFocus
          />
          <button
            onClick={() => handleSave(field)}
            className="text-green-600 hover:text-green-700"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      );
    }

    return (
      <span
        className={`${className} cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors`}
        onClick={() => handleEdit(field, value)}
        title="Click to edit"
      >
        {value || placeholder}
      </span>
    );
  };

  return (
    <header className="mb-8 pb-6 border-b-2 border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <EditableField
              field="fullName"
              value={data.fullName}
              placeholder="Your Full Name"
            />
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <EditableField
                field="email"
                value={data.email}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <EditableField
                field="phone"
                value={data.phone}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <EditableField
                field="location"
                value={data.location}
                placeholder="City, State, Country"
              />
            </div>
            
            {data.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <EditableField
                  field="website"
                  value={data.website}
                  placeholder="yourwebsite.com"
                />
              </div>
            )}
            
            {data.linkedin && (
              <div className="flex items-center space-x-2">
                <Linkedin className="h-4 w-4 text-gray-400" />
                <EditableField
                  field="linkedin"
                  value={data.linkedin}
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
            )}
            
            {data.github && (
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-gray-400" />
                <EditableField
                  field="github"
                  value={data.github}
                  placeholder="github.com/yourusername"
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        <div className="ml-6">
          {data.profilePhoto ? (
            <div className="relative">
              <img
                src={data.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              {isEditable && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            isEditable && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )
          )}
        </div>
      </div>
    </header>
  );
};