import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus, Bot, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChatbot } from '../../contexts/ChatbotContext';

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
					text: `${timeGreeting()}! I'm your Careervue AI assistant, here to help you with:\n\n• Finding government and private sector jobs\n• CV creation and optimization\n• Account and login assistance\n• Career guidance and interview tips\n• Company research and salary information\n\nWhat would you like to know about today?`,
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
					"Government Jobs: You can explore government opportunities via 'Government Jobs' section. Click Government Jobs on the homepage hero or use Jobs → Government in the navigation. Each posting shows role, requirements, and application details. Government jobs offer job security, benefits, and competitive salaries.",
				topic: 'government'
			},
			{
				keywords: [/private jobs?/, /companies?/, /corporate/, /it jobs?/, /software/],
				response:
					"Private Sector Jobs: For private sector roles, browse 'Companies' or the main Jobs list. Select a job card to view details, requirements, and how to apply. Private jobs often offer higher salaries, growth opportunities, and dynamic work environments.",
				topic: 'private'
			},
			{
				keywords: [/cv|resume|curriculum vitae|profile builder/i],
				response:
					"CV Creator: Our CV Creator helps you build a professional resume quickly. From the homepage, select Create Your CV (or CV Creator in the menu) to enter your details and export your CV. Features include AI assistance, professional templates, and ATS optimization.",
				topic: 'cv-creator'
			},
			{
				keywords: [/register|sign ?up|create account/i],
				response:
					"Registration: To create an account, click Sign Up in the top-right. Provide your basic details to register. After registration, you can log in and access your dashboard, save job searches, and track applications.",
				topic: 'register'
			},
			{
				keywords: [/login|sign ?in/i],
				response:
					"Login: Use the Login option in the header to sign in. If you have forgotten your password, use the Forgot Password link. After login, access your personalized dashboard and saved job preferences.",
				topic: 'login'
			},
			{
				keywords: [/apply|application|how to apply/i],
				response:
					"Job Application: Open any job to view full details, then follow the application instructions on the job detail page. Requirements and deadlines are listed there. You can save jobs and track your application status in your dashboard.",
				topic: 'apply'
			},
			{
				keywords: [/jobs? (search|find|filter)|search jobs?|find jobs?|filters?/i],
				response:
					"Job Search: Browse the Jobs page and use the available categories to locate relevant roles. You can also navigate by Government Jobs or Companies for quicker access. Use filters for location, experience, salary, and job type.",
				topic: 'search'
			},
			{
				keywords: [/about|mission|vision/i],
				response:
					"About Careervue: We connect candidates with opportunities across government and private sectors and provide tools like the CV Creator. Our mission is to make job opportunities accessible to everyone, regardless of background or experience level.",
				topic: 'about'
			},
			{
				keywords: [/contact|support|helpdesk|email us|reach us/i],
				response:
					"Contact & Support: Visit the Contact page from the navigation for ways to reach our team. We're available via email, phone, and live chat. Our support team is here to help with any questions or concerns.",
				topic: 'contact'
			},
			{
				keywords: [/dashboard|profile|account/i],
				response:
					"Dashboard: After logging in, use your Dashboard to view personalized information, track applications, manage saved jobs, and continue your application journey. Update your profile and preferences here.",
				topic: 'dashboard'
			},
			{
				keywords: [/notifications?|updates?|alerts?/i],
				response:
					"Job Notifications: Enable job updates to stay informed about new opportunities. Check the Jobs pages for the latest listings and alerts. You can set up email notifications for specific job categories and locations.",
				topic: 'notifications'
			},
			{
				keywords: [/services?/i],
				response:
					"Services: We offer curated job listings across government and private sectors, company directories, CV Creator, career guidance, and personalized job matching. All services are designed to help you succeed in your career journey.",
				topic: 'services'
			},
			{
				keywords: [/salary|pay|compensation|package/i],
				response:
					"Salary Information: Job postings include salary ranges when available. Government jobs typically have fixed pay scales with benefits. Private sector salaries vary by company size, experience, and location. Use salary filters to find jobs in your desired range.",
				topic: 'salary'
			},
			{
				keywords: [/experience|fresher|entry level|senior/i],
				response:
					"Experience Levels: We have jobs for all experience levels - from freshers to senior professionals. Use experience filters to find suitable positions. Entry-level jobs are great for starting your career, while senior roles offer leadership opportunities.",
				topic: 'experience'
			},
			{
				keywords: [/location|city|remote|work from home/i],
				response:
					"Job Locations: Browse jobs by location using our location filters. We have opportunities across major cities in India. Some companies offer remote work options. Use the location search to find jobs in your preferred area.",
				topic: 'location'
			},
			{
				keywords: [/company|employer|organization/i],
				response:
					"Companies: Explore our Company Directory to learn about employers, their culture, and available positions. Research companies before applying to understand their values and work environment. Company profiles include contact information and career pages.",
				topic: 'company'
			},
			{
				keywords: [/interview|preparation|tips/i],
				response:
					"Interview Tips: Prepare for interviews by researching the company, understanding the job requirements, and practicing common questions. Our CV Creator helps you present your skills effectively. Dress professionally and arrive on time for in-person interviews.",
				topic: 'interview'
			},
			{
				keywords: [/career|growth|development/i],
				response:
					"Career Development: Focus on continuous learning and skill development. Use our CV Creator to highlight your achievements and growth. Network with professionals in your field and stay updated with industry trends for better career opportunities.",
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
			return 'I can help with our website, jobs, and services. Please let me know if you are looking for Government Jobs, Companies, the CV Creator, or account assistance. You can also ask about salary, experience levels, locations, or interview preparation.';
		}

		return "I'm here to help with questions about our website, job opportunities, CV creation, account management, and career guidance. Please ask me anything related to Careervue services!";
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
											className={`px-3 py-2 rounded-lg text-sm shadow ${
												m.role === 'user'
													? 'bg-blue-600 text-white rounded-br-none'
													: 'bg-gray-100 text-gray-800 rounded-bl-none'
											}`}
										>
											{m.text}
											<div className="mt-1 flex items-center space-x-1 opacity-70 text-[10px]">
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