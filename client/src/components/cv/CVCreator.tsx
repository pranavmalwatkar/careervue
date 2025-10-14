import React, { useState, useEffect, useRef } from 'react';
import { Download, Eye, Wand2, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CVHeader } from './components/CVHeader';
import { CVSummary } from './components/CVSummary';
import { CVExperience } from './components/CVExperience';
import { CVEducation } from './components/CVEducation';
import { CVSkills } from './components/CVSkills';
import { CVAchievements } from './components/CVAchievements';
import { AIAssistant } from './components/AIAssistant';
import { useChatbot } from '../../contexts/ChatbotContext';

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    profilePhoto?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  achievements: string[];
}

const defaultCVData: CVData = {
  personalInfo: {
    fullName: 'Pranav Malwatkar',
    email: 'malwatkarpranav@gmail.com',
    phone: '+91 9876543210',
    location: 'Pune, Maharashtra, India',
    linkedin: 'linkedin.com/in/pranav-malwatkar-9834b1239',
    github: 'github.com/pranavmalwatkar',
    website: 'pranavmalwatkar.dev'
  },
  summary: 'Experienced Full-Stack Developer with 3+ years of expertise in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams. Passionate about creating user-centric solutions and driving digital transformation initiatives.',
  experience: [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Solutions',
      location: 'Pune, India',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: [
        'Led development of 5+ enterprise web applications using React, Node.js, and MongoDB',
        'Improved application performance by 40% through code optimization and caching strategies',
        'Mentored junior developers and established coding standards for the team',
        'Collaborated with cross-functional teams to deliver projects 20% ahead of schedule'
      ]
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'Digital Innovations Ltd',
      location: 'Mumbai, India',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: [
        'Developed and maintained 10+ client websites using modern web technologies',
        'Implemented responsive designs that increased mobile user engagement by 35%',
        'Integrated third-party APIs and payment gateways for e-commerce platforms',
        'Participated in agile development processes and code review sessions'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Engineering in Computer Science',
      institution: 'Pune Institute of Technology',
      location: 'Pune, India',
      graduationDate: '2020-05',
      gpa: '8.5/10',
      achievements: [
        'Dean\'s List for 3 consecutive semesters',
        'Led university coding club with 100+ members',
        'Winner of inter-college hackathon 2019'
      ]
    }
  ],
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    soft: ['Leadership', 'Problem Solving', 'Communication', 'Team Collaboration', 'Project Management'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Native)'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Scrum Master Certified']
  },
  achievements: [
    'Increased team productivity by 30% through implementation of automated testing frameworks',
    'Successfully delivered 15+ projects with 100% client satisfaction rate',
    'Reduced application load time by 50% through performance optimization techniques',
    'Mentored 8 junior developers, with 6 receiving promotions within 12 months'
  ]
};

export const CVCreator: React.FC = () => {
  const { openChatbot } = useChatbot();
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiContext, setAIContext] = useState<{ section: string; content: string }>({ section: '', content: '' });
  const cvRef = useRef<HTMLDivElement>(null);

  // Auto-save to session storage
  useEffect(() => {
    const savedData = sessionStorage.getItem('cvData');
    if (savedData) {
      try {
        setCVData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved CV data:', error);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const updateCVData = (section: keyof CVData, data: any) => {
    setCVData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const generatePDF = async () => {
    if (!cvRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const element = cvRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Check if content fits on one page
      const scaledHeight = imgHeight * ratio;
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, scaledHeight);
      } else {
        // Split into multiple pages
        const pageHeight = pdfHeight / ratio;
        let position = 0;
        
        while (position < imgHeight) {
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = imgWidth;
          pageCanvas.height = Math.min(pageHeight, imgHeight - position);
          
          if (pageCtx) {
            pageCtx.drawImage(canvas, 0, -position);
            const pageImgData = pageCanvas.toDataURL('image/png');
            
            if (position > 0) {
              pdf.addPage();
            }
            
            pdf.addImage(pageImgData, 'PNG', imgX, imgY, imgWidth * ratio, pageCanvas.height * ratio);
          }
          
          position += pageHeight;
        }
      }

      pdf.save(`${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAIAssistance = (section: string, content: string, action: string) => {
    setAIContext({ section: `${section} - ${action}`, content });
    setShowAIAssistant(true);
  };

  const applyAISuggestion = (improvedContent: string) => {
    // Apply the AI suggestion based on context
    if (aiContext.section.includes('Summary')) {
      updateCVData('summary', improvedContent);
    }
    // Add more section handling as needed
    setShowAIAssistant(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV Creator</h1>
              <p className="text-gray-600">Create a professional, ATS-friendly resume</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isPreviewMode
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* AI Assistant Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Wand2 className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>

        {/* CV Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CV Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div
                ref={cvRef}
                className="cv-content bg-white p-8 min-h-[297mm] max-w-[210mm] mx-auto"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#1f2937'
                }}
              >
                <CVHeader
                  data={cvData.personalInfo}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('personalInfo', data)}
                />

                <CVSummary
                  data={cvData.summary}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('summary', data)}
                  onAIAssist={(content) => handleAIAssistance('Summary', content, 'Improve')}
                />

                <CVExperience
                  data={cvData.experience}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('experience', data)}
                  onAIAssist={(content) => handleAIAssistance('Experience', content, 'Improve')}
                />

                <CVEducation
                  data={cvData.education}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('education', data)}
                />

                <CVSkills
                  data={cvData.skills}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('skills', data)}
                  onAIAssist={(content) => handleAIAssistance('Skills', content, 'Add Keywords')}
                />

                <CVAchievements
                  data={cvData.achievements}
                  isEditable={!isPreviewMode}
                  onChange={(data) => updateCVData('achievements', data)}
                  onAIAssist={(content) => handleAIAssistance('Achievements', content, 'Improve')}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CV Tips</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your CV to 1-2 pages maximum for optimal readability</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use action verbs and quantify your achievements with numbers</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tailor your CV for each job application using relevant keywords</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use our AI assistant to optimize content for ATS systems</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Auto-save Status</h4>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Save className="h-4 w-4" />
                  <span>Changes saved automatically</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <AIAssistant
            context={aiContext}
            onClose={() => setShowAIAssistant(false)}
            onApply={applyAISuggestion}
          />
        )}
      </div>
    </div>
  );
};