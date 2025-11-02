import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus, Bot, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChatbot } from '../../contexts/ChatbotContext';
import { FormattedMessage } from './FormattedMessage';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	timestamp: number;
}

const timeGreeting = (): string => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
};

const createId = () => Math.random().toString(36).slice(2);

// Helper functions for localStorage
const getChatHistoryKey = (userId: string) => `careervue_chat_history_${userId}`;

const saveChatHistory = (userId: string, messages: ChatMessage[]) => {
	try {
		localStorage.setItem(getChatHistoryKey(userId), JSON.stringify(messages));
	} catch (error) {
		console.error('Failed to save chat history:', error);
	}
};

const loadChatHistory = (userId: string): ChatMessage[] => {
	try {
		const saved = localStorage.getItem(getChatHistoryKey(userId));
		return saved ? JSON.parse(saved) : [];
	} catch (error) {
		console.error('Failed to load chat history:', error);
		return [];
	}
};

const clearChatHistory = (userId: string) => {
	try {
		localStorage.removeItem(getChatHistoryKey(userId));
	} catch (error) {
		console.error('Failed to clear chat history:', error);
	}
};

export const AssistantWidget: React.FC = () => {
	const { user, isAuthenticated } = useAuth();
	const { isChatbotOpen, closeChatbot, openChatbot } = useChatbot();
	const [isMinimized, setIsMinimized] = useState(false);
	const [input, setInput] = useState('');
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
					role: 'assistant',
					text: `${timeGreeting()}! 👋 I'm your CareerVue AI Assistant.\n\n🌟 **About CareerVue:**\nCareerVue is your comprehensive career platform connecting job seekers with opportunities across India. We bridge the gap between talent and employers in both government and private sectors.\n\n💼 **I can help you with:**\n• Finding government & private sector jobs\n• CV creation and optimization with AI\n• Job application guidance\n• Interview preparation tips\n• Company research & salary insights\n• Account & login assistance\n• Career development advice\n• Location-based job search\n\n💡 **Quick Tips:**\nType keywords like "interview", "salary", "CV", "government jobs" to get instant help!\n\nWhat would you like to know today?`,
					timestamp: Date.now(),
				},
			]);
		}
	}, [isChatbotOpen, messages.length]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isChatbotOpen]);

	// Predefined knowledge base: rules and professional responses related to the site only
	const rules = useMemo(
		() => [
			{
				keywords: [/gov(ernment)? jobs?/, /sarkari/, /public sector/],
				response:
					"🏛️ **Government Jobs**\n\n**How to Access:**\n• Click 'Government Jobs' on homepage\n• Navigate to Jobs → Government in menu\n• Browse by department, location, or qualification\n\n**Benefits:**\n• Job security and stability\n• Fixed pay scales with regular increments\n• Comprehensive benefits (pension, medical)\n• Work-life balance\n\n**Features:**\n• Detailed role descriptions\n• Eligibility requirements\n• Application deadlines\n• Exam patterns and syllabus",
				topic: 'government'
			},
			{
				keywords: [/private jobs?/, /companies?/, /corporate/, /it jobs?/, /software/],
				response:
					"💼 **Private Sector Jobs**\n\n**How to Access:**\n• Browse 'Companies' section\n• Check main Jobs listing\n• Filter by industry, salary, experience\n\n**Benefits:**\n• Higher salary packages\n• Rapid career growth\n• Dynamic work environment\n• Skill development opportunities\n\n**What You'll Find:**\n• Company profiles and culture\n• Detailed job requirements\n• Salary ranges\n• Application process",
				topic: 'private'
			},
			{
				keywords: [/cv|resume|curriculum vitae|profile builder/i],
				response:
					"📄 **CV Creator Tool**\n\n**How to Use:**\n• Click 'Create Your CV' on homepage\n• Select CV Creator from menu\n• Fill in your details\n• Choose from professional templates\n• Download or export your CV\n\n**Features:**\n• AI-powered suggestions\n• ATS-optimized templates\n• Professional formatting\n• Multiple export formats\n• Real-time preview\n\n**Tips:**\n• Keep it concise (1-2 pages)\n• Highlight achievements\n• Use action verbs\n• Customize for each job",
				topic: 'cv-creator'
			},
			{
				keywords: [/register|sign ?up|create account/i],
				response:
					"✍️ **Registration**\n\n**How to Register:**\n• Click 'Sign Up' in top-right corner\n• Fill in basic details (name, email, phone)\n• Create a strong password\n• Verify your email\n• Complete your profile\n\n**After Registration:**\n• Access personalized dashboard\n• Save job searches\n• Track applications\n• Set up job alerts\n• Build your CV\n\n**Benefits:**\n• One-click job applications\n• Saved job preferences\n• Application history\n• Personalized recommendations",
				topic: 'register'
			},
			{
				keywords: [/login|sign ?in|log in/i],
				response:
					"🔐 **Login**\n\n**How to Login:**\n• Click 'Login' in header\n• Enter your email and password\n• Click 'Sign In'\n\n**Forgot Password?**\n• Click 'Forgot Password' link\n• Enter your registered email\n• Check email for reset link\n• Create new password\n\n**After Login:**\n• Access your dashboard\n• View saved jobs\n• Track applications\n• Update profile\n• Manage preferences\n\n**Troubleshooting:**\n• Clear browser cache\n• Check email spelling\n• Contact support if needed",
				topic: 'login'
			},
			{
				keywords: [/apply|application|how to apply/i],
				response:
					"📝 **Job Application**\n\n**How to Apply:**\n• Browse jobs and select one\n• Click on job card for details\n• Review requirements carefully\n• Click 'Apply Now' button\n• Follow application instructions\n• Submit required documents\n\n**What You Need:**\n• Updated CV/Resume\n• Cover letter (if required)\n• Educational certificates\n• Experience letters\n• Valid email and phone\n\n**Track Applications:**\n• Check dashboard for status\n• Receive email updates\n• Note application deadlines\n\n**Tips:**\n• Apply early\n• Customize your CV\n• Double-check details",
				topic: 'apply'
			},
			{
				keywords: [/jobs? (search|find|filter)|search jobs?|find jobs?|filters?/i],
				response:
					"🔍 **Job Search**\n\n**How to Search:**\n• Visit Jobs page from menu\n• Use search bar for keywords\n• Apply filters for better results\n• Browse by categories\n\n**Available Filters:**\n• Location (city/state)\n• Experience level\n• Salary range\n• Job type (full-time, part-time)\n• Industry/sector\n• Company\n\n**Quick Access:**\n• Government Jobs section\n• Companies directory\n• Latest jobs\n• Recommended for you\n\n**Tips:**\n• Save favorite jobs\n• Set up job alerts\n• Check daily for new listings\n• Use specific keywords",
				topic: 'search'
			},
			{
				keywords: [/about|mission|vision|what is careervue|careervue/i],
				response:
					"🌟 **About CareerVue**\n\n**Who We Are:**\nCareerVue is India's leading career platform bridging the gap between job seekers and employers across government and private sectors.\n\n**Our Mission:**\n• Make job opportunities accessible to everyone\n• Empower candidates with career tools\n• Connect talent with the right employers\n• Provide comprehensive career guidance\n\n**What We Offer:**\n• 10,000+ job listings updated daily\n• Government & private sector opportunities\n• AI-powered CV Creator\n• Company research tools\n• Interview preparation resources\n• Career development guidance\n\n**Our Values:**\n• Accessibility for all backgrounds\n• Quality over quantity\n• User-first approach\n• Transparency in job listings",
				topic: 'about'
			},
			{
				keywords: [/features|what can|capabilities|website features/i],
				response:
					"✨ **CareerVue Features**\n\n**Job Search:**\n• Advanced filters (location, salary, experience)\n• Government & private job listings\n• Real-time updates\n• Save favorite jobs\n\n**CV Tools:**\n• AI-powered CV Creator\n• Professional templates\n• ATS optimization\n• Export in multiple formats\n\n**Career Resources:**\n• Interview preparation tips\n• Salary insights\n• Company profiles\n• Career guidance\n\n**User Dashboard:**\n• Track applications\n• Saved jobs\n• Profile management\n• Job alerts\n\n**Additional Features:**\n• Mobile-responsive design\n• Email notifications\n• 24/7 AI assistant support",
				topic: 'features'
			},
			{
				keywords: [/contact|support|helpdesk|email us|reach us|help/i],
				response:
					"📞 **Contact & Support**\n\n**Get in Touch:**\n• Visit Contact page from navigation\n• Email: malwatkarpranav@gmail.com\n• Live chat support (24/7)\n• AI Assistant (that's me!)\n\n**Support Hours:**\n• Email: 24/7 (response within 24 hours)\n• Chat: Available anytime\n• Phone: Mon-Fri, 9 AM - 6 PM IST\n\n**What We Help With:**\n• Account issues\n• Job application queries\n• Technical problems\n• General inquiries\n• Feedback and suggestions\n\n**Quick Help:**\nFor instant answers, try asking me about jobs, CV creation, or website features!",
				topic: 'contact'
			},
			{
				keywords: [/dashboard|profile|account|my account/i],
				response:
					"👤 **Dashboard & Profile**\n\n**Access Dashboard:**\n• Login to your account\n• Click on your name/profile icon\n• View personalized dashboard\n\n**Dashboard Features:**\n• Application status tracking\n• Saved jobs list\n• Job recommendations\n• Profile completion status\n• Recent activity\n\n**Profile Management:**\n• Update personal information\n• Add/edit work experience\n• Upload documents\n• Set job preferences\n• Manage privacy settings\n\n**Quick Actions:**\n• Apply to saved jobs\n• Download your CV\n• Update job alerts\n• View application history",
				topic: 'dashboard'
			},
			{
				keywords: [/notifications?|updates?|alerts?|email alerts/i],
				response:
					"🔔 **Job Notifications & Alerts**\n\n**Set Up Alerts:**\n• Go to Dashboard\n• Click 'Job Alerts' or 'Notifications'\n• Choose job categories\n• Select locations\n• Set frequency (daily/weekly)\n\n**Types of Notifications:**\n• New job postings\n• Application status updates\n• Deadline reminders\n• Recommended jobs\n• Company updates\n\n**Delivery Methods:**\n• Email notifications\n• In-app notifications\n• SMS alerts (optional)\n\n**Manage Alerts:**\n• Edit preferences anytime\n• Pause/resume alerts\n• Unsubscribe from specific categories",
				topic: 'notifications'
			},
			{
				keywords: [/services?|what do you offer/i],
				response:
					"🎁 **Our Services**\n\n**Job Listings:**\n• 10,000+ active job postings\n• Government sector jobs\n• Private sector opportunities\n• Daily updates\n• Verified employers\n\n**Career Tools:**\n• AI-powered CV Creator\n• Resume templates\n• Cover letter builder\n• Interview preparation\n\n**Resources:**\n• Company profiles\n• Salary insights\n• Career guidance articles\n• Industry trends\n• Skill development tips\n\n**Support:**\n• 24/7 AI assistant\n• Email support\n• Application tracking\n• Personalized recommendations\n\n**All services are FREE for job seekers!**",
				topic: 'services'
			},
			{
				keywords: [/salary|pay|compensation|package|wage/i],
				response:
					"💰 **Salary Information**\n\n**Government Jobs:**\n• Fixed pay scales (Pay Matrix)\n• Regular increments\n• DA (Dearness Allowance)\n• HRA (House Rent Allowance)\n• Pension benefits\n\n**Private Sector:**\n• Competitive packages\n• Performance bonuses\n• Stock options (in some companies)\n• Varies by company size & location\n\n**How to Find:**\n• Use salary filters in job search\n• Check individual job postings\n• Compare across similar roles\n• Research industry standards\n\n**Salary Ranges:**\n• Entry Level: ₹2-5 LPA\n• Mid Level: ₹5-15 LPA\n• Senior Level: ₹15+ LPA",
				topic: 'salary'
			},
			{
				keywords: [/experience|fresher|entry level|senior|beginner/i],
				response:
					"🎓 **Experience Levels**\n\n**Fresher/Entry Level (0-2 years):**\n• Internships\n• Trainee positions\n• Graduate programs\n• Entry-level roles\n• No experience required\n\n**Mid Level (2-5 years):**\n• Specialist roles\n• Team member positions\n• Skill-based jobs\n• Growth opportunities\n\n**Senior Level (5+ years):**\n• Leadership positions\n• Management roles\n• Expert/consultant positions\n• Strategic roles\n\n**How to Filter:**\n• Use experience filter in job search\n• Select your experience range\n• Browse relevant opportunities\n\n**Tips for Freshers:**\n• Focus on skills and education\n• Apply to internships\n• Build strong CV\n• Show enthusiasm to learn",
				topic: 'experience'
			},
			{
				keywords: [/location|city|remote|work from home|wfh/i],
				response:
					"📍 **Job Locations**\n\n**Major Cities:**\n• Mumbai, Delhi, Bangalore\n• Pune, Hyderabad, Chennai\n• Kolkata, Ahmedabad\n• And 100+ other cities\n\n**Work Options:**\n• On-site (office-based)\n• Remote (work from home)\n• Hybrid (mix of both)\n• Field work\n\n**How to Search:**\n• Use location filter\n• Select preferred city/state\n• Choose remote option if available\n• Set location radius\n\n**Remote Jobs:**\n• Growing opportunities\n• Work from anywhere\n• Flexible schedules\n• Filter by 'Remote' tag\n\n**Relocation:**\n• Some jobs offer relocation support\n• Check job details for benefits",
				topic: 'location'
			},
			{
				keywords: [/company|employer|organization|companies/i],
				response:
					"🏢 **Company Directory**\n\n**Explore Companies:**\n• Click 'Companies' in navigation\n• Browse by industry\n• Search by company name\n• Filter by size and location\n\n**Company Profiles Include:**\n• About the company\n• Company culture & values\n• Current job openings\n• Employee benefits\n• Contact information\n• Career page links\n\n**Types of Employers:**\n• Startups\n• MNCs (Multinational)\n• Indian corporations\n• Government organizations\n• NGOs\n\n**Research Tips:**\n• Read company reviews\n• Check their website\n• Understand their products/services\n• Know their mission and values\n• Prepare company-specific questions",
				topic: 'company'
			},
			{
				keywords: [/interview|preparation|tips/i],
				response:
					"🎯 **Interview Tips**\n\n**Before Interview:**\n• Research the company thoroughly\n• Review job description carefully\n• Prepare answers to common questions\n• Practice with mock interviews\n• Update your CV using our CV Creator\n\n**During Interview:**\n• Dress professionally\n• Arrive 10-15 minutes early\n• Maintain eye contact\n• Be confident and honest\n• Ask thoughtful questions\n\n**Common Questions:**\n• Tell me about yourself\n• Why do you want this job?\n• What are your strengths/weaknesses?\n• Where do you see yourself in 5 years?\n\n**Follow-up:**\n• Send thank you email\n• Be patient for response",
				topic: 'interview'
			},
			{
				keywords: [/career|growth|development|career path/i],
				response:
					"🚀 **Career Development**\n\n**Skill Development:**\n• Continuous learning\n• Online courses & certifications\n• Industry-specific training\n• Soft skills improvement\n• Technical skill upgrades\n\n**Career Growth Tips:**\n• Set clear career goals\n• Network with professionals\n• Seek mentorship\n• Take on new challenges\n• Document achievements\n\n**Use CareerVue Tools:**\n• Update CV regularly\n• Track your applications\n• Research industry trends\n• Explore different roles\n• Learn from job descriptions\n\n**Networking:**\n• Connect with industry professionals\n• Attend career events\n• Join professional groups\n• Follow industry leaders\n\n**Stay Updated:**\n• Industry news and trends\n• New technologies\n• Market demands\n• Salary benchmarks",
				topic: 'career'
			}
		],
		[]
	);

	const classifyAndRespond = (text: string): string => {
		const normalized = text.trim().toLowerCase();
		if (!normalized) return 'Please provide a question related to our website, jobs, or services.';

		for (const rule of rules) {
			if (rule.keywords.some((re) => re.test(normalized))) {
				sessionTopicsRef.current.add(rule.topic);
				return rule.response;
			}
		}

		// If message contains general site terms, give a generic helpful response
		const siteTerms = /(careervue|website|site|jobs?|government|companies|cv|resume|account|login|register|contact|about)/i;
		if (siteTerms.test(normalized)) {
			return '**I can help you with:**\n\n• Government Jobs\n• Private Sector Jobs\n• CV Creator\n• Account Management\n• Salary Information\n• Experience Levels\n• Job Locations\n• Interview Preparation\n• Career Development\n\nPlease ask me anything specific about these topics!';
		}

		// For unknown questions, provide admin contact
		return "❓ **I don't have information about that.**\n\nI'm specialized in helping with CareerVue website features, job opportunities, CV creation, and career guidance.\n\n📧 **Need More Help?**\nFor questions outside my scope, please contact our admin:\n**Email:** malwatkarpranav@gmail.com\n\n💡 **I can help with:**\n• Jobs (Government & Private)\n• CV Creator\n• Interview Tips\n• Salary & Experience Info\n• Account Support";
	};

	const handleSend = () => {
		const content = input.trim();
		if (!content) return;
		const userMsg: ChatMessage = {
			id: createId(),
			role: 'user',
			text: content,
			timestamp: Date.now(),
		};
		setMessages((prev) => [...prev, userMsg]);
		setInput('');

		const replyText = classifyAndRespond(content);
		const reply: ChatMessage = {
			id: createId(),
			role: 'assistant',
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
		setInput('');
	};

	const handleClearHistory = () => {
		if (isAuthenticated && user?.id) {
			clearChatHistory(user.id);
		}
		setMessages([]);
		setInput('');
	};

	return (
		<>
			{/* Floating chat window */}
			{isChatbotOpen && (
				<div className="fixed bottom-24 right-6 z-[9999] w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
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
									<div key={m.id} className={`mt-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div
											className={`px-3 py-2 rounded-lg text-sm shadow max-w-[85%] ${
												m.role === 'user'
													? 'bg-blue-600 text-white rounded-br-none'
													: 'bg-gray-100 text-gray-800 rounded-bl-none'
											}`}
										>
											<FormattedMessage text={m.text} />
											<div className="mt-2 flex items-center space-x-1 opacity-70 text-[10px]">
												<Clock className="h-3 w-3" />
												<span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
										if (e.key === 'Enter') handleSend();
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
								<p className="text-xs text-gray-500 mb-2 text-center">💡 Try asking about:</p>
								<div className="flex flex-wrap gap-1 justify-center">
									{['Government Jobs', 'Private Jobs', 'CV Creator', 'Salary', 'Experience', 'Location', 'Companies', 'Interview Tips'].map((suggestion) => (
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
