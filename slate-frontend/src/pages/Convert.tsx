import { useState, useEffect } from 'react';
import Header from '../layouts/header';
import api from '../services/api'; // Abstracted Centralized Axios Gateway
import { Plus, X, FileText } from 'lucide-react';

type ConvertDirection = 'to_pdf' | 'from_pdf';
type ConvertFormat = 'jpg' | 'word' | 'powerpoint' | 'excel' | 'html' | 'pdf_a';

interface ConverterOption {
  id: ConvertFormat;
  label: string;
  desc: string;
  accept: string;
  outputExt: string;
}

interface StagedConvertFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function Convert() {
  const [direction, setDirection] = useState<ConvertDirection>('to_pdf');
  const [selectedFormat, setSelectedFormat] = useState<ConvertFormat>('jpg');
  const [stagedFiles, setStagedFiles] = useState<StagedConvertFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  const toPdfOptions: ConverterOption[] = [
    { id: 'jpg', label: 'JPG to PDF', desc: 'Convert multiple images into a combined PDF document.', accept: '.jpg,.jpeg,.png', outputExt: 'pdf' },
    { id: 'word', label: 'WORD to PDF', desc: 'Convert document formatting files to PDF.', accept: '.docx,.doc', outputExt: 'pdf' },
    { id: 'powerpoint', label: 'POWERPOINT to PDF', desc: 'Turn presentations into clear PDF layouts.', accept: '.pptx,.ppt', outputExt: 'pdf' },
    { id: 'excel', label: 'EXCEL to PDF', desc: 'Convert tabular worksheets into neat table PDFs.', accept: '.xlsx,.xls', outputExt: 'pdf' },
    { id: 'html', label: 'HTML to PDF', desc: 'Render HTML pages into clean PDF documents.', accept: '.html,.htm', outputExt: 'pdf' },
  ];

  const fromPdfOptions: ConverterOption[] = [
    { id: 'jpg', label: 'PDF to JPG', desc: 'Convert your PDF document into an archive of separate images.', accept: '.pdf', outputExt: 'zip' },
    { id: 'word', label: 'PDF to WORD', desc: 'Convert layout text back into editable document formats.', accept: '.pdf', outputExt: 'docx' },
    { id: 'powerpoint', label: 'PDF to POWERPOINT', desc: 'Convert structured frames into editable slides.', accept: '.pdf', outputExt: 'pptx' },
    { id: 'excel', label: 'PDF to EXCEL', desc: 'Pull structural data coordinate arrays into spreadsheets.', accept: '.pdf', outputExt: 'xlsx' },
    { id: 'pdf_a', label: 'PDF to PDF/A', desc: 'Convert records into ISO standardized compliance archives.', accept: '.pdf', outputExt: 'pdf' },
  ];

  const activeOptions = direction === 'to_pdf' ? toPdfOptions : fromPdfOptions;
  const currentSelection = activeOptions.find(o => o.id === selectedFormat) || activeOptions[0];

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; 
    input.accept = currentSelection.accept;
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

  const handleExecuteConversion = async () => {
    if (stagedFiles.length === 0) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("direction", direction);
    formData.append("format", selectedFormat);

    stagedFiles.forEach((staged) => {
      formData.append("files", staged.file);
    });

    try {
      const response = await api.post("/pdf/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", 
      });

      const contentTypeString = String(response.headers["content-type"] || "application/octet-stream");
      const blob = new Blob([response.data], { type: contentTypeString });
      const url = window.URL.createObjectURL(blob);
      
      const originalName = stagedFiles[0].name.substring(0, stagedFiles[0].name.lastIndexOf('.')) || "document";
      const filename = stagedFiles.length > 1 
        ? `converted_collection.${currentSelection.outputExt}`
        : `${originalName}_converted.${currentSelection.outputExt}`;
      
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      setStagedFiles([]);
      alert("Document conversion pipeline executed successfully!");

    } catch (error: any) {
      console.error("Conversion pipeline broke:", error);
      const message = error?.response?.data?.detail || error?.message || "An unexpected error occurred during execution.";
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />

      {/* PROCESSING LAYOVER SCREEN */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <svg className="animate-spin h-12 w-12 text-red-600 mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xl font-bold text-slate-800">Converting Files...</p>
            <p className="text-sm text-slate-400 mt-1">Reassembling conversion streams</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* LEFT NAV PANEL CARD */}
        <div className="w-full md:w-[340px] shrink-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm self-start">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Converter</h2>
          
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setDirection('to_pdf'); setSelectedFormat('jpg'); setStagedFiles([]); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all ${direction === 'to_pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Convert to PDF
            </button>
            <button
              onClick={() => { setDirection('from_pdf'); setSelectedFormat('jpg'); setStagedFiles([]); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all ${direction === 'from_pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Convert from PDF
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Engine Profile</label>
            {activeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setSelectedFormat(opt.id); setStagedFiles([]); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border font-medium flex flex-col ${
                  selectedFormat === opt.id ? 'bg-red-50 text-red-600 border-red-500 font-semibold' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-xs mt-0.5 font-normal ${selectedFormat === opt.id ? 'text-red-500/80' : 'text-slate-400'}`}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT WORKSPACE CARD */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[500px]">
          {stagedFiles.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto animate-in fade-in duration-150">
              <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v12m0 0l-4-4m4 4l4-4m0 6V4m0 11h8m-4-4h4m-4 8h4m-4-12h4" />
                </svg>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">{currentSelection.label} Workspace</h3>
              <p className="text-slate-400 text-base mb-8">Upload files matching: <code className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-sm">{currentSelection.accept}</code></p>
              
              <button
                onClick={handleTriggerFilePicker}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg shadow-red-600/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Select Target Documents
              </button>
            </div>
          ) : (
            <div className="w-full flex-1 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-200">
              
              {/* STAGED WORKSPACE LIST HEADER */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Staged Files Choice</h3>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">Ready to dispatch to unified API pipeline.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerFilePicker}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Files
                  </button>
                  <button
                    type="button"
                    onClick={() => setStagedFiles([])}
                    className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* GRID DISPATCH CONTAINER COMPONENT */}
              {/* Changed grid layout to display larger, zoomed cards (grid-cols-1 or sm:grid-cols-2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-h-[55vh] overflow-y-auto pr-1 pb-4">
                {stagedFiles.map((staged, idx) => (
                  <div key={staged.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between relative shadow-sm hover:border-slate-300 transition-all hover:shadow-md">
                    <button
                      type="button"
                      onClick={() => setStagedFiles((prev) => prev.filter((f) => f.id !== staged.id))}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="pr-6 pb-4 flex gap-4 items-start">
                      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-inner text-red-500 shrink-0">
                        <FileText size={28} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">FILE {idx + 1}</p>
                        <p className="text-base font-bold text-slate-800 truncate" title={staged.name}>{staged.name}</p>
                        <p className="text-xs font-mono font-semibold text-slate-400 mt-1">{(staged.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center bg-white/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Staged Ready</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUBMIT SECTION GATE CONTROL */}
              <div className="mt-8 pt-6 border-t border-slate-100 max-w-md w-full mx-auto">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 px-1">
                  <span>Engine Selected</span>
                  <span className="text-red-500 bg-red-50 px-3 py-1 rounded-md font-extrabold text-sm">{currentSelection.label}</span>
                </div>
                <button
                  onClick={handleExecuteConversion}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-4 rounded-xl shadow-xl shadow-red-600/10 transition-all active:scale-[0.99] cursor-pointer"
                >
                  Run Batch Document Conversion
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </>
  );
}