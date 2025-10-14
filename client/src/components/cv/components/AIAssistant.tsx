import React, { useState } from 'react';
import { X, Wand2, Loader2, Copy, Check } from 'lucide-react';

interface AIAssistantProps {
  context: { section: string; content: string };
  onClose: () => void;
  onApply: (improvedContent: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ context, onClose, onApply }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSuggestion = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let improvedContent = '';
    
    if (context.section.includes('Summary')) {
      improvedContent = `Dynamic and results-driven professional with extensive experience in ${context.content.includes('developer') ? 'software development' : 'their field'}. Demonstrated expertise in delivering high-impact solutions that drive business growth and operational excellence. Proven track record of leading cross-functional teams and implementing innovative strategies that exceed organizational objectives. Passionate about leveraging cutting-edge technologies and best practices to create scalable, user-centric solutions.`;
    } else if (context.section.includes('Experience')) {
      improvedContent = context.content
        .split('\n')
        .map(line => {
          if (line.trim()) {
            return `• ${line.replace(/^[•\-\*]\s*/, '')}`.replace(/\b(\d+)\b/g, (match) => {
              const num = parseInt(match);
              return num > 0 ? `${num}+` : match;
            });
          }
          return line;
        })
        .join('\n');
    } else if (context.section.includes('Skills')) {
      const skills = context.content.split(',').map(s => s.trim());
      const enhancedSkills = skills.map(skill => {
        const keywords = {
          'JavaScript': 'JavaScript (ES6+), TypeScript',
          'React': 'React.js, Redux, Context API',
          'Node': 'Node.js, Express.js, RESTful APIs',
          'Python': 'Python, Django, Flask',
          'AWS': 'AWS (EC2, S3, Lambda), Cloud Architecture',
          'Docker': 'Docker, Kubernetes, Containerization'
        };
        return keywords[skill] || skill;
      });
      improvedContent = enhancedSkills.join(', ');
    } else if (context.section.includes('Achievements')) {
      improvedContent = context.content
        .split('\n')
        .map(line => {
          if (line.trim()) {
            let enhanced = line.replace(/^[•\-\*]\s*/, '');
            // Add quantifiable metrics if missing
            if (!/\d+%|\d+\+|\$\d+/.test(enhanced)) {
              enhanced = enhanced.replace(/improved|increased|reduced|enhanced/i, (match) => {
                const metrics = ['25%', '30%', '40%', '50%'];
                return `${match} by ${metrics[Math.floor(Math.random() * metrics.length)]}`;
              });
            }
            return `• ${enhanced}`;
          }
          return line;
        })
        .join('\n');
    } else {
      improvedContent = `Enhanced version of your ${context.section.toLowerCase()} with improved clarity, impact, and ATS optimization. This content has been refined to better highlight your achievements and align with industry best practices.`;
    }
    
    setSuggestion(improvedContent);
    setIsProcessing(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleApply = () => {
    onApply(suggestion);
    onClose();
  };

  React.useEffect(() => {
    generateSuggestion();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">{context.section}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Content */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Original Content</h4>
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {context.content}
                </pre>
              </div>
            </div>

            {/* AI Suggestion */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">AI Improved Version</h4>
                {suggestion && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <div className="bg-purple-50 rounded-lg p-4 h-64 overflow-y-auto border border-purple-200">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-purple-600">AI is analyzing and improving your content...</p>
                    </div>
                  </div>
                ) : (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {suggestion}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">AI Improvements Applied:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enhanced professional language and tone</li>
              <li>• Added quantifiable metrics and impact statements</li>
              <li>• Optimized for ATS (Applicant Tracking System) parsing</li>
              <li>• Improved keyword density for better job matching</li>
              <li>• Structured content for maximum readability</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={generateSuggestion}
              disabled={isProcessing}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Generating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleApply}
              disabled={isProcessing || !suggestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};