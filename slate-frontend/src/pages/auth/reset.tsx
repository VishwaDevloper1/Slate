import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      const token = searchParams.get("token");

      if (!token) {
        setError("Invalid or expired password reset link.");
        return;
      }

      if (!password || !confirmPassword) {
        setError("All security credential fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);

      await api.post("/reset", {
        token,
        password,
      });

      setSuccess("Password reset successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Something went wrong while applying credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SECTION - CREATION WORKSPACE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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
              Create New Password
            </h1>
            <p className="text-base text-slate-400 font-medium mt-2">
              Enter a strong new password for your account.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* New Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  placeholder="Enter new password"
                  className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 pr-12 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={loading}
                  placeholder="Confirm new password"
                  className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 pr-12 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Diagnostic Logs Messages Status Boxes */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}

            {error === "" && success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-emerald-600">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-4 font-bold text-base text-white transition-all shadow-lg ${
                loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              }`}
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>
             
          {/* Back to Login Interface */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link
              to="/login"
              className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - COMPACT PANEL BRAND TRADEMARK */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-50 border-l border-slate-100 p-12">
        <div className="max-w-md text-center animate-in fade-in slide-in-from-right-6 duration-300">
          <img
            src="/reset-password-image.png"
            alt="Reset Password Illustration"
            className="w-full max-w-xs mx-auto mb-8 drop-shadow-sm"
          />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
            Secure Your Account
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Choose a strong password that you haven't used before to keep your files and account data safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;