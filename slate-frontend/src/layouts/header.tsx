import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/usercontext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "MERGE PDF", href: "/merge" },
    { name: "SPLIT PDF", href: "/split" },
    { name: "COMPRESS PDF", href: "/compress" },
    { name: "CONVERT PDF", href: "/convert" },
  ];

  return (
    // ✅ FIXED: Changed classes to enforce strict global execution stacking ('sticky top-0 left-0 right-0 z-[100]')
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 left-0 right-0 z-[100] shadow-sm font-sans backdrop-blur-md bg-white/95">
      {/* Height bumped to h-24 for a grander, less cramped "zoomed-in" visual scale */}
      <div className="h-24 px-6 sm:px-8 lg:px-12 flex items-center justify-between max-w-7xl mx-auto relative">
        
        {/* LEFT BRANDING & NAVIGATION LINKS */}
        <div className="flex items-center gap-12">
          <Link to="/" className="shrink-0 transition-transform active:scale-95 block">
            <img
              src="/Slate.png" // ✅ FIXED: Stripped path prefix to clear browser asset mapping issues
              alt="Slate Logo"
              className="h-11 w-auto sm:h-12 object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-2 self-stretch h-24">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base tracking-wider font-bold px-5 flex items-center h-full relative transition-colors group ${
                    isActive 
                      ? "text-red-600" 
                      : "text-slate-600 hover:text-red-500"
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-5 right-5 h-1 bg-red-600 rounded-t-full transition-all duration-200 ${
                    isActive ? "scale-100 opacity-100" : "scale-75 opacity-0 group-hover:opacity-50 group-hover:scale-90"
                  }`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SECURITY & UTILITY PROFILE ACTIONS */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="scale-110 origin-right">
                <ProfileDropdown />
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* Tablet & Desktop Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-800 bg-white hover:bg-slate-50 font-bold text-base px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98]"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-3 rounded-xl shadow-lg shadow-red-600/10 transition-all active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Hamburger Icon Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          )}
        </div>

        {/* MOBILE COMPACT RESPONSIVE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col py-4 px-5 space-y-2 max-w-7xl mx-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-5 py-4 text-base font-bold rounded-xl transition-all tracking-wide ${
                      isActive 
                        ? "bg-red-50 text-red-600 shadow-sm" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-red-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Auth Buttons for Mobile viewport overlay layout */}
              {!isLoggedIn && (
                <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col md:hidden gap-3 pb-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center border border-slate-200 bg-white text-slate-800 text-base font-bold py-3.5 rounded-xl hover:bg-slate-50 transition shadow-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center bg-red-600 text-white text-base font-bold py-3.5 rounded-xl shadow-md shadow-red-600/5 hover:bg-red-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}