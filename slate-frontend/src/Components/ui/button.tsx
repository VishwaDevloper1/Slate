import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="inline-flex items-center gap-3 text-slate-600 hover:text-red-600 font-bold text-base bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] group select-none self-start"
    >
      {/* Round Arrow Icon Wrapper with micro-animation hover effect */}
      <span className="p-1 rounded-full bg-slate-50 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors flex items-center justify-center">
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
      </span>
      Back to Dashboard
    </button>
  );
}