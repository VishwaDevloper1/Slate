import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
  
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill all mandatory profile tracking fields.");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      setLoading(true);
  
      await api.post("/signup", {
        username,
        email,
        password,
      });
  
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Registration pipeline initialization failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SECTION - PRODUCTIVE COMPILER SLIDESHOW BANNER */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-50 border-r border-slate-100 p-12">
        <div className="max-w-md text-center animate-in fade-in slide-in-from-left-6 duration-300">
          <img
            src="/auth-image.png"
            alt="PDF Tools Illustration"
            className="w-full max-w-xs mx-auto mb-8 drop-shadow-sm"
          />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
            PDF Tools for Productive People
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Merge, Split, Compress and Convert PDFs quickly and securely with industry standard automation engine.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION - INTERACTIVE SIGNUP ACTION CONTROL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 relative">
        
        {/* ROUND BACK TRIGGER COMPONENT */}
        <div className="absolute top-8 left-6 sm:left-12">
          <button
            type="button"
            onClick={() => navigate("/")}
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
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create Your Account
            </h1>
            <p className="text-base text-slate-400 font-medium mt-2">
              Start managing your PDFs today.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your full name"
                className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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

            {/* Terms and Agreements check line */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 accent-red-600"
              />
              <label htmlFor="terms" className="text-sm text-slate-500 font-medium select-none leading-normal">
                I agree to the{" "}
                <Link to="/terms" className="text-red-600 hover:text-red-700 underline font-semibold ml-0.5">Terms</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-red-600 hover:text-red-700 underline font-semibold">Privacy Policy</Link>
              </label>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}

            {/* Signup Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-4 font-bold text-base text-white transition-all shadow-lg ${
                loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Redirection link route */}
          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
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
    </div>
  );
};

export default Signup;