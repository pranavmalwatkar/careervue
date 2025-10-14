import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Building, MapPin, Users, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { governmentJobs, governmentCategories, GovernmentJob } from '../../data/governmentJobs';
import { Pagination } from '../common/Pagination';

export const GovernmentJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredJobs = governmentJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewNotification = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleApplyNow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isDeadlineNear = (lastDate: string) => {
    if (lastDate === 'Ongoing') return false;
    const deadline = new Date(lastDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isDeadlinePassed = (lastDate: string) => {
    if (lastDate === 'Ongoing') return false;
    const deadline = new Date(lastDate);
    const today = new Date();
    return deadline < today;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Government Jobs</h1>
        <p className="text-gray-600">Explore latest government job opportunities across India</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title, department, or ministry..."
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
            <span>Filter by Category</span>
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {governmentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Government Jobs Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Government Job Opportunities</h2>
        </div>
        <div className="hidden md:grid md:grid-cols-5 gap-4 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">SR NO</span>
            <span>JOB TITLE</span>
          </div>
          <div className="text-center">DEPARTMENT</div>
          <div className="text-center">LAST DATE</div>
          <div className="text-center">NOTIFICATION</div>
          <div className="text-center">APPLY</div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} government jobs
        </p>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {filteredJobs.filter(j => j.category === 'Central Government').length} Central • {' '}
            {filteredJobs.filter(j => j.category === 'State Government').length} State
          </span>
        </div>
      </div>

      {/* Government Jobs List */}
      <div className="space-y-4">
        {currentJobs.map((job, index) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Job Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {startIndex + index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.category === 'Central Government' 
                          ? 'bg-blue-100 text-blue-800' 
                          : job.category === 'State Government'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {job.category}
                      </span>
                      {job.posts > 0 && (
                        <span className="text-xs text-gray-500">{job.posts} Posts</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatSalary(job.salary.min, job.salary.max)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="text-center md:text-left">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{job.department}</p>
                    <p className="text-gray-600">{job.ministry}</p>
                  </div>
                </div>

                {/* Last Date */}
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    isDeadlinePassed(job.lastDate) 
                      ? 'bg-red-100 text-red-800'
                      : isDeadlineNear(job.lastDate)
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>{job.lastDate === 'Ongoing' ? 'Ongoing' : formatDate(job.lastDate)}</span>
                  </div>
                  {job.examDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Exam: {formatDate(job.examDate)}
                    </div>
                  )}
                </div>

                {/* Notification */}
                <div className="text-center">
                  <button
                    onClick={() => handleViewNotification(job.notificationLink)}
                    className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>

                {/* Apply */}
                <div className="text-center">
                  <button
                    onClick={() => handleApplyNow(job.applyLink)}
                    disabled={isDeadlinePassed(job.lastDate)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDeadlinePassed(job.lastDate)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{isDeadlinePassed(job.lastDate) ? 'Closed' : 'Apply Now'}</span>
                  </button>
                  {job.applicationFee > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Fee: ₹{job.applicationFee}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Qualification: </span>
                    {job.qualification}
                  </div>
                  <div>
                    <span className="font-medium">Age Limit: </span>
                    {job.ageLimit}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Official Website: </span>
                    <button
                      onClick={() => handleVisitWebsite(job.officialWebsite)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit
                    </button>
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} results
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
                    if (e.key === 'Enter') {
                      const page = parseInt((e.target as HTMLInputElement).value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Page"]') as HTMLInputElement;
                    const page = parseInt(input.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                      input.value = '';
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
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                        pages.push('...');
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push(1);
                        pages.push('...');
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);
                        pages.push('...');
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      }
                    }
                    
                    return pages.map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-2 py-1 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No government jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};