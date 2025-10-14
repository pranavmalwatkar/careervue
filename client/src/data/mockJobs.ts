import { Job } from '../types';

// This file is now replaced by API calls, but keeping for reference
export const mockJobs: Job[] = [
  {
    id: '1', 
    title: 'Software Engineer - Full Stack',
    company: 'Tata Consultancy Services',
    type: 'private',
    location: 'Bangalore, Karnataka',
    salary: { min: 400000, max: 800000 },
    experience: '1-3 years',
    description: 'Join TCS as a Full Stack Developer working on cutting-edge projects for global clients. You will be responsible for developing scalable web applications using modern technologies.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '1-3 years of experience in web development',
      'Proficiency in JavaScript, TypeScript, and React',
      'Experience with databases (MySQL, MongoDB)',
      'Strong problem-solving skills'
    ],
    benefits: [
      'Health, dental, and vision insurance',
      'Provident fund and gratuity',
      'Flexible work arrangements',
      'Professional development budget',
      'Annual performance bonus'
    ],
    deadline: '2024-03-15',
    posted: '2024-01-15', 
    isPremium: false,
    category: 'Technology',
    employmentType: 'full-time'
  },
  {
    id: '2',
    title: 'Civil Services Officer - IAS',
    company: 'Government of India',
    type: 'government',
    location: 'New Delhi, Delhi',
    salary: { min: 560000, max: 1800000 },
    experience: 'Entry level',
    description: 'Join the Indian Administrative Service and serve the nation. This prestigious position offers opportunities to work in various government departments and make a significant impact on public policy.',
    requirements: [
      'Bachelor\'s degree from recognized university',
      'Age between 21-32 years (relaxation for reserved categories)',
      'Indian citizenship',
      'Clear UPSC Civil Services Examination',
      'Strong leadership and communication skills'
    ],
    benefits: [
      'Government accommodation',
      'Medical facilities',
      'Pension scheme',
      'Leave travel concession',
      'Job security and prestige'
    ],
    deadline: '2024-04-30',
    posted: '2024-01-10',
    isPremium: true,
    applicationFee: 100,
    category: 'Government',
    employmentType: 'full-time'
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company: 'Flipkart',
    type: 'private',
    location: 'Bangalore, Karnataka',
    salary: { min: 25000, max: 40000 },
    experience: 'Entry level',
    description: 'Exciting internship opportunity at Flipkart to work with big data and analytics. You will be part of the data science team analyzing customer behavior and market trends.',
    requirements: [
      'Currently pursuing or recently completed degree in Statistics, Mathematics, or Computer Science',
      'Knowledge of Python, R, or SQL',
      'Understanding of statistical concepts',
      'Experience with data visualization tools',
      'Strong analytical thinking'
    ],
    benefits: [
      'Stipend and performance bonus',
      'Mentorship from senior data scientists',
      'Flexible working hours',
      'Learning and development opportunities',
      'Potential for full-time conversion',
      'Career advancement opportunities'
    ],
    deadline: '2024-02-28',
    posted: '2024-01-18',
    isPremium: false,
    category: 'Technology',
    employmentType: 'internship'
  },
  {
    id: '4',
    title: 'Marketing Manager',
    company: 'Creative Agency Inc.',
    type: 'private',
    location: 'New York, NY',
    salary: { min: 70000, max: 95000 },
    experience: '4+ years',
    description: 'Lead our marketing initiatives and drive brand awareness. Perfect opportunity for a creative professional to make a significant impact.',
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      '4+ years of marketing experience',
      'Experience with digital marketing tools',
      'Strong analytical skills',
      'Creative thinking and leadership abilities'
    ],
    benefits: [
      'Health and wellness programs',
      'Performance bonuses',
      'Creative workspace',
      'Team building activities',
      'Professional growth opportunities'
    ],
    deadline: '2024-02-25',
    posted: '2024-01-20',
    isPremium: false,
    category: 'Marketing',
    employmentType: 'full-time'
  },
  {
    id: '5',
    title: 'Data Analyst',
    company: 'Ministry of Health',
    type: 'government',
    location: 'Austin, TX',
    salary: { min: 55000, max: 75000 },
    experience: '2+ years',
    description: 'Analyze health data to support public health initiatives. Make a difference in community health outcomes through data-driven insights.',
    requirements: [
      'Bachelor\'s degree in Statistics, Mathematics, or related field',
      '2+ years of data analysis experience',
      'Proficiency in SQL and Excel',
      'Knowledge of statistical software (R, Python)',
      'Strong attention to detail'
    ],
    benefits: [
      'Government health benefits',
      'Retirement savings plan',
      'Flexible schedule',
      'Professional development',
      'Work-life balance'
    ],
    deadline: '2024-03-01',
    posted: '2024-01-25',
    isPremium: true,
    applicationFee: 20,
    category: 'Healthcare',
    employmentType: 'full-time'
  },
  {
    id: '6',
    title: 'UX Designer',
    company: 'Design Studio Pro',
    type: 'private',
    location: 'Seattle, WA',
    salary: { min: 80000, max: 110000 },
    experience: '3+ years',
    description: 'Create intuitive and engaging user experiences for our digital products. Join a team that values creativity and user-centered design.',
    requirements: [
      'Bachelor\'s degree in Design or related field',
      '3+ years of UX design experience',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Understanding of user research methods',
      'Portfolio demonstrating design process'
    ],
    benefits: [
      'Comprehensive health coverage',
      'Design equipment budget',
      'Conference attendance',
      'Collaborative environment',
      'Innovation time'
    ],
    deadline: '2024-02-28',
    posted: '2024-01-18',
    isPremium: false,
    category: 'Design',
    employmentType: 'full-time'
  },
  {
    id: '7',
    title: 'Financial Analyst Intern',
    company: 'Investment Partners LLC',
    type: 'private',
    location: 'Chicago, IL',
    salary: { min: 40000, max: 50000 },
    experience: 'Entry level',
    description: 'Gain hands-on experience in financial analysis and investment research. Perfect opportunity for recent graduates to start their finance career.',
    requirements: [
      'Bachelor\'s degree in Finance, Economics, or related field',
      'Strong analytical and mathematical skills',
      'Proficiency in Excel and financial modeling',
      'Knowledge of financial markets',
      'Excellent communication skills'
    ],
    benefits: [
      'Mentorship program',
      'Training and development',
      'Networking opportunities',
      'Flexible hours',
      'Career advancement potential'
    ],
    deadline: '2024-03-15',
    posted: '2024-01-30',
    isPremium: false,
    category: 'Finance',
    employmentType: 'internship'
  }
];