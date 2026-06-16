import { useState } from 'react';
import Header from '../layouts/header';

type ConvertDirection = 'to_pdf' | 'from_pdf';
type ConvertFormat = 'jpg' | 'word' | 'powerpoint' | 'excel' | 'html' | 'pdf_a';

interface ConverterOption {
  id: ConvertFormat;
  label: string;
  desc: string;
  accept: string;
  outputExt: string;
}

export default function Convert() {
  const [direction, setDirection] = useState<ConvertDirection>('to_pdf');
  const [selectedFormat, setSelectedFormat] = useState<ConvertFormat>('jpg');
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Configuration Matrix for all converter options
  const toPdfOptions: ConverterOption[] = [
    { id: 'jpg', label: 'JPG to PDF', desc: 'Convert images into crisp PDF documents.', accept: '.jpg,.jpeg,.png', outputExt: 'pdf' },
    { id: 'word', label: 'WORD to PDF', desc: 'Make DOCX and DOC files easy to read by converting them to PDF.', accept: '.docx,.doc', outputExt: 'pdf' },
    { id: 'powerpoint', label: 'POWERPOINT to PDF', desc: 'Turn PPTX and PPT presentations into clear PDF slideshows.', accept: '.pptx,.ppt', outputExt: 'pdf' },
    { id: 'excel', label: 'EXCEL to PDF', desc: 'Convert XLS and XLSX spreadsheets into neat table PDFs.', accept: '.xlsx,.xls', outputExt: 'pdf' },
    { id: 'html', label: 'HTML to PDF', desc: 'Render webpages or raw HTML files into standalone PDF assets.', accept: '.html,.htm', outputExt: 'pdf' },
  ];

  const fromPdfOptions: ConverterOption[] = [
    { id: 'jpg', label: 'PDF to JPG', desc: 'Extract embedded images or convert document pages into separate JPG files.', accept: '.pdf', outputExt: 'zip' },
    { id: 'word', label: 'PDF to WORD', desc: 'Convert immutable text formatting back into editable DOCX streams.', accept: '.pdf', outputExt: 'docx' },
    { id: 'powerpoint', label: 'PDF to POWERPOINT', desc: 'Convert layout frames into editable PPTX slides.', accept: '.pdf', outputExt: 'pptx' },
    { id: 'excel', label: 'PDF to EXCEL', desc: 'Pull tables directly from structural coordinates into tabular spreadsheets.', accept: '.pdf', outputExt: 'xlsx' },
    { id: 'pdf_a', label: 'PDF to PDF/A', desc: 'Convert records into standardized ISO PDF/A compliance archives.', accept: '.pdf', outputExt: 'pdf' },
  ];

  const activeOptions = direction === 'to_pdf' ? toPdfOptions : fromPdfOptions;
  const currentSelection = activeOptions.find(o => o.id === selectedFormat) || activeOptions[0];

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = currentSelection.accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setTargetFile(target.files[0]);
      }
    };
    input.click();
  };

  const handleExecuteConversion = async () => {
    if (!targetFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", targetFile);
    formData.append("direction", direction);
    formData.append("format", selectedFormat);

    try {
      const response = await fetch("http://localhost:8000/pdf/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status code: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const originalName = targetFile.name.substring(0, targetFile.name.lastIndexOf('.')) || targetFile.name;
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${originalName}_converted.${currentSelection.outputExt}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Conversion pipeline broke:", error);
      alert(error?.message || "An unexpected error occurred during execution.");
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
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center border border-slate-100">
            <svg className="animate-spin h-12 w-12 text-red-600 mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xl font-bold text-slate-800">Converting File...</p>
            <p className="text-sm text-slate-400 mt-1">Reassembling document structure</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
        
        {/* LEFT COMPILER NAVIGATION CONTROLLER CARD */}
        <div className="w-full md:w-[340px] shrink-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm self-start">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Converter</h2>
          
          {/* DIRECTION SWITCHER SWITCH PILLS */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setDirection('to_pdf'); setSelectedFormat('jpg'); setTargetFile(null); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all ${direction === 'to_pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Convert to PDF
            </button>
            <button
              onClick={() => { setDirection('from_pdf'); setSelectedFormat('jpg'); setTargetFile(null); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all ${direction === 'from_pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Convert from PDF
            </button>
          </div>

          {/* ACTIVE OPTIONS CONTAINER SELECTOR GRID LIST */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Engine Profile</label>
            {activeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setSelectedFormat(opt.id); setTargetFile(null); }}
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

        {/* RIGHT FILE MANAGEMENT WORKSPACE CARD */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center items-center min-h-[450px]">
          {!targetFile ? (
            <div className="text-center max-w-md animate-in fade-in duration-150">
              <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v12m0 0l-4-4m4 4l4-4m0 6V4m0 11h8m-4-4h4m-4 8h4m-4-12h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{currentSelection.label} Workspace</h3>
              <p className="text-slate-400 text-sm mb-6">Upload files matching rules: <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-xs">{currentSelection.accept}</code></p>
              
              <button
                onClick={handleTriggerFilePicker}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-600/10 active:scale-[0.98] transition-all"
              >
                Select Target Document
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-between items-center animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl max-w-md w-full flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-red-500 text-white font-bold p-3 rounded-xl text-xs uppercase tracking-wider select-none shrink-0">
                    {targetFile.name.split('.').pop() || 'FILE'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate" title={targetFile.name}>{targetFile.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{(targetFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setTargetFile(null)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50/50 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-12 text-center max-w-sm w-full">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 px-1">
                  <span>Engine Selected</span>
                  <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md font-bold">{currentSelection.label}</span>
                </div>
                <button
                  onClick={handleExecuteConversion}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl shadow-xl shadow-red-600/10 transition-all active:scale-[0.99]"
                >
                  Run Document Conversion
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}