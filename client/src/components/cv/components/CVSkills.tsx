import React, { useState } from "react";
import { Plus, X, Wand2 } from "lucide-react";

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}

interface CVSkillsProps {
  data: Skills;
  isEditable: boolean;
  onChange: (data: Skills) => void;
  onAIAssist: (content: string) => void;
}

const EditableField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  type?: string;
  isEditable: boolean;
}> = ({ value, onChange, placeholder, className = '', type = 'text', isEditable }) => {
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

const SkillCategory: React.FC<{
  title: string;
  category: keyof Skills;
  skills: string[];
  placeholder: string;
  isEditable: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onBlurAdd: () => void;
}> = React.memo(({ title, category, skills, placeholder, isEditable, inputValue, onInputChange, onAdd, onRemove, onBlurAdd }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2 mb-3">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
        >
          {skill}
          {isEditable && (
            <button
              onClick={() => onRemove(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
    </div>

    {isEditable && (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={onBlurAdd}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={onAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    )}
  </div>
));

export const CVSkills: React.FC<CVSkillsProps> = ({
  data,
  isEditable,
  onChange,
  onAIAssist,
}) => {
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  });

  const addSkill = (category: keyof Skills) => {
    if (newSkill[category].trim()) {
      onChange({
        ...data,
        [category]: [...data[category], newSkill[category].trim()],
      });
      setNewSkill({ ...newSkill, [category]: "" });
    }
  };

  const removeSkill = (category: keyof Skills, index: number) => {
    onChange({
      ...data,
      [category]: data[category].filter((_, i) => i !== index),
    });
  };

  const addOnBlur = (category: keyof Skills) => {
    if (newSkill[category].trim()) {
      addSkill(category);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Skills & Competencies
        </h2>
        {isEditable && (
          <button
            onClick={() => onAIAssist(Object.values(data).flat().join(", "))}
            className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
            title="Add Keywords with AI"
          >
            <Wand2 className="h-4 w-4" />
            <span>Add Keywords</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SkillCategory
            title="Technical Skills"
            category="technical"
            skills={data.technical}
            placeholder="e.g., JavaScript, Python, React"
            isEditable={isEditable}
            inputValue={newSkill.technical}
            onInputChange={(value) => setNewSkill(prev => ({ ...prev, technical: value }))}
            onAdd={() => addSkill("technical")}
            onRemove={(index) => removeSkill("technical", index)}
            onBlurAdd={() => addOnBlur("technical")}
          />

          <SkillCategory
            title="Soft Skills"
            category="soft"
            skills={data.soft}
            placeholder="e.g., Leadership, Communication"
            isEditable={isEditable}
            inputValue={newSkill.soft}
            onInputChange={(value) => setNewSkill(prev => ({ ...prev, soft: value }))}
            onAdd={() => addSkill("soft")}
            onRemove={(index) => removeSkill("soft", index)}
            onBlurAdd={() => addOnBlur("soft")}
          />
        </div>

        <div>
          <SkillCategory
            title="Languages"
            category="languages"
            skills={data.languages}
            placeholder="e.g., English (Fluent), Spanish (Basic)"
            isEditable={isEditable}
            inputValue={newSkill.languages}
            onInputChange={(value) => setNewSkill(prev => ({ ...prev, languages: value }))}
            onAdd={() => addSkill("languages")}
            onRemove={(index) => removeSkill("languages", index)}
            onBlurAdd={() => addOnBlur("languages")}
          />

          <SkillCategory
            title="Certifications"
            category="certifications"
            skills={data.certifications}
            placeholder="e.g., AWS Certified Developer"
            isEditable={isEditable}
            inputValue={newSkill.certifications}
            onInputChange={(value) => setNewSkill(prev => ({ ...prev, certifications: value }))}
            onAdd={() => addSkill("certifications")}
            onRemove={(index) => removeSkill("certifications", index)}
            onBlurAdd={() => addOnBlur("certifications")}
          />
        </div>
      </div>
    </section>
  );
};
