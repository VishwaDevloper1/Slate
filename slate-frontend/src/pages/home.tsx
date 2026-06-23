import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../layouts/header";
import { 
  Combine, 
  Scissors, 
  Minimize2, 
  RefreshCw, 
  ArrowUpRight,
  Heart,
  Quote,
  Zap,
  ShieldCheck,
  Smartphone,
  Building2
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  path: string;
  colorClass: string;
}

export default function Home() {
  const navigate = useNavigate();

  // Layout Viewport Fix: Enforces clean layout scaling constraints across production deployments
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      (meta as HTMLMetaElement).name = "viewport";
      (meta as HTMLMetaElement).content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
      document.getElementsByTagName("head")[0].appendChild(meta);
    } else {
      meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0");
    }
  }, []);

  const coreTools: FeatureCardProps[] = [
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF documents into a single organized file in your preferred sequence flawlessly.",
      icon: <Combine size={24} />,
      path: "/merge",
      colorClass: "group-hover:text-red-600 group-hover:bg-red-50 border-red-100"
    },
    {
      title: "Split PDF",
      desc: "Extract specific page ranges or separate every single page into independent PDF files instantly.",
      icon: <Scissors size={24} />,
      path: "/split",
      colorClass: "group-hover:text-orange-600 group-hover:bg-orange-50 border-orange-100"
    },
    {
      title: "Compress PDF",
      desc: "Dramatically downsample document sizes while perfectly retaining text formatting and clarity assets.",
      icon: <Minimize2 size={24} />,
      path: "/compress",
      colorClass: "group-hover:text-emerald-600 group-hover:bg-emerald-50 border-emerald-100"
    },
    {
      title: "Document Converter",
      desc: "Seamlessly convert Office documents, HTML, and images to PDF—or export PDFs back cleanly.",
      icon: <RefreshCw size={24} />,
      path: "/Convert",
      colorClass: "group-hover:text-blue-600 group-hover:bg-blue-50 border-blue-100"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col justify-between antialiased selection:bg-red-500 selection:text-white">
      <div className="w-full flex flex-col items-center">
        <Header />

        {/* HERO SECTION WITH DYNAMIC GRADIENTS */}
        <section className="max-w-5xl w-full text-center px-4 pt-24 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-full text-red-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm animate-pulse">
            <Zap size={12} className="fill-current" /> Next-Gen PDF Architecture
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-8">
            Simplify Your Documents. <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              Fast. Secure. Beautiful.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Slate completely reinvents client-side document streams. Experience highly responsive layout transformations with zero storage latency.
          </p>
        </section>

        {/* ULTRA-MODERN FEATURE TOOLS GRID */}
        <section className="max-w-5xl w-full px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {coreTools.map((tool, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(tool.path)}
              className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-slate-100 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

              <div className="flex gap-4 items-start">
                <div className={`p-3 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl transition-all duration-300 shrink-0 shadow-inner ${tool.colorClass}`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight transition-colors duration-200 group-hover:text-slate-900">
                    {tool.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end items-center text-xs font-bold text-slate-400 group-hover:text-red-600 transition-all duration-300 transform group-hover:translate-x-0.5">
                <span className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Launch Engine</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </section>

        {/* CINEMATIC FULL WIDTH MOTIVATION CONTAINER */}
        <section className="w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-24 px-6 mt-32 border-y border-slate-800/60 relative overflow-hidden flex justify-center">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl w-full text-center flex flex-col items-center gap-6 relative z-10">
            <div className="text-red-500 opacity-25 animate-pulse">
              <Quote size={56} className="fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] max-w-3xl bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              "Code shifts metrics, engineering structures layout pipelines, but ultimate tools grant professionals absolute autonomy."
            </h2>
            <div className="mt-6 flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-red-500" />
              <p className="text-xs uppercase font-bold tracking-widest text-red-500 font-mono">
                Philosophical Directive // Slate Engine Core
              </p>
              <div className="h-px w-8 bg-red-500" />
            </div>
          </div>
        </section>

        {/* 🧠 ZOOMED-IN HIGH READABILITY H-ROW CARD CONTAINER (FIXED FOR image_182eff.png) */}
        {/* Changed max-w-5xl to max-w-6xl for wider aspect framing and decreased gap to gap-8 to pull cards closer */}
        <section className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-36 mb-36 justify-items-center">
          
          {/* CARD 1 - WORK OFFLINE */}
          {/* Increased max-width to 350px and added base text sizing optimization updates */}
          <div className="max-w-[350px] w-full min-h-[500px] bg-white border border-slate-200/80 rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 group">
            {/* Increased height to h-56 for deeper floating block background aspect */}
            <div className="w-full h-56 bg-gradient-to-br from-red-50/40 to-rose-50/70 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute w-28 h-28 bg-red-500/5 rounded-full blur-xl -top-4 -right-4" />
              <div className="bg-white text-red-500 border border-red-100/60 p-5 rounded-3xl shadow-[0_10px_25px_rgba(239,68,68,0.08)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <ShieldCheck size={44} className="stroke-[1.5]" />
              </div>
            </div>
            {/* Typography scale increases for sharp close-up reading matrix */}
            <div className="p-8 flex-1 flex flex-col justify-between items-start text-left">
              <div>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight mb-3">Work offline with Desktop</h4>
                <p className="text-[20px] text-slate-500 font-semibold leading-relaxed">
                  Batch edit and manage documents locally, with no internet and no operational limits.
                </p>
              </div>
              <div className="w-full flex justify-end mt-6">
                <div className="text-slate-400 group-hover:text-red-600 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2 - ON-THE-GO MOBILE */}
          <div className="max-w-[350px] w-full min-h-[500px] bg-white border border-slate-200/80 rounded-[1.8rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 group">
            <div className="w-full h-56 bg-gradient-to-br from-orange-50/30 to-amber-50/60 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute w-28 h-28 bg-orange-500/5 rounded-full blur-xl -bottom-4 -left-4" />
              <div className="bg-white text-orange-500 border border-orange-100/60 p-5 rounded-3xl shadow-[0_10px_25px_rgba(249,115,22,0.08)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <Smartphone size={44} className="stroke-[1.5]" />
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between items-start text-left">
              <div>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight mb-3">On-the-go with Mobile</h4>
                <p className="text-[20px] text-slate-500 font-semibold leading-relaxed">
                  Your favorite tools, right in your pocket. Keep working on your dynamic projects anytime, anywhere.
                </p>
              </div>
              <div className="w-full flex justify-end mt-6">
                <div className="text-slate-400 group-hover:text-orange-600 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3 - BUILT FOR BUSINESS */}
          <div className="max-w-[350px] w-full min-h-[500px] bg-white border border-slate-200/80 rounded-[1.8rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 group">
            <div className="w-full h-56 bg-gradient-to-br from-emerald-50/30 to-teal-50/60 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute w-28 h-28 bg-emerald-500/5 rounded-full blur-xl top-2 left-6" />
              <div className="bg-white text-emerald-500 border border-emerald-100/60 p-5 rounded-3xl shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Building2 size={44} className="stroke-[1.5]" />
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between items-start text-left">
              <div>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight mb-3">Built for business</h4>
                <p className="text-[20px] text-slate-500 font-semibold leading-relaxed">
                  Automate document management tracking streams, onboard teams easily, and scale with flexible plans.
                </p>
              </div>
              <div className="w-full flex justify-end mt-6">
                <div className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* PREMIUM DARK/BLACK PRODUCTION FOOTER */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-10 px-4 mt-auto flex justify-center">
        <div className="max-w-5xl w-full flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-medium text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <img src="/Slate.png" alt="Slate Logo" className="h-6 w-auto opacity-100" />
            <div className="space-y-0.5">
              <span className="font-bold tracking-tight text-white block sm:inline mr-1">Slate App</span>
              <span className="text-slate-500">&copy; 2026. All conversion matrices securely compiled.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-6 text-slate-400">
              <Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-800/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
              Built with <Heart size={10} className="fill-current text-red-500 animate-pulse mx-0.5" /> for Engineers
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}