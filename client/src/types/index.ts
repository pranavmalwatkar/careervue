export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  profilePicture?: string;
  isAuthenticated: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'government' | 'private';
  location: string;
  salary: {
    min: number;
    max: number;
  };
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  deadline: string;
  posted: string;
  isPremium: boolean;
  applicationFee?: number;
  category: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  resume?: string;
  coverLetter?: string;
  paymentStatus?: 'paid' | 'pending' | 'failed';
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  officialWebsite: string;
  careerLink: string;
  logo?: string;
  description?: string;
  headquarters?: string;
  founded?: string;
  employees?: string;
}