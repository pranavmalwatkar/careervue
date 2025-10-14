import React, { useState, useEffect } from 'react';
import { Search, Users, Award, TrendingUp, ArrowRight, Briefcase, Shield, Globe, Building } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  // const { openChatbot } = useChatbot(); // Removed as per edit hint

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect <span className="text-blue-200">Career</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of job opportunities across government and private sectors. 
              Your dream career is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('government')}
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Government Jobs</span>
              </button>
              <button
                onClick={() => onNavigate('companies')}
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Building className="h-5 w-5" />
                <span>View Companies</span>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => onNavigate('cv-creator')}
                className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                Create Your CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </h3>
              <p className="text-gray-600">Active Job Listings</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={50000} suffix="+" />
              </h3>
              <p className="text-gray-600">Registered Users</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </h3>
              <p className="text-gray-600">Private Jobs</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Careervue?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect talented individuals with the best opportunities across all sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Government Jobs</h3>
              <p className="text-gray-600">
                Access exclusive government positions with competitive benefits and job security. 
                From federal to local opportunities.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Private Sector</h3>
              <p className="text-gray-600">
                Explore dynamic private sector roles with growth potential and competitive salaries 
                across various industries.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Growth</h3>
              <p className="text-gray-600">
                Get matched with opportunities that align with your skills and career goals. 
                Professional development resources included.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have found their dream jobs through Careervue
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};