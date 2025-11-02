import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Bot,
  Clock,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useChatbot } from "../../contexts/ChatbotContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

const timeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const createId = () => Math.random().toString(36).slice(2);

// Helper functions for localStorage
const getChatHistoryKey = (userId: string) =>
  `careervue_chat_history_${userId}`;

const saveChatHistory = (userId: string, messages: ChatMessage[]) => {
  try {
    localStorage.setItem(getChatHistoryKey(userId), JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

const loadChatHistory = (userId: string): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(getChatHistoryKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return [];
  }
};

const clearChatHistory = (userId: string) => {
  try {
    localStorage.removeItem(getChatHistoryKey(userId));
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
};

export const AssistantWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isChatbotOpen, closeChatbot, openChatbot } = useChatbot();
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Basic session memory of visited topics during this open tab session
  const sessionTopicsRef = useRef<Set<string>>(new Set());

  // Load chat history when user logs in or component mounts
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const savedHistory = loadChatHistory(user.id);
      if (savedHistory.length > 0) {
        setMessages(savedHistory);
      }
    }
  }, [isAuthenticated, user?.id]);

  // Save chat history whenever messages change (for logged-in users)
  useEffect(() => {
    if (isAuthenticated && user?.id && messages.length > 0) {
      saveChatHistory(user.id, messages);
    }
  }, [messages, isAuthenticated, user?.id]);

  // Initialize welcome message when chatbot opens
  useEffect(() => {
    if (isChatbotOpen && messages.length === 0) {
      setMessages([
        {
          id: createId(),
          role: "assistant",
          text: `${timeGreeting()}! 👋

How can I help you?

🌟 **About CareerVue:**
Careervue is your comprehensive career platform connecting job seekers with opportunities across India. We bridge the gap between talent and employers in both government and private sectors.

💼 **I can help you with:**
• Finding government & private sector jobs
• CV creation and optimization with AI
• Job application guidance
• Interview preparation tips
• Company research & salary insights
• Account & login assistance
• Career development advice
• Location-based job search`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isChatbotOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatbotOpen]);

  // Predefined knowledge base: rules and professional responses related to the site only
  const rules = useMemo(
    () => [
      {
        keywords: [/gov(ernment)? jobs?/, /sarkari/, /public sector/],
        response:
          `🏛️ **Government Jobs**

**How to Access:**
• Click 'Government Jobs' on homepage
• Navigate to Jobs → Government in menu
• Browse by department, location, or qualification

**Benefits:**
• Job security and stability
• Fixed pay scales with regular increments
• Comprehensive benefits (pension, medical)
• Work-life balance

**Features:**
• Detailed role descriptions
• Eligibility requirements
• Application deadlines
• Exam patterns and syllabus`,
        topic: "government",
      },
      {
        keywords: [
          /private jobs?/,
          /companies?/,
          /corporate/,
          /it jobs?/,
          /software/,
        ],
        response:
          `💼 **Private Sector Jobs**

**How to Access:**
• Browse 'Companies' section
• Check main Jobs listing
• Filter by industry, salary, experience

**Benefits:**
• Higher salary packages
• Rapid career growth
• Dynamic work environment
• Skill development opportunities

**What You'll Find:**
• Company profiles and culture
• Detailed job requirements
• Salary ranges
• Application process`,
        topic: "private",
      },
      {
        keywords: [/cv|resume|curriculum vitae|profile builder/i],
        response:
          `📄 **CV Creator Tool**

**How to Use:**
• Click 'Create Your CV' on homepage
• Select CV Creator from menu
• Fill in your details
• Choose from professional templates
• Download or export your CV

**Features:**
• AI-powered suggestions
• ATS-optimized templates
• Professional formatting
• Multiple export formats
• Real-time preview

**Tips:**
• Keep it concise (1-2 pages)
• Highlight achievements
• Use action verbs
• Customize for each job`,
        topic: "cv-creator",
      },
      {
        keywords: [/register|sign ?up|create account/i],
        response:
          `✍️ **Registration**

**How to Register:**
• Click 'Sign Up' in top-right corner
• Fill in basic details (name, email, phone)
• Create a strong password
• Verify your email
• Complete your profile

**After Registration:**
• Access personalized dashboard
• Save job searches
• Track applications
• Set up job alerts
• Build your CV

**Benefits:**
• One-click job applications
• Saved job preferences
• Application history
• Personalized recommendations`,
        topic: "register",
      },
      {
        keywords: [/login|sign ?in|log in/i],
        response:
          `🔐 **Login**

**How to Login:**
• Click 'Login' in header
• Enter your email and password
• Click 'Sign In'

**Forgot Password?**
• Click 'Forgot Password' link
• Enter your registered email
• Check email for reset link
• Create new password

**After Login:**
• Access your dashboard
• View saved jobs
• Track applications
• Update profile
• Manage preferences

**Troubleshooting:**
• Clear browser cache
• Check email spelling
• Contact support if needed`,
        topic: "login",
      },
      {
        keywords: [/apply|application|how to apply/i],
        response:
          `📝 **Job Application**

**How to Apply:**
• Browse jobs and select one
• Click on job card for details
• Review requirements carefully
• Click 'Apply Now' button
• Follow application instructions
• Submit required documents

**What You Need:**
• Updated CV/Resume
• Cover letter (if required)
• Educational certificates
• Experience letters
• Valid email and phone

**Track Applications:**
• Check dashboard for status
• Receive email updates
• Note application deadlines

**Tips:**
• Apply early
• Customize your CV
• Double-check details`,
        topic: "apply",
      },
      {
        keywords: [
          /jobs? (search|find|filter)|search jobs?|find jobs?|filters?/i,
        ],
        response:
          `🔍 **Job Search**

**How to Search:**
• Visit Jobs page from menu
• Use search bar for keywords
• Apply filters for better results
• Browse by categories

**Available Filters:**
• Location (city/state)
• Experience level
• Salary range
• Job type (full-time, part-time)
• Industry/sector
• Company

**Quick Access:**
• Government Jobs section
• Companies directory
• Latest jobs
• Recommended for you

**Tips:**
• Save favorite jobs
• Set up job alerts
• Check daily for new listings
• Use specific keywords`,
        topic: "search",
      },
      {
        keywords: [/about|mission|vision|what is careervue|careervue/i],
        response:
          `🌟 **About CareerVue**

**Who We Are:**
Careervue is India's leading career platform bridging the gap between job seekers and employers across government and private sectors.

**Our Mission:**
• Make job opportunities accessible to everyone
• Empower candidates with career tools
• Connect talent with the right employers
• Provide comprehensive career guidance

**What We Offer:**
• 10,000+ job listings updated daily
• Government & private sector opportunities
• AI-powered CV Creator
• Company research tools
• Interview preparation resources
• Career development guidance

**Our Values:**
• Accessibility for all backgrounds
• Quality over quantity
• User-first approach
• Transparency in job listings`,
        topic: "about",
      },
      {
        keywords: [/features|what can|capabilities|website features/i],
        response:
          `✨ **Careervue Features**

**Job Search:**
• Advanced filters (location, salary, experience)
• Government & private job listings
• Real-time updates
• Save favorite jobs

**CV Tools:**
• AI-powered CV Creator
• Professional templates
• ATS optimization
• Export in multiple formats

**Career Resources:**
• Interview preparation tips
• Salary insights
• Company profiles
• Career guidance

**User Dashboard:**
• Track applications
• Saved jobs
• Profile management
• Job alerts

**Additional Features:**
• Mobile-responsive design
• Email notifications
• 24/7 AI assistant support`,
        topic: "features",
      },
      {
        keywords: [/contact|support|helpdesk|email us|reach us|help/i],
        response:
          `📞 **Contact & Support**

**Get in Touch:**
• Visit Contact page from navigation
• Email: malwatkarpranav@gmail.com
• Live chat support (24/7)
• AI Assistant (that's me!)

**Support Hours:**
• Email: 24/7 (response within 24 hours)
• Chat: Available anytime
• Phone: Mon-Fri, 9 AM - 6 PM IST

**What We Help With:**
• Account issues
• Job application queries
• Technical problems
• General inquiries
• Feedback and suggestions

**Quick Help:**
For instant answers, try asking me about jobs, CV creation, or website features!`,
        topic: "contact",
      },
      {
        keywords: [/dashboard|profile|account|my account/i],
        response:
          `👤 **Dashboard & Profile**

**Access Dashboard:**
• Login to your account
• Click on your name/profile icon
• View personalized dashboard

**Dashboard Features:**
• Application status tracking
• Saved jobs list
• Job recommendations
• Profile completion status
• Recent activity

**Profile Management:**
• Update personal information
• Add/edit work experience
• Upload documents
• Set job preferences
• Manage privacy settings

**Quick Actions:**
• Apply to saved jobs
• Download your CV
• Update job alerts
• View application history`,
        topic: "dashboard",
      },
      {
        keywords: [/notifications?|updates?|alerts?|email alerts/i],
        response:
          `🔔 **Job Notifications & Alerts**

**Set Up Alerts:**
• Go to Dashboard
• Click 'Job Alerts' or 'Notifications'
• Choose job categories
• Select locations
• Set frequency (daily/weekly)

**Types of Notifications:**
• New job postings
• Application status updates
• Deadline reminders
• Recommended jobs
• Company updates

**Delivery Methods:**
• Email notifications
• In-app notifications
• SMS alerts (optional)

**Manage Alerts:**
• Edit preferences anytime
• Pause/resume alerts
• Unsubscribe from specific categories`,
        topic: "notifications",
      },
      {
        keywords: [/services?|what do you offer/i],
        response:
          `🎁 **Our Services**

**Job Listings:**
• 10,000+ active job postings
• Government sector jobs
• Private sector opportunities
• Daily updates
• Verified employers

**Career Tools:**
• AI-powered CV Creator
• Resume templates
• Cover letter builder
• Interview preparation

**Resources:**
• Company profiles
• Salary insights
• Career guidance articles
• Industry trends
• Skill development tips

**Support:**
• 24/7 AI assistant
• Email support
• Application tracking
• Personalized recommendations

**All services are FREE for job seekers!**`,
        topic: "services",
      },
      {
        keywords: [/salary|pay|compensation|package|wage/i],
        response:
          `💰 **Salary Information**

**Government Jobs:**
• Fixed pay scales (Pay Matrix)
• Regular increments
• DA (Dearness Allowance)
• HRA (House Rent Allowance)
• Pension benefits

**Private Sector:**
• Competitive packages
• Performance bonuses
• Stock options (in some companies)
• Varies by company size & location

**How to Find:**
• Use salary filters in job search
• Check individual job postings
• Compare across similar roles
• Research industry standards

**Salary Ranges:**
• Entry Level: ₹2-5 LPA
• Mid Level: ₹5-15 LPA
• Senior Level: ₹15+ LPA`,
        topic: "salary",
      },
      {
        keywords: [/experience|fresher|entry level|senior|beginner/i],
        response:
          `🎓 **Experience Levels**

**Fresher/Entry Level (0-2 years):**
• Internships
• Trainee positions
• Graduate programs
• Entry-level roles
• No experience required

**Mid Level (2-5 years):**
• Specialist roles
• Team member positions
• Skill-based jobs
• Growth opportunities

**Senior Level (5+ years):**
• Leadership positions
• Management roles
• Expert/consultant positions
• Strategic roles

**How to Filter:**
• Use experience filter in job search
• Select your experience range
• Browse relevant opportunities

**Tips for Freshers:**
• Focus on skills and education
• Apply to internships
• Build strong CV
• Show enthusiasm to learn`,
        topic: "experience",
      },
      {
        keywords: [/location|city|remote|work from home|wfh/i],
        response:
          `📍 **Job Locations**

**Major Cities:**
• Mumbai, Delhi, Bangalore
• Pune, Hyderabad, Chennai
• Kolkata, Ahmedabad
• And 100+ other cities

**Work Options:**
• On-site (office-based)
• Remote (work from home)
• Hybrid (mix of both)
• Field work

**How to Search:**
• Use location filter
• Select preferred city/state
• Choose remote option if available
• Set location radius

**Remote Jobs:**
• Growing opportunities
• Work from anywhere
• Flexible schedules
• Filter by 'Remote' tag

**Relocation:**
• Some jobs offer relocation support
• Check job details for benefits`,
        topic: "location",
      },
      {
        keywords: [/company|employer|organization|companies/i],
        response:
          `🏢 **Company Directory**

**Explore Companies:**
• Click 'Companies' in navigation
• Browse by industry
• Search by company name
• Filter by size and location

**Company Profiles Include:**
• About the company
• Company culture & values
• Current job openings
• Employee benefits
• Contact information
• Career page links

**Types of Employers:**
• Startups
• MNCs (Multinational)
• Indian corporations
• Government organizations
• NGOs

**Research Tips:**
• Read company reviews
• Check their website
• Understand their products/services
• Know their mission and values
• Prepare company-specific questions`,
        topic: "company",
      },
      {
        keywords: [/interview|preparation|tips/i],
        response:
          `🎯 **Interview Tips**

**Before Interview:**
• Research the company thoroughly
• Review job description carefully
• Prepare answers to common questions
• Practice with mock interviews
• Update your CV using our CV Creator

**During Interview:**
• Dress professionally
• Arrive 10-15 minutes early
• Maintain eye contact
• Be confident and honest
• Ask thoughtful questions

**Common Questions:**
• Tell me about yourself
• Why do you want this job?
• What are your strengths/weaknesses?
• Where do you see yourself in 5 years?

**Follow-up:**
• Send thank you email
• Be patient for response`,
        topic: "interview",
      },
      {
        keywords: [/career|growth|development|career path/i],
        response:
          `🚀 **Career Development**

**Skill Development:**
• Continuous learning
• Online courses & certifications
• Industry-specific training
• Soft skills improvement
• Technical skill upgrades

**Career Growth Tips:**
• Set clear career goals
• Network with professionals
• Seek mentorship
• Take on new challenges
• Document achievements

**Use Careervue Tools:**
• Update CV regularly
• Track your applications
• Research industry trends
• Explore different roles
• Learn from job descriptions

**Networking:**
• Connect with industry professionals
• Attend career events
• Join professional groups
• Follow industry leaders

**Stay Updated:**
• Industry news and trends
• New technologies
• Market demands
• Salary benchmarks`,
        topic: "career",
      },
    ],
    []
  );

  const classifyAndRespond = (text: string): string => {
    const normalized = text.trim().toLowerCase();
    if (!normalized)
      return "Please provide a question related to our website, jobs, or services.";

    for (const rule of rules) {
      if (rule.keywords.some((re) => re.test(normalized))) {
        sessionTopicsRef.current.add(rule.topic);
        return rule.response;
      }
    }

    // If message contains general site terms, give a generic helpful response
    const siteTerms =
      /(careervue|website|site|jobs?|government|companies|cv|resume|account|login|register|contact|about)/i;
    if (siteTerms.test(normalized)) {
      return `**I can help you with:**

• Government Jobs
• Private Sector Jobs
• CV Creator
• Account Management
• Salary Information
• Experience Levels
• Job Locations
• Interview Preparation
• Career Development

Please ask me anything specific about these topics!`;
    }

    // For unknown questions, provide admin contact
    return `❓ **I don't have information about that.**

I'm specialized in helping with Careervue website features, job opportunities, CV creation, and career guidance.

📧 **Need More Help?**
For questions outside my scope, please contact our admin:
**Email:** malwatkarpranav@gmail.com

💡 **I can help with:**
• Jobs (Government & Private)
• CV Creator
• Interview Tips
• Salary & Experience Info
• Account Support`;
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      text: content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const replyText = classifyAndRespond(content);
    const reply: ChatMessage = {
      id: createId(),
      role: "assistant",
      text: replyText,
      timestamp: Date.now(),
    };
    // Simulate slight delay for realism
    setTimeout(() => setMessages((prev) => [...prev, reply]), 250);
  };

  const handleCancel = () => {
    closeChatbot();
    setIsMinimized(false);
    setMessages([]);
    setInput("");
  };

  const handleClearHistory = () => {
    if (isAuthenticated && user?.id) {
      clearChatHistory(user.id);
    }
    setMessages([]);
    setInput("");
  };

  return (
    <>
      {/* Floating chat window */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[480px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-white" />
              <span className="font-semibold">Careervue Assistant</span>
              {isAuthenticated && (
                <span className="text-xs text-blue-100">({user?.name})</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                aria-label="Minimize assistant"
                className="p-1.5 rounded hover:bg-white/10"
                onClick={() => setIsMinimized((s) => !s)}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                aria-label="Close assistant"
                className="p-1.5 rounded hover:bg-white/10"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="max-h-96 overflow-y-auto px-3 pb-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mt-3 flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg text-sm shadow whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none max-w-[85%]"
                          : "bg-gray-100 text-gray-800 rounded-bl-none w-full"
                      }`}
                    >
                      {m.text}
                      <div className="mt-1 flex items-center space-x-1 opacity-70 text-[10px]">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-200 p-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Ask about jobs, services, or pages..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  aria-label="Send message"
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  aria-label="Cancel"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-3 py-2 flex items-center justify-center"
                >
                  Cancel
                </button>
              </div>

              {/* Helpful Suggestions */}
              <div className="border-t border-gray-200 p-3">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  💡 Try asking about:
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {[
                    "Government Jobs",
                    "Private Jobs",
                    "CV Creator",
                    "Salary",
                    "Experience",
                    "Location",
                    "Companies",
                    "Interview Tips",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        handleSend();
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              {/* Clear History Button - Only show for logged-in users */}
              {isAuthenticated && messages.length > 1 && (
                <div className="border-t border-gray-200 p-2 flex justify-center">
                  <button
                    aria-label="Clear chat history"
                    onClick={handleClearHistory}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-600 text-sm transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Chat History</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating icon button - Always visible */}
      <button
        aria-label="Open AI assistant"
        onClick={() => openChatbot()}
        className="fixed bottom-6 right-6 z-[9999] h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-8 w-8" />
      </button>
    </>
  );
};

export default AssistantWidget;
