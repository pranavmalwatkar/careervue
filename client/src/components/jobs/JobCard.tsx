import React from 'react';
import { MapPin, Calendar, DollarSign, Building, Clock, Award } from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.type === 'government' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {job.type === 'government' ? 'Government' : 'Private'}
            </span>
            {job.isPremium && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span>Premium</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(job.salary.min, job.salary.max)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
          <button
            onClick={() => onViewDetails(job.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};