import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/usercontext";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      login(response.data.access_token);

      const meResponse = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      console.log(meResponse.data);
      setUser(meResponse.data);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE ILLUSTRATION PANEL */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-50 border-r border-slate-100 p-12">
        <div className="max-w-md text-center animate-in fade-in slide-in-from-left-6 duration-300">
          <img
            src="/auth-image.png"
            alt="PDF Management Illustration"
            className="w-full max-w-sm mx-auto mb-10 drop-shadow-sm"
          />

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Manage Your PDFs Effortlessly
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed">
            Merge, Split, Compress and Convert PDF files securely in seconds.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE AUTHENTICATION WORKSPACE CONTAINER */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 relative">
        
        {/* BACK TO DASHBOARD TRIGGER BUTTON */}
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
          
          {/* Brand Logo Display Area */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="transition-transform active:scale-95">
              <img
                src="/logo.png"
                alt="Slate Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="text-base text-slate-400 font-medium mt-2">
              Login to access your document management workspace.
            </p>
          </div>

          {/* Form Stack Submission Engine Context */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Address Block */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                disabled={loading}
                placeholder="name@example.com"
                className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Password Management Input Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="Enter security credentials"
                  className="w-full text-base rounded-xl border border-slate-200 px-4 py-4 pr-12 outline-none transition-all placeholder:text-slate-300 bg-white disabled:bg-slate-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Account Recovery Redirection Area */}
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Live Realtime Parsing Diagnostics Interface Error Box */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Submission Form Trigger Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-4 font-bold text-base text-white transition-all shadow-lg ${
                loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Core Registrations Redirection Routing Block */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;