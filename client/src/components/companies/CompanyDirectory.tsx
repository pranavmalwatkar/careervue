import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Building, MapPin, Users, Calendar } from 'lucide-react';
import { indianCompanies, sectors } from '../../data/companies';
import { Company } from '../../types';
import { Pagination } from '../common/Pagination';

export const CompanyDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredCompanies = indianCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All Sectors' || company.sector === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSector]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the company list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewCareers = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Company Directory</h1>
        <p className="text-gray-600">Explore career opportunities at top Indian companies</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name..."
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
            <span>Filter by Sector</span>
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Company Directory Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Private Company Career Links</h2>
        </div>
        <div className="hidden md:grid md:grid-cols-4 gap-4 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">SR NO</span>
            <span>COMPANY NAME</span>
          </div>
          <div className="text-center">OFFICIAL WEBSITE</div>
          <div className="text-center">CAREER LINK</div>
          <div className="text-center">DETAILS</div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} companies
        </p>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {filteredCompanies.filter(c => c.sector === 'Government').length} Government • {' '}
            {filteredCompanies.filter(c => c.sector !== 'Government').length} Private
          </span>
        </div>
      </div>

      {/* Company List */}
      <div className="space-y-4">
        {currentCompanies.map((company, index) => (
          <div key={company.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Company Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {startIndex + index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.sector === 'Government' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {company.sector}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Official Website */}
                <div className="text-center">
                  <button
                    onClick={() => handleVisitWebsite(company.officialWebsite)}
                    className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Visit Website</span>
                  </button>
                </div>

                {/* Career Link */}
                <div className="text-center">
                  <button
                    onClick={() => handleViewCareers(company.careerLink)}
                    className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <Building className="h-4 w-4" />
                    <span>View Careers</span>
                  </button>
                </div>

                {/* Company Details */}
                <div className="text-center md:text-left">
                  <div className="space-y-1 text-sm text-gray-600">
                    {company.headquarters && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{company.headquarters}</span>
                      </div>
                    )}
                    {company.employees && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{company.employees} employees</span>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Founded {company.founded}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Description */}
              {company.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">{company.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredCompanies.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          {/* Results Summary and Page Navigation - All in One Line */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              {/* Results Summary */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} results
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
    </div>
  );
};