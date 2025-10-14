import { GovernmentJob } from '../data/governmentJobs';
import { Job } from '../types';

export interface JobUpdate {
  id: string;
  title: string;
  lastDate: string;
  examDate?: string;
  posts: number;
  applicationFee: number;
  isActive: boolean;
  lastUpdated: string;
  source: string;
  newsUrl?: string;
}

export interface JobNewsSource {
  name: string;
  url: string;
  type: 'government' | 'private' | 'both';
  lastChecked: string;
}

// Real-time job update sources
export const jobNewsSources: JobNewsSource[] = [
  {
    name: 'SBI Careers',
    url: 'https://www.sbi.co.in/web/careers/current-openings',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'IBPS Careers',
    url: 'https://www.ibps.in/career-opportunities',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'UPSC Notifications',
    url: 'https://www.upsc.gov.in/examinations',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'SSC Notifications',
    url: 'https://ssc.nic.in/notifications',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'NTA Notifications',
    url: 'https://nta.ac.in/notifications',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'RRB Notifications',
    url: 'https://www.rrbcdg.gov.in/notifications',
    type: 'government',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs',
    type: 'private',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'Indeed India',
    url: 'https://in.indeed.com',
    type: 'private',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'Naukri.com',
    url: 'https://www.naukri.com',
    type: 'private',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'Monster India',
    url: 'https://www.monsterindia.com',
    type: 'private',
    lastChecked: new Date().toISOString()
  }
];

// Mock function to simulate real-time job updates
export const fetchLatestJobUpdates = async (): Promise<JobUpdate[]> => {
  // In a real implementation, this would fetch from actual APIs
  // For now, we'll simulate updates based on current date
  
  const currentDate = new Date();
  const updates: JobUpdate[] = [];
  
  // Simulate SBI PO 2025 updates
  if (currentDate.getMonth() === 0 && currentDate.getDate() >= 15) { // January 15+
    updates.push({
      id: 'sbi-po-2025',
      title: 'SBI PO 2025 - Probationary Officer',
      lastDate: '2025-05-30',
      examDate: '2025-08-15',
      posts: 2000,
      applicationFee: 750,
      isActive: true,
      lastUpdated: '2025-01-15',
      source: 'SBI Official Website',
      newsUrl: 'https://www.sbi.co.in/web/careers/current-openings'
    });
  }
  
  // Simulate IBPS Clerk 2025 updates
  if (currentDate.getMonth() === 0 && currentDate.getDate() >= 20) { // January 20+
    updates.push({
      id: 'ibps-clerk-2025',
      title: 'IBPS Clerk 2025 - Office Assistant',
      lastDate: '2025-06-15',
      examDate: '2025-09-20',
      posts: 5000,
      applicationFee: 600,
      isActive: true,
      lastUpdated: '2025-01-20',
      source: 'IBPS Official Website',
      newsUrl: 'https://www.ibps.in/career-opportunities'
    });
  }
  
  // Simulate RRB NTPC 2025 updates
  if (currentDate.getMonth() === 1 && currentDate.getDate() >= 10) { // February 10+
    updates.push({
      id: 'rrb-ntpc-2025',
      title: 'RRB NTPC 2025 - Non-Technical Popular Categories',
      lastDate: '2025-07-20',
      examDate: '2025-10-15',
      posts: 25000,
      applicationFee: 500,
      isActive: true,
      lastUpdated: '2025-02-10',
      source: 'RRB Official Website',
      newsUrl: 'https://www.rrbcdg.gov.in/notifications'
    });
  }
  
  // Simulate SSC CGL 2025 updates
  if (currentDate.getMonth() === 2 && currentDate.getDate() >= 15) { // March 15+
    updates.push({
      id: 'ssc-cgl-2025',
      title: 'SSC CGL 2025 - Combined Graduate Level',
      lastDate: '2025-08-15',
      examDate: '2025-11-10',
      posts: 18000,
      applicationFee: 100,
      isActive: true,
      lastUpdated: '2025-03-15',
      source: 'SSC Official Website',
      newsUrl: 'https://ssc.nic.in/notifications'
    });
  }
  
  // Simulate UPSC Civil Services 2025 updates
  if (currentDate.getMonth() === 3 && currentDate.getDate() >= 1) { // April 1+
    updates.push({
      id: 'upsc-civil-2025',
      title: 'UPSC Civil Services 2025 - IAS/IPS/IFS',
      lastDate: '2025-04-30',
      examDate: '2025-06-02',
      posts: 1000,
      applicationFee: 100,
      isActive: true,
      lastUpdated: '2025-04-01',
      source: 'UPSC Official Website',
      newsUrl: 'https://www.upsc.gov.in/examinations/civil-services-examination'
    });
  }
  
  return updates;
};

