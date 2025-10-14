import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  // Building,
  ExternalLink,
  FileText,
  // Users,
} from "lucide-react";
import { jobsAPI } from "../../services/api";
import { Job } from "../../types";
// import { Pagination } from "../common/Pagination";
import { mockJobs } from "../../data/mockJobs";
import { useChatbot } from "../../contexts/ChatbotContext";

interface JobListProps {
  onViewDetails: (jobId: string) => void;
}

// Generate additional private jobs for demonstration
const generateAdditionalPrivateJobs = (): Job[] => {
  const additionalJobs: Job[] = [];
  const companies = [
    "Infosys",
    "Wipro",
    "HCL Technologies",
    "Tech Mahindra",
    "Cognizant",
    "Accenture",
    "IBM India",
    "Oracle India",
    "SAP India",
    "Salesforce India",
    "Amazon India",
    "Netflix India",
    "Uber India",
    "Ola",
    "Zomato",
    "Swiggy",
    "Paytm",
    "PhonePe",
    "Razorpay",
    "CRED",
    "BYJU's",
    "Unacademy",
    "Vedantu",
    "WhiteHat Jr",
    "Coding Ninjas",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Yes Bank",
    "Reliance Industries",
    "Tata Group",
    "Mahindra Group",
    "Godrej Group",
    "Adani Group",
  ];

  const cities = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Indore",
    "Bhopal",
    "Nagpur",
    "Vadodara",
  ];

  const categories = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Operations",
    "HR",
    "Legal",
    "Consulting",
    "Banking",
    "Government",
    "Other",
  ];

  const employmentTypes = ["full-time", "part-time", "contract", "internship"];

  for (let i = 0; i < 25; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const employmentType =
      employmentTypes[Math.floor(Math.random() * employmentTypes.length)];

    const minSalary = Math.floor(Math.random() * 500000) + 200000;
    const maxSalary = minSalary + Math.floor(Math.random() * 800000);

    const job: Job = {
      id: `private-${i + 100}`,
      title: `${category} ${
        employmentType === "internship" ? "Intern" : "Professional"
      } - ${Math.floor(Math.random() * 1000) + 1}`,
      company: company,
      type: "private",
      location: `${city}, India`,
      salary: {
        min: minSalary,
        max: maxSalary,
      },
      experience: `${Math.floor(Math.random() * 5)}-${
        Math.floor(Math.random() * 5) + 5
      } years`,
      description: `Join ${company} as a ${category} professional. This is an exciting opportunity to work on innovative projects and grow your career in a dynamic environment.`,
      requirements: [
        "Relevant degree or certification",
        "Good communication skills",
        "Team player attitude",
        "Willingness to learn",
        "Problem-solving abilities",
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Professional development",
        "Work-life balance",
        "Career growth opportunities",
      ],
      deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      posted: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      category: category,
      // employmentType: employmentType,
      isPremium: Math.random() > 0.7,
    };

    additionalJobs.push(job);
  }

  return additionalJobs;
};

