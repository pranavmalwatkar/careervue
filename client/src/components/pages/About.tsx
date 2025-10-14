import React from 'react';
import { Users, Award, Target, Heart, Shield, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Careervue</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting talent with opportunity across government and private sectors since 2025
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We believe that everyone deserves access to meaningful career opportunities. 
              Our platform bridges the gap between talented individuals and employers, 
              creating a seamless job search experience that benefits everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Making job opportunities accessible to everyone, regardless of background or experience level.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600">
                Building trust through transparent processes and authentic job listings from verified employers.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Continuously improving our platform to provide the best job search experience possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Careervue stands out in the crowded job market with unique features designed 
              to serve both job seekers and employers effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Government & Private Sectors</h3>
                <p className="text-gray-600">
                  Unique platform that bridges both government and private sector opportunities, 
                  giving you access to the widest range of career options.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nationwide Coverage</h3>
                <p className="text-gray-600">
                  From local government positions to multinational corporations, 
                  we cover opportunities across all states and territories.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Matching</h3>
                <p className="text-gray-600">
                  Our advanced algorithm matches your skills, experience, and preferences 
                  with the most relevant job opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Support</h3>
                <p className="text-gray-600">
                  Dedicated career advisors and premium features help you stand out 
                  from the competition and land your dream job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals who are dedicated to transforming 
              the job search experience for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" 
                alt="Sarah Johnson" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-gray-600 mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-500">
                Former HR Director with 15 years of experience in talent acquisition across government and private sectors.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" 
                alt="Michael Chen" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-gray-600 mb-2">CTO</p>
              <p className="text-sm text-gray-500">
                Technology leader with expertise in building scalable platforms that connect millions of users worldwide.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" 
                alt="Emily Rodriguez" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-gray-600 mb-2">VP of Operations</p>
              <p className="text-sm text-gray-500">
                Operations expert focused on creating seamless user experiences and building strong employer partnerships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Be part of a platform that's changing how people find meaningful careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Find Jobs
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};