// Function to update government jobs with latest information
export const updateGovernmentJobs = async (): Promise<GovernmentJob[]> => {
  const updates = await fetchLatestJobUpdates();
  const updatedJobs = [...governmentJobs]; // Import from governmentJobs.ts
  
  updates.forEach(update => {
    const existingJobIndex = updatedJobs.findIndex(job => 
      job.title.toLowerCase().includes(update.title.toLowerCase().split(' ')[0])
    );
    
    if (existingJobIndex !== -1) {
      updatedJobs[existingJobIndex] = {
        ...updatedJobs[existingJobIndex],
        lastDate: update.lastDate,
        examDate: update.examDate,
        posts: update.posts,
        applicationFee: update.applicationFee,
        isActive: update.isActive,
        lastUpdated: update.lastUpdated,
        source: update.source,
        newsSource: update.newsUrl
      };
    }
  });
  
  return updatedJobs;
};

// Function to check for new job notifications
export const checkNewJobNotifications = async (): Promise<{
  newJobs: number;
  updatedJobs: number;
  notifications: string[];
}> => {
  const updates = await fetchLatestJobUpdates();
  const currentDate = new Date();
  
  let newJobs = 0;
  let updatedJobs = 0;
  const notifications: string[] = [];
  
  updates.forEach(update => {
    const updateDate = new Date(update.lastUpdated);
    const daysDiff = Math.floor((currentDate.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) { // Jobs updated in last 7 days
      updatedJobs++;
      notifications.push(`🆕 ${update.title} - Updated ${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`);
    }
    
    if (daysDiff <= 1) { // Jobs updated today or yesterday
      newJobs++;
      notifications.push(`🔥 NEW: ${update.title} - Just announced!`);
    }
  });
  
  return { newJobs, updatedJobs, notifications };
};

// Function to get trending job categories
export const getTrendingJobCategories = async (): Promise<{
  category: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}[]> => {
  // Simulate trending categories based on current month
  const currentMonth = new Date().getMonth();
  
  const trends = [
    { category: 'Banking', count: 15000, trend: 'up' as const },
    { category: 'Technology', count: 25000, trend: 'up' as const },
    { category: 'Education', count: 8000, trend: 'stable' as const },
    { category: 'Central Government', count: 12000, trend: 'up' as const },
    { category: 'Healthcare', count: 6000, trend: 'up' as const }
  ];
  
  // Adjust counts based on current month (exam season)
  if (currentMonth >= 2 && currentMonth <= 5) { // March to June
    trends[2].count += 2000; // More education jobs
    trends[2].trend = 'up';
  }
  
  if (currentMonth >= 0 && currentMonth <= 2) { // January to March
    trends[0].count += 3000; // More banking jobs
    trends[0].trend = 'up';
  }
  
  return trends;
};

// Function to get job alerts for users
export const getJobAlerts = async (userPreferences: {
  categories: string[];
  locations: string[];
  salaryRange: { min: number; max: number };
}): Promise<JobUpdate[]> => {
  const updates = await fetchLatestJobUpdates();
  
  return updates.filter(update => {
    // Filter based on user preferences
    const matchesCategory = userPreferences.categories.some(cat => 
      update.title.toLowerCase().includes(cat.toLowerCase())
    );
    
    // Add more filtering logic as needed
    return matchesCategory;
  });
}; 