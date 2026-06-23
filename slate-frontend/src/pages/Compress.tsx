import { useState, useEffect } from 'react';
import Header from '../layouts/header';
import api from '../services/api'; 
import { Plus, X } from 'lucide-react'; // Aligned iconography profiles

type CompressionLevel = 'low' | 'medium' | 'high';

interface StagedCompressFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function Compress() {
  const [stagedFiles, setStagedFiles] = useState<StagedCompressFile[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Layout Fix: Aligned viewports to preserve design structure scale ratios across production mounts
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

  // Helper to format byte sizes cleanly into MB strings
  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Get total composite file structure sizes for metadata estimations
  const getTotalOriginalSize = () => {
    return stagedFiles.reduce((acc, curr) => acc + curr.size, 0);
  };

  // Dynamically calculate estimated savings based on historical downsampling metrics
  const getExpectedSize = (originalSize: number, level: CompressionLevel) => {
    switch (level) {
      case 'low':
        return originalSize * 0.75; // Est: 25% reduction
      case 'medium':
        return originalSize * 0.45; // Est: 55% reduction
      case 'high':
        return originalSize * 0.20; // Est: 80% reduction
      default:
        return originalSize;
    }
  };

  const handleCompressPdf = async () => {
    if (stagedFiles.length === 0) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("level", compressionLevel);
    
    // Stage array iterations straight into file parameters matching form formats
    stagedFiles.forEach((staged) => {
      formData.append("files", staged.file);
    });

    try {
      // Clean target routing completely abstracted from local networks via central instance
      const response = await api.post("/pdf/compress", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", 
      });

      // Handle dual-download extension allocations depending on configuration staging length
      const isMulti = stagedFiles.length > 1;
      const downloadExt = isMulti ? "zip" : "pdf";
      const contentType = isMulti ? "application/zip" : "application/pdf";

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = isMulti ? `compressed_archive.zip` : `compressed_${stagedFiles[0].name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      // Clear target workspace files cleanly on download success
      setStagedFiles([]);
      alert("PDF optimization and compression completed successfully!");

    } catch (error: any) {
      console.error("Compression failed:", error);
      const errorMessage = error?.response?.data?.detail || error?.message || "An unexpected error occurred while compressing your PDF workspace.";
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; // 👈 Enabled multi-document entry selection streams
    input.accept = '.pdf';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const selected = Array.from(target.files).map((file) => ({
          id: crypto.randomUUID(),
          file: file,
          name: file.name,
          size: file.size,
        }));
        setStagedFiles((prev) => [...prev, ...selected]);
      }
    };
    input.click();
  };

  return (
    <>
      <Header />

      {/* CENTERED LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <svg 
              className="animate-spin h-12 w-12 text-red-600 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xl font-bold text-slate-800">Compressing PDFs...</p>
            <p className="text-sm text-slate-400 mt-1">Optimizing structural elements</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative">
        
        {stagedFiles.length === 0 ? (
          <div className="flex flex-col items-center max-w-2xl w-full text-center transition-all animate-in fade-in duration-200">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Compress PDF files
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 font-normal mb-8 max-w-xl leading-relaxed">
              Reduce file sizes while optimizing for maximal remaining PDF quality standard profiles.
            </p>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerFilePicker}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
              >
                Select PDF files
              </button>

              <p className="text-xs text-slate-400 mt-4 font-medium">
                or drop PDFs here
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* LEFT OPTIONS PANEL */}
            <div className="w-full md:w-[320px] shrink-0 bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col self-start">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-slate-800">Total Selection</h3>
                <span className="text-xs font-bold bg-slate-200/70 text-slate-600 px-2.5 py-1 rounded-md">
                  {formatSize(getTotalOriginalSize())}
                </span>
              </div>

              {/* CONFIG LEVEL STACK */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Compression Level
                </label>

                {/* LOW COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('low')}
                  className={`p-3.5 bg-white rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'low' ? 'border-red-500 bg-red-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Low Optimization</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(getTotalOriginalSize(), 'low'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'low' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'low' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

                {/* MEDIUM COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('medium')}
                  className={`p-3.5 bg-white rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'medium' ? 'border-red-500 bg-red-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Balanced Strategy</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(getTotalOriginalSize(), 'medium'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'medium' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'medium' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

                {/* HIGH COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('high')}
                  className={`p-3.5 bg-white rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'high' ? 'border-red-500 bg-red-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Extreme Packing</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(getTotalOriginalSize(), 'high'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'high' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'high' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCompressPdf}
                disabled={isProcessing}
                className="w-full text-white font-semibold py-4 rounded-xl shadow-lg text-sm transition-all bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              >
                Compress Workspace Files
              </button>
            </div>

            {/* RIGHT WORKSPACE LIST */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Staged Documents</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Review sizes before executing batch downsampling operations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerFilePicker}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    <Plus size={14} /> Add Files
                  </button>
                  <button
                    type="button"
                    onClick={() => setStagedFiles([])}
                    className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* DYNAMIC SCROLL CONTAINER ROW GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1 pb-2">
                {stagedFiles.map((staged, index) => (
                  <div key={staged.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between relative shadow-sm hover:border-slate-300 transition-colors">
                    <button
                      type="button"
                      onClick={() => setStagedFiles((prev) => prev.filter((f) => f.id !== staged.id))}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="pr-5 pb-3">
                      <p className="text-xs font-bold text-slate-400 font-sans uppercase select-none tracking-wider mb-0.5">PDF DOCUMENT {index + 1}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate" title={staged.name}>{staged.name}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 mt-auto">
                      <span className="text-[10px] font-mono font-medium text-slate-400">{formatSize(staged.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}