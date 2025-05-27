import React from "react";
import { Shield, Home, ArrowLeft } from "lucide-react";

interface UnauthorizedProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onHomeClick?: () => void;
  onBackClick?: () => void;
}

const Unauthorized = ({
  title = "Access Denied",
  message = "You don't have permission to view this page. Please contact your administrator if you believe this is an error.",
  showHomeButton = true,
  showBackButton = true,
  onHomeClick,
  onBackClick,
}: UnauthorizedProps) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = "/";
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {showHomeButton && (
            <button
              onClick={handleHomeClick}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Go to Homepage
            </button>
          )}

          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="text-center mt-6">
        <p className="text-sm text-slate-500">
          Need help? Contact{" "}
          <a
            href="mailto:support@company.com"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            support@company.com
          </a>
        </p>
      </div> */}
    </div>
    // </div>
  );
};

export default Unauthorized;
