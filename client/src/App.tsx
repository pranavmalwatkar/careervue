import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { Dashboard } from './components/pages/Dashboard';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';
import { JobList } from './components/jobs/JobList';
import { JobDetails } from './components/jobs/JobDetails';
import { CompanyDirectory } from './components/companies/CompanyDirectory';
import { GovernmentJobs } from './components/government/GovernmentJobs';
import { CVCreator } from './components/cv/CVCreator';
import AssistantWidget from './components/common/AssistantWidget';
import { AdminApp } from './components/admin/AdminApp';

type Page = 'home' | 'jobs' | 'companies' | 'government' | 'cv-creator' | 'about' | 'contact' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'dashboard' | 'job-details' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Check for reset password token in URL and admin authentication on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setCurrentPage('reset-password');
      return;
    }

    // Check for admin token and redirect to admin panel if present
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken && !window.location.pathname.includes('/admin')) {
      setCurrentPage('admin');
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleViewJobDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage('job-details');
  };

  const handleBackToJobs = () => {
    setCurrentPage('jobs');
    setSelectedJobId(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobList onViewDetails={handleViewJobDetails} />;
      case 'companies':
        return <CompanyDirectory />;
      case 'government':
        return <GovernmentJobs />;
      case 'cv-creator':
        return <CVCreator />;
      case 'job-details':
        return selectedJobId ? (
          <JobDetails 
            jobId={selectedJobId}
            onBack={handleBackToJobs}
            onNavigate={handleNavigate}
          />
        ) : (
          <JobList onViewDetails={handleViewJobDetails} />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'reset-password':
        return <ResetPassword onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminApp />;
      default:
        return <JobList onViewDetails={handleViewJobDetails} />;
    }
  };

  return (
    <AuthProvider>
      <ChatbotProvider>
        {currentPage === 'admin' ? (
          renderPage()
        ) : (
          <div className="min-h-screen flex flex-col">
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
            <main className="flex-grow">
              {renderPage()}
            </main>
            <Footer />
            <AssistantWidget />
          </div>
        )}
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;