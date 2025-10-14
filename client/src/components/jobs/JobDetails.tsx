import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, DollarSign, Building, Clock, Award, User, FileText, CreditCard } from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { Job } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onBack, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      setError('Failed to fetch job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setSubmitting(true);
    try {
      await applicationsAPI.applyForJob({
        jobId: job.id,
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume
      });
      
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The job you are looking for does not exist.'}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Jobs</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium text-center ${
                job.type === 'government' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {job.type === 'government' ? 'Government Position' : 'Private Sector'}
              </span>
              {job.isPremium && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center justify-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>Premium Job</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Salary</p>
                <p className="font-semibold">{formatSalary(job.salary.min, job.salary.max)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-semibold capitalize">{job.employmentType.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold">{job.experience}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-semibold">{formatDate(job.deadline)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
                <p className="text-gray-600">
                  {job.isPremium 
                    ? `This is a premium job posting. Application fee: $${job.applicationFee}`
                    : 'Free to apply - no application fee required'
                  }
                </p>
              </div>
              <button
                onClick={handleApplyClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {job.isPremium ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Apply Now (${job.applicationFee})</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Apply for {job.title}</h3>
              <p className="text-gray-600">at {job.company}</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    placeholder="Tell us why you're interested in this position..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to a server
                        setApplicationData({...applicationData, resume: file.name});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {job.isPremium && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Premium Application</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      This application requires a payment of ${job.applicationFee} to process.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {submitting ? 'Submitting...' : (job.isPremium ? 'Pay & Apply' : 'Submit Application')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};