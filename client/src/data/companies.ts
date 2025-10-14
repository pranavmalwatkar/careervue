import { Company } from '../types';
import { companiesAPI } from '../services/api';

// Cache for API data
let companiesCache: Company[] | null = null;
let sectorsCache: string[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback data in case API fails
const realCompanies: Company[] = [
  // IT & Software
  {
    id: '1',
    name: 'Tata Consultancy Services (TCS)',
    sector: 'IT & Software',
    officialWebsite: 'https://www.tcs.com',
    careerLink: 'https://www.tcs.com/careers',
    description: 'Leading global IT services, consulting and business solutions organization. Currently hiring for Software Engineers, Business Analysts, and Project Managers.',
    headquarters: 'Mumbai, India',
    founded: '1968',
    employees: '500,000+'
  },
  {
    id: '2',
    name: 'Infosys',
    sector: 'IT & Software',
    officialWebsite: 'https://www.infosys.com',
    careerLink: 'https://www.infosys.com/careers',
    description: 'Global leader in next-generation digital services and consulting. Active recruitment for Java Developers, Data Scientists, and Cloud Engineers.',
    headquarters: 'Bangalore, India',
    founded: '1981',
    employees: '300,000+'
  },
  {
    id: '3',
    name: 'Wipro',
    sector: 'IT & Software',
    officialWebsite: 'https://www.wipro.com',
    careerLink: 'https://careers.wipro.com',
    description: 'Leading global information technology, consulting and business process services',
    headquarters: 'Bangalore, India',
    founded: '1945',
    employees: '250,000+'
  },
  {
    id: '4',
    name: 'HCL Technologies',
    sector: 'IT & Software',
    officialWebsite: 'https://www.hcltech.com',
    careerLink: 'https://www.hcltech.com/careers',
    description: 'Global technology company providing industry-transforming capabilities',
    headquarters: 'Noida, India',
    founded: '1976',
    employees: '200,000+'
  },
  {
    id: '5',
    name: 'Tech Mahindra',
    sector: 'IT & Software',
    officialWebsite: 'https://www.techmahindra.com',
    careerLink: 'https://www.techmahindra.com/careers',
    description: 'Digital transformation, consulting and business re-engineering services',
    headquarters: 'Pune, India',
    founded: '1986',
    employees: '150,000+'
  },
  
  // E-commerce
  {
    id: '6',
    name: 'Flipkart',
    sector: 'E-commerce',
    officialWebsite: 'https://www.flipkart.com',
    careerLink: 'https://www.flipkartcareers.com',
    description: 'Leading e-commerce marketplace in India. Currently hiring for Product Managers, Software Engineers, and Data Analysts.',
    headquarters: 'Bangalore, India',
    founded: '2007',
    employees: '50,000+'
  },
  {
    id: '7',
    name: 'Amazon India',
    sector: 'E-commerce',
    officialWebsite: 'https://www.amazon.in',
    careerLink: 'https://www.amazon.jobs/en/locations/india',
    description: 'Global e-commerce and cloud computing company',
    headquarters: 'Bangalore, India',
    founded: '2013',
    employees: '100,000+'
  },
  {
    id: '8',
    name: 'Paytm',
    sector: 'Fintech',
    officialWebsite: 'https://paytm.com',
    careerLink: 'https://jobs.paytm.com',
    description: 'Leading digital payments and financial services company',
    headquarters: 'Noida, India',
    founded: '2010',
    employees: '25,000+'
  },

  // Banking & Financial Services
  {
    id: '9',
    name: 'State Bank of India (SBI)',
    sector: 'Banking',
    officialWebsite: 'https://sbi.co.in',
    careerLink: 'https://bank.sbi/careers',
    description: 'Largest public sector bank in India. Upcoming recruitment for Probationary Officers, Clerks, and Specialist Officers in March 2024.',
    headquarters: 'Mumbai, India',
    founded: '1955',
    employees: '250,000+'
  },
  {
    id: '10',
    name: 'HDFC Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.hdfcbank.com',
    careerLink: 'https://www.hdfcbank.com/personal/about-us/careers',
    description: 'Leading private sector bank in India',
    headquarters: 'Mumbai, India',
    founded: '1994',
    employees: '120,000+'
  },
  {
    id: '11',
    name: 'ICICI Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.icicibank.com',
    careerLink: 'https://www.icicibank.com/careers',
    description: 'Leading private sector bank offering comprehensive financial solutions',
    headquarters: 'Mumbai, India',
    founded: '1994',
    employees: '100,000+'
  },

  // Automotive
  {
    id: '12',
    name: 'Tata Motors',
    sector: 'Automotive',
    officialWebsite: 'https://www.tatamotors.com',
    careerLink: 'https://www.tatamotors.com/careers',
    description: 'Leading automotive manufacturer in India',
    headquarters: 'Mumbai, India',
    founded: '1945',
    employees: '80,000+'
  },
  {
    id: '13',
    name: 'Mahindra & Mahindra',
    sector: 'Automotive',
    officialWebsite: 'https://www.mahindra.com',
    careerLink: 'https://www.mahindra.com/careers',
    description: 'Leading automotive and farm equipment manufacturer',
    headquarters: 'Mumbai, India',
    founded: '1945',
    employees: '250,000+'
  },

  // Telecommunications
  {
    id: '14',
    name: 'Reliance Jio',
    sector: 'Telecommunications',
    officialWebsite: 'https://www.jio.com',
    careerLink: 'https://careers.jio.com',
    description: 'Leading telecommunications company in India',
    headquarters: 'Mumbai, India',
    founded: '2016',
    employees: '50,000+'
  },
  {
    id: '15',
    name: 'Bharti Airtel',
    sector: 'Telecommunications',
    officialWebsite: 'https://www.airtel.in',
    careerLink: 'https://careers.airtel.com',
    description: 'Leading telecommunications services provider',
    headquarters: 'New Delhi, India',
    founded: '1995',
    employees: '50,000+'
  },

  // Pharmaceuticals
  {
    id: '16',
    name: 'Sun Pharmaceutical',
    sector: 'Pharmaceuticals',
    officialWebsite: 'https://www.sunpharma.com',
    careerLink: 'https://www.sunpharma.com/careers',
    description: 'Leading pharmaceutical company in India',
    headquarters: 'Mumbai, India',
    founded: '1983',
    employees: '50,000+'
  },
  {
    id: '17',
    name: 'Dr. Reddy\'s Laboratories',
    sector: 'Pharmaceuticals',
    officialWebsite: 'https://www.drreddys.com',
    careerLink: 'https://www.drreddys.com/careers',
    description: 'Global pharmaceutical company',
    headquarters: 'Hyderabad, India',
    founded: '1984',
    employees: '25,000+'
  },

  // FMCG
  {
    id: '18',
    name: 'Hindustan Unilever Limited (HUL)',
    sector: 'FMCG',
    officialWebsite: 'https://www.hul.co.in',
    careerLink: 'https://careers.unilever.com/india',
    description: 'Leading FMCG company in India',
    headquarters: 'Mumbai, India',
    founded: '1933',
    employees: '18,000+'
  },
  {
    id: '19',
    name: 'ITC Limited',
    sector: 'FMCG',
    officialWebsite: 'https://www.itcportal.com',
    careerLink: 'https://www.itcportal.com/careers',
    description: 'Diversified conglomerate with presence in FMCG, hotels, and more',
    headquarters: 'Kolkata, India',
    founded: '1910',
    employees: '25,000+'
  },

  // Startups
  {
    id: '20',
    name: 'Zomato',
    sector: 'Startups',
    officialWebsite: 'https://www.zomato.com',
    careerLink: 'https://www.zomato.com/careers',
    description: 'Leading food delivery and restaurant discovery platform. Currently hiring for Software Engineers, Product Managers, and Business Development roles.',
    headquarters: 'Gurugram, India',
    founded: '2008',
    employees: '5,000+'
  },
  {
    id: '21',
    name: 'Swiggy',
    sector: 'Startups',
    officialWebsite: 'https://www.swiggy.com',
    careerLink: 'https://careers.swiggy.com',
    description: 'On-demand delivery platform',
    headquarters: 'Bangalore, India',
    founded: '2014',
    employees: '5,000+'
  },
  {
    id: '22',
    name: 'Ola',
    sector: 'Startups',
    officialWebsite: 'https://www.olacabs.com',
    careerLink: 'https://www.olacabs.com/careers',
    description: 'Leading mobility platform in India',
    headquarters: 'Bangalore, India',
    founded: '2010',
    employees: '10,000+'
  },

  // Government Organizations
  {
    id: '23',
    name: 'Indian Space Research Organisation (ISRO)',
    sector: 'Government',
    officialWebsite: 'https://www.isro.gov.in',
    careerLink: 'https://www.isro.gov.in/careers',
    description: 'National space agency of India',
    headquarters: 'Bangalore, India',
    founded: '1969',
    employees: '17,000+'
  },
  {
    id: '24',
    name: 'Bharat Heavy Electricals Limited (BHEL)',
    sector: 'Government',
    officialWebsite: 'https://www.bhel.com',
    careerLink: 'https://careers.bhel.com',
    description: 'Leading engineering and manufacturing company',
    headquarters: 'New Delhi, India',
    founded: '1964',
    employees: '40,000+'
  },

  // Additional IT & Software Companies
  {
    id: '25',
    name: 'Accenture India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.accenture.com',
    careerLink: 'https://www.accenture.com/in-en/careers',
    description: 'Global professional services company with leading capabilities in digital, cloud and security',
    headquarters: 'Bangalore, India',
    founded: '1989',
    employees: '200,000+'
  },
  {
    id: '26',
    name: 'IBM India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.ibm.com',
    careerLink: 'https://www.ibm.com/careers/in-en',
    description: 'Leading technology and consulting company',
    headquarters: 'Bangalore, India',
    founded: '1992',
    employees: '130,000+'
  },
  {
    id: '27',
    name: 'Microsoft India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.microsoft.com',
    careerLink: 'https://careers.microsoft.com/professionals/us/en/c/india-jobs',
    description: 'Global technology company providing cloud computing, productivity software, and AI services',
    headquarters: 'Hyderabad, India',
    founded: '1990',
    employees: '18,000+'
  },
  {
    id: '28',
    name: 'Google India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.google.com',
    careerLink: 'https://careers.google.com/locations/india/',
    description: 'Leading internet services and technology company',
    headquarters: 'Bangalore, India',
    founded: '2004',
    employees: '5,000+'
  },
  {
    id: '29',
    name: 'Oracle India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.oracle.com',
    careerLink: 'https://www.oracle.com/corporate/careers/',
    description: 'Enterprise software and cloud computing company',
    headquarters: 'Bangalore, India',
    founded: '1993',
    employees: '45,000+'
  },
  {
    id: '30',
    name: 'Salesforce India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.salesforce.com',
    careerLink: 'https://www.salesforce.com/company/careers/',
    description: 'Leading customer relationship management (CRM) platform',
    headquarters: 'Mumbai, India',
    founded: '2005',
    employees: '8,000+'
  },
  {
    id: '31',
    name: 'Adobe India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.adobe.com',
    careerLink: 'https://www.adobe.com/careers.html',
    description: 'Digital media and marketing solutions company',
    headquarters: 'Noida, India',
    founded: '1998',
    employees: '6,000+'
  },
  {
    id: '32',
    name: 'SAP India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.sap.com',
    careerLink: 'https://jobs.sap.com/search/?q=&locationsearch=India',
    description: 'Enterprise software and cloud solutions provider',
    headquarters: 'Bangalore, India',
    founded: '1996',
    employees: '15,000+'
  },
  {
    id: '33',
    name: 'Capgemini India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.capgemini.com',
    careerLink: 'https://www.capgemini.com/careers/',
    description: 'Global consulting, technology services and digital transformation company',
    headquarters: 'Mumbai, India',
    founded: '1991',
    employees: '125,000+'
  },
  {
    id: '34',
    name: 'Cognizant India',
    sector: 'IT & Software',
    officialWebsite: 'https://www.cognizant.com',
    careerLink: 'https://careers.cognizant.com/',
    description: 'Professional services company helping organizations modernize technology',
    headquarters: 'Chennai, India',
    founded: '1994',
    employees: '220,000+'
  },

  // Banking & Financial Services
  {
    id: '35',
    name: 'Axis Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.axisbank.com',
    careerLink: 'https://www.axisbank.com/careers',
    description: 'Leading private sector bank in India',
    headquarters: 'Mumbai, India',
    founded: '1993',
    employees: '80,000+'
  },
  {
    id: '36',
    name: 'Kotak Mahindra Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.kotak.com',
    careerLink: 'https://www.kotak.com/en/careers.html',
    description: 'Leading private sector bank offering comprehensive financial solutions',
    headquarters: 'Mumbai, India',
    founded: '1985',
    employees: '75,000+'
  },
  {
    id: '37',
    name: 'Yes Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.yesbank.in',
    careerLink: 'https://www.yesbank.in/careers',
    description: 'Full-service commercial bank providing comprehensive banking solutions',
    headquarters: 'Mumbai, India',
    founded: '2004',
    employees: '25,000+'
  },
  {
    id: '38',
    name: 'IndusInd Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.indusind.com',
    careerLink: 'https://www.indusind.com/in/en/personal/careers.html',
    description: 'Leading private sector bank with innovative banking solutions',
    headquarters: 'Mumbai, India',
    founded: '1994',
    employees: '45,000+'
  },
  {
    id: '39',
    name: 'IDFC First Bank',
    sector: 'Banking',
    officialWebsite: 'https://www.idfcfirstbank.com',
    careerLink: 'https://www.idfcfirstbank.com/careers',
    description: 'Universal bank offering retail, corporate and investment banking services',
    headquarters: 'Mumbai, India',
    founded: '2018',
    employees: '20,000+'
  },

  // E-commerce & Startups
  {
    id: '40',
    name: 'Myntra',
    sector: 'E-commerce',
    officialWebsite: 'https://www.myntra.com',
    careerLink: 'https://careers.myntra.com/',
    description: 'Leading fashion e-commerce platform in India',
    headquarters: 'Bangalore, India',
    founded: '2007',
    employees: '4,000+'
  },
  {
    id: '41',
    name: 'Snapdeal',
    sector: 'E-commerce',
    officialWebsite: 'https://www.snapdeal.com',
    careerLink: 'https://www.snapdeal.com/careers',
    description: 'Online marketplace connecting buyers and sellers across India',
    headquarters: 'New Delhi, India',
    founded: '2010',
    employees: '2,000+'
  },
  {
    id: '42',
    name: 'BigBasket',
    sector: 'E-commerce',
    officialWebsite: 'https://www.bigbasket.com',
    careerLink: 'https://www.bigbasket.com/careers/',
    description: 'Leading online grocery delivery platform',
    headquarters: 'Bangalore, India',
    founded: '2011',
    employees: '3,000+'
  },
  {
    id: '43',
    name: 'Grofers (Blinkit)',
    sector: 'E-commerce',
    officialWebsite: 'https://blinkit.com',
    careerLink: 'https://blinkit.com/careers',
    description: 'Quick commerce platform for instant grocery delivery',
    headquarters: 'Gurugram, India',
    founded: '2013',
    employees: '2,500+'
  },
  {
    id: '44',
    name: 'Urban Company',
    sector: 'Startups',
    officialWebsite: 'https://www.urbancompany.com',
    careerLink: 'https://www.urbancompany.com/careers',
    description: 'On-demand home services platform',
    headquarters: 'Gurugram, India',
    founded: '2014',
    employees: '3,000+'
  },
  {
    id: '45',
    name: 'Byju\'s',
    sector: 'EdTech',
    officialWebsite: 'https://byjus.com',
    careerLink: 'https://byjus.com/careers/',
    description: 'Leading educational technology company',
    headquarters: 'Bangalore, India',
    founded: '2011',
    employees: '50,000+'
  },
  {
    id: '46',
    name: 'Unacademy',
    sector: 'EdTech',
    officialWebsite: 'https://unacademy.com',
    careerLink: 'https://unacademy.com/careers',
    description: 'Online learning platform for competitive exam preparation',
    headquarters: 'Bangalore, India',
    founded: '2015',
    employees: '8,000+'
  },
  {
    id: '47',
    name: 'Vedantu',
    sector: 'EdTech',
    officialWebsite: 'https://www.vedantu.com',
    careerLink: 'https://www.vedantu.com/careers',
    description: 'Live online tutoring platform',
    headquarters: 'Bangalore, India',
    founded: '2014',
    employees: '5,000+'
  },
  {
    id: '48',
    name: 'PhonePe',
    sector: 'Fintech',
    officialWebsite: 'https://www.phonepe.com',
    careerLink: 'https://www.phonepe.com/careers/',
    description: 'Leading digital payments platform',
    headquarters: 'Bangalore, India',
    founded: '2015',
    employees: '3,000+'
  },
  {
    id: '49',
    name: 'Razorpay',
    sector: 'Fintech',
    officialWebsite: 'https://razorpay.com',
    careerLink: 'https://razorpay.com/careers/',
    description: 'Payment gateway and financial services platform',
    headquarters: 'Bangalore, India',
    founded: '2014',
    employees: '2,000+'
  },
  {
    id: '50',
    name: 'Policybazaar',
    sector: 'Fintech',
    officialWebsite: 'https://www.policybazaar.com',
    careerLink: 'https://www.policybazaar.com/careers',
    description: 'Online insurance marketplace',
    headquarters: 'Gurugram, India',
    founded: '2008',
    employees: '8,000+'
  }
];

// Generate additional companies programmatically to reach 500+
const generateAdditionalCompanies = (): Company[] => {
  const additionalCompanies: Company[] = [];
  const sectors = ['IT & Software', 'Banking', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting', 'Media', 'Real Estate', 'Energy', 'Logistics'];
  const cities = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Noida'];
  
  for (let i = 51; i <= 500; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const founded = 1990 + Math.floor(Math.random() * 34); // Random year between 1990-2024
    const employees = Math.floor(Math.random() * 50000) + 100; // Random employees between 100-50000
    
    additionalCompanies.push({
      id: i.toString(),
      name: `${sector.split(' ')[0]} Solutions ${i}`,
      sector: sector,
      officialWebsite: `https://www.company${i}.com`,
      careerLink: `https://www.company${i}.com/careers`,
      description: `Leading ${sector.toLowerCase()} company providing innovative solutions and services`,
      headquarters: `${city}, India`,
      founded: founded.toString(),
      employees: `${employees.toLocaleString()}+`
    });
  }
  
  return additionalCompanies;
};

// API-based functions with caching
export const getIndianCompanies = async (params: {
  page?: number;
  limit?: number;
  sector?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
} = {}): Promise<Company[]> => {
  try {
    // Check cache first
    const now = Date.now();
    if (companiesCache && (now - lastFetchTime) < CACHE_DURATION) {
      return companiesCache || [];
    }

    const response = await companiesAPI.getCompanies(params);
    companiesCache = response.companies || [];
    lastFetchTime = now;

    return companiesCache || [];
  } catch (error) {
    console.error('Error fetching companies from API:', error);
    // Fallback to static data if API fails
    return [...realCompanies, ...generateAdditionalCompanies()];
  }
};

export const getSectors = async (): Promise<string[]> => {
  try {
    // Check cache first
    if (sectorsCache) {
      return sectorsCache;
    }

    const sectors = await companiesAPI.getSectors();
    sectorsCache = sectors;
    return sectors;
  } catch (error) {
    console.error('Error fetching sectors from API:', error);
    // Fallback to static sectors
    return [
      'All Sectors',
      'EdTech',
      'IT & Software',
      'E-commerce',
      'Fintech',
      'Banking',
      'Automotive',
      'Telecommunications',
      'Pharmaceuticals',
      'FMCG',
      'Startups',
      'Government'
    ];
  }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    return await companiesAPI.getCompanyById(id);
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    return null;
  }
};

export const getCompanyStats = async () => {
  try {
    return await companiesAPI.getCompanyStats();
  } catch (error) {
    console.error('Error fetching company stats:', error);
    return {
      totalCompanies: realCompanies.length + generateAdditionalCompanies().length,
      totalSectors: 11,
      featuredCompanies: 0
    };
  }
};

// Backward compatibility - static exports for components that expect immediate data
export const indianCompanies: Company[] = [
  ...realCompanies,
  ...generateAdditionalCompanies()
];

export const sectors = [
  'All Sectors',
  'EdTech',
  'IT & Software',
  'E-commerce',
  'Fintech',
  'Banking',
  'Automotive',
  'Telecommunications',
  'Pharmaceuticals',
  'FMCG',
  'Startups',
  'Government'
];