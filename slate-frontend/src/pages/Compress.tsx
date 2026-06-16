import { useState } from 'react';
import Header from '../layouts/header';

type CompressionLevel = 'low' | 'medium' | 'high';

export default function Compress() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Helper to format byte sizes cleanly into MB strings
  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
    if (!pdfFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("level", compressionLevel);

    try {
      const response = await fetch("http://localhost:8000/pdf/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Compression failed:", error);
      alert(error?.message || "An unexpected error occurred while compressing your PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setPdfFile(target.files[0]);
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
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center border border-slate-100">
            <svg 
              className="animate-spin h-12 w-12 text-red-600 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xl font-bold text-slate-800">Compressing PDF...</p>
            <p className="text-sm text-slate-400 mt-1">Optimizing data structures</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative">
        
        {!pdfFile ? (
          <div className="flex flex-col items-center max-w-2xl w-full text-center transition-all">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Compress PDF file
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 font-normal mb-8 max-w-xl leading-relaxed">
              Reduce file size while optimizing for maximal remaining PDF quality standard profiles.
            </p>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerFilePicker}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
              >
                Select PDF file
              </button>

              <p className="text-xs text-slate-400 mt-4 font-medium">
                or drop PDF here
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Target Document
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500 truncate max-w-[200px]" title={pdfFile.name}>
                    {pdfFile.name}
                  </p>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    Current: {formatSize(pdfFile.size)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg transition"
              >
                Change File
              </button>
            </div>

            {/* COMPRESSION LEVEL SELECTION CONFIGURATION BOX */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Select Compression Level & Estimates
              </label>

              <div className="grid grid-cols-1 gap-3">
                
                {/* LOW COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('low')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'low' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Low Compression</p>
                    <p className="text-xs text-slate-400">High image quality, smaller file adjustment.</p>
                    <p className="text-xs font-medium text-slate-500 pt-1">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(pdfFile.size, 'low'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'low' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'low' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

                {/* MEDIUM COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('medium')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'medium' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Medium Compression</p>
                    <p className="text-xs text-slate-400">Recommended balance between clarity and storage size.</p>
                    <p className="text-xs font-medium text-slate-500 pt-1">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(pdfFile.size, 'medium'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'medium' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'medium' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

                {/* HIGH COMPRESSION */}
                <div 
                  onClick={() => setCompressionLevel('high')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    compressionLevel === 'high' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Extreme Compression</p>
                    <p className="text-xs text-slate-400">Maximal compaction, degrades visual resolution assets.</p>
                    <p className="text-xs font-medium text-slate-500 pt-1">
                      Expected size: <span className="text-emerald-600 font-semibold">~{formatSize(getExpectedSize(pdfFile.size, 'high'))}</span>
                    </p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'high' ? 'border-red-500' : 'border-slate-300'}`}>
                    {compressionLevel === 'high' && <div className="h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={handleCompressPdf}
              disabled={isProcessing}
              className="w-full text-white font-semibold py-4 rounded-xl shadow-lg text-base transition-all bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
            >
              Compress PDF
            </button>

          </div>
        )}
      </div>
    </>
  );
}