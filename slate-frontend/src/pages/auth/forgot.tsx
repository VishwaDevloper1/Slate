import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setResetLink("");

      if (!email.trim()) {
        setError("Email verification context address is required.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Enter a valid structured email verification string.");
        return;
      }

      setLoading(true);

      const response = await api.post("/forgot-password", {
        email,
      });

      setSuccess("Reset link generated successfully.");

      if (response.data.reset_link) {
        setResetLink(response.data.reset_link);
      }

    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Something went wrong in password recovery lifecycle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SECTION - EMAIL FORM DESK COMPONENT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 relative">
        
        {/* BACK TO LOGIN STEP ROUND TRIGGER PILL */}
        <div className="absolute top-8 left-6 sm:left-12">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] group select-none"
          >
            <span className="p-1 rounded-full bg-slate-50 group-hover:bg-red-100 text-slate-400 group-hover:text-red-600 transition-colors flex items-center justify-center">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            </span>
            Back
          </button>
        </div>

        <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200 mt-12 lg:mt-0">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Slate Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Reset Your Password
            </h1>
            <p className="text-base text-slate-400 font-medium mt-2">
              Enter your email address and we'll forward recovery link operations.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-base rounded-xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-emerald-600">{success}</p>
              </div>
            )}

            {resetLink && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono break-all text-slate-600 shadow-inner animate-in zoom-in-95 duration-150">
                <span className="block text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-1">Generated Endpoint Route</span>
                {resetLink}
              </div>
            )}

            {/* Send Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-4 font-bold text-base text-white transition-all shadow-lg ${
                loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              }`}
            >
              {loading ? "Generating Link..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login Anchor route text element */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm font-medium">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors ml-1"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - DISPLAY DECK INFOGRAPHICS */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-50 border-l border-slate-100 p-12">
        <div className="max-w-md text-center animate-in fade-in slide-in-from-right-6 duration-300">
          <img
            src="/forgot-password-image.png"
            alt="Forgot Password Illustration"
            className="w-full max-w-xs mx-auto mb-8 drop-shadow-sm"
          />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
            Lost Password?
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            No worries. We'll help you get back into your security management pipeline workspace quickly and securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;