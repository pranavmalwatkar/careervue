import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { authAPI } from '../../services/api';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      
      // Store development info for testing
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      if (response.previewUrl) {
        setPreviewUrl(response.previewUrl);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    onNavigate('login');
  };

  const openPreviewUrl = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a password reset link to your email address.
            </p>
            
            {/* Development Information */}
            {(resetToken || previewUrl) && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 mb-3">
                  <strong>Development Information:</strong>
                </p>
                
                {previewUrl && (
                  <div className="mb-3">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Email Preview:</strong> Click the button below to view the email that was sent:
                    </p>
                    <button
                      onClick={openPreviewUrl}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Email Preview</span>
                    </button>
                  </div>
                )}
                
                {resetToken && (
                  <div>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Reset Token:</strong>
                    </p>
                    <p className="text-sm text-blue-700 mb-2 break-all font-mono bg-white p-2 rounded border border-blue-300">
                      {resetToken}
                    </p>
                    <p className="text-xs text-blue-600">
                      In production, this token would only be sent via email.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleBackToLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 