export const JobList: React.FC<JobListProps> = ({ onViewDetails }) => {
  const { openChatbot } = useChatbot();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    employmentType: "all",
    salaryRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {};

      if (searchTerm) params.search = searchTerm;
      if (filters.type !== "all") params.type = filters.type;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.employmentType !== "all")
        params.employmentType = filters.employmentType;

      const response = await jobsAPI.getJobs(params);
      setJobs(response.jobs || []);
      setError("");
    } catch (err) {
      console.log("API call failed, using mock data as fallback");
      // Use mock data as fallback when API fails
      const allMockJobs = [...mockJobs, ...generateAdditionalPrivateJobs()];
      setJobs(allMockJobs);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading jobs...
      </div>
    );
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.type === "all" || job.type === filters.type;
    const matchesCategory =
      filters.category === "all" || job.category === filters.category;
    const matchesEmploymentType =
      filters.employmentType === "all" ||
      job.employmentType === filters.employmentType;

    let matchesSalary = true;
    if (filters.salaryRange !== "all") {
      const [min, max] = filters.salaryRange.split("-").map(Number);
      // Fix salary filtering logic
      if (filters.salaryRange === "800000-1200000") {
        // For 8L+ category, check if min salary is >= 800000
        matchesSalary = job.salary.min >= min;
      } else {
        // For other ranges, check if job salary falls within the range
        matchesSalary = job.salary.min >= min && job.salary.max <= max;
      }
    }

    const result =
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesEmploymentType &&
      matchesSalary;

    return result;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isDeadlineNear = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const categories = [
    "all",
    ...Array.from(new Set(jobs.map((job) => job.category))),
  ];
  const employmentTypes = [
    "all",
    ...Array.from(new Set(jobs.map((job) => job.employmentType))),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover opportunities in government and private sectors
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="government">Government</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) =>
                  setFilters({ ...filters, employmentType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <select
                value={filters.salaryRange}
                onChange={(e) =>
                  setFilters({ ...filters, salaryRange: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Salaries</option>
                <option value="200000-400000">₹2L - ₹4L</option>
                <option value="400000-600000">₹4L - ₹6L</option>
                <option value="600000-800000">₹6L - ₹8L</option>
                <option value="800000-1200000">₹8L+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Jobs Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Briefcase className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
        </div>
        <div className="hidden md:grid md:grid-cols-6 gap-4 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
              SR NO
            </span>
            <span>JOB TITLE</span>
          </div>
          <div className="text-center">COMPANY</div>
          <div className="text-center">LOCATION</div>
          <div className="text-center">DEADLINE</div>
          <div className="text-center">DETAILS</div>
          <div className="text-center">APPLY</div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)}{" "}
          of {filteredJobs.length} jobs
        </p>
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {filteredJobs.filter((job) => job.type === "government").length}{" "}
            Government •{" "}
            {filteredJobs.filter((job) => job.type === "private").length}{" "}
            Private
          </span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {currentJobs.map((job, index) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Job Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {startIndex + index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.type === "government"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {job.type === "government" ? "Government" : "Private"}
                      </span>
                      {job.isPremium && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center space-x-1">
                          <span>Premium</span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="capitalize">
                          {job.employmentType.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>
                          {formatSalary(job.salary.min, job.salary.max)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="text-center md:text-left">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{job.company}</p>
                    <p className="text-gray-600">{job.category}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                      isDeadlinePassed(job.deadline)
                        ? "bg-red-100 text-red-800"
                        : isDeadlineNear(job.deadline)
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(job.deadline)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="text-center">
                  <button
                    onClick={() => onViewDetails(job.id)}
                    className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>

                {/* Apply */}
                <div className="text-center">
                  <button
                    onClick={() => onViewDetails(job.id)}
                    disabled={isDeadlinePassed(job.deadline)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDeadlinePassed(job.deadline)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>
                      {isDeadlinePassed(job.deadline) ? "Closed" : "Apply Now"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Description: </span>
                    <span className="line-clamp-2">{job.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Posted: </span>
                    <span>{formatDate(job.posted)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredJobs.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          {/* Results Summary and Page Navigation - All in One Line */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              {/* Results Summary */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredJobs.length)} of{" "}
                {filteredJobs.length} results
              </div>

              {/* Go to Page Section */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Page"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const page = parseInt(
                        (e.target as HTMLInputElement).value
                      );
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Page"]'
                    ) as HTMLInputElement;
                    const page = parseInt(input.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go
                </button>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-1">
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title="First Page"
                >
                  <span className="text-lg">«</span>
                </button>

                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title="Previous Page"
                >
                  <span className="text-lg">‹</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;

                    if (totalPages <= maxVisiblePages) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      if (currentPage <= 3) {
                        for (let i = 1; i <= 4; i++) {
                          pages.push(i);
                        }
                        pages.push("...");
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push(1);
                        pages.push("...");
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);
                        pages.push("...");
                        for (
                          let i = currentPage - 1;
                          i <= currentPage + 1;
                          i++
                        ) {
                          pages.push(i);
                        }
                        pages.push("...");
                        pages.push(totalPages);
                      }
                    }

                    return pages.map((page, index) => (
                      <React.Fragment key={index}>
                        {page === "..." ? (
                          <span className="px-2 py-1 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 text-sm font-medium rounded transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title="Next Page"
                >
                  <span className="text-lg">›</span>
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-1 text-sm font-medium rounded transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title="Last Page"
                >
                  <span className="text-lg">»</span>
                </button>
              </div>

              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};
