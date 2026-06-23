import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import { useState, useEffect } from "react";
import Header from "../layouts/header";
import { Document, Page } from "react-pdf";
import api from "../services/api"; // 👈 Integrated centralized Axios gateway

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

console.log("PDFJS Version:", pdfjs.version);
console.log("Worker:", pdfjs.GlobalWorkerOptions.workerSrc);

export default function Split() {
  const [mode, setMode] = useState<"range" | "extract">("range");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Layout Viewport Fix: Enforces clean production scaling configurations on Vercel
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

  // Toggle page selection inside Extract Pages mode
  const handlePageClick = (pageNumber: number) => {
    if (mode !== "extract") return;
    
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  // Process Handler matching your working Merge lifecycle strategies
  const handleProcessPdf = async () => {
    if (!pdfFile) return;

    let createdUrl: string | null = null;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", pdfFile);

      let urlPath = "";

      if (mode === "range") {
        if (startPage < 1 || endPage > numPages || startPage > endPage) {
          throw new Error("Invalid page range specified.");
        }
        formData.append("start_page", startPage.toString());
        formData.append("end_page", endPage.toString());
        urlPath = "/pdf/split/range";
      } else {
        if (selectedPages.length === 0) {
          throw new Error("Please select at least one page to extract.");
        }
        formData.append("pages", selectedPages.join(","));
        urlPath = "/pdf/split/extract";
      }

      // Swapped out raw fetch for your optimized central API wrapper
      const response = await api.post(urlPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // 👈 Vital to intercept raw binary downloads cleanly
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      createdUrl = window.URL.createObjectURL(blob);

      // DOM Node Insertion Anchor Fix: Triggers download directly inside the active layout context
      const link = document.createElement("a");
      link.href = createdUrl;
      link.download = mode === "range" ? "split_range.pdf" : "extracted_pages.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Reset application file context clean down state inline post-download loop
      setPdfFile(null);
      setSelectedPages([]);
      alert("PDF document split processed successfully!");

    } catch (error: any) {
      console.error("Processing failure caught:", error);
      const message = error?.response?.data?.detail || error?.message || "An unexpected processing error occurred.";
      alert(message);
    } finally {
      setIsProcessing(false);
      if (createdUrl) {
        window.URL.revokeObjectURL(createdUrl);
      }
    }
  };

  // Determine pagination lists for dynamic content matching inside the preview grid
  const rangeLength = Math.max(0, endPage - startPage + 1);
  const previewPages = mode === "range"
    ? Array.from({ length: rangeLength }, (_, i) => startPage + i).filter(p => p <= numPages && p >= 1)
    : Array.from({ length: numPages }, (_, i) => i + 1);

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
            <p className="text-xl font-bold text-slate-800">Processing PDF...</p>
            <p className="text-sm text-slate-400 mt-1">Please do not close this window</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative">
        {!pdfFile ? (
          <div className="flex flex-col items-center max-w-2xl w-full text-center transition-all animate-in fade-in duration-200">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Split PDF File
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-normal mb-8 max-w-xl leading-relaxed">
              Separate one page or a whole set for easy conversion into independent PDF files.
            </p>

            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf";

                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files && target.files[0]) {
                    setPdfFile(target.files[0]);
                  }
                };
                input.click();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] select-none tracking-wide"
            >
              Select PDF File
            </button>

            <p className="mt-4 text-slate-400 font-medium text-xs tracking-wide">
              or drop PDF here
            </p>
          </div>
        ) : (
          <div className="w-full max-w-7xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* LEFT SIDEBAR PANEL */}
            <div className="w-full md:w-[320px] shrink-0 bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col self-start">
              <h2 className="font-bold text-lg text-slate-800 mb-4">Split Options</h2>

              <div className="space-y-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => setMode("range")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    mode === "range"
                      ? "bg-red-50 border border-red-500 text-red-600"
                      : "bg-white border border-slate-200 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  Split by Range
                </button>

                <button
                  type="button"
                  onClick={() => setMode("extract")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    mode === "extract"
                      ? "bg-red-50 border border-red-500 text-red-600"
                      : "bg-white border border-slate-200 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  Extract Pages
                </button>
              </div>

              {/* CONDITIONAL CONTROLS */}
              <div className="border-t border-slate-200/80 pt-4 mt-1">
                {mode === "range" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Start Page
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={numPages || undefined}
                        value={startPage}
                        onChange={(e) => setStartPage(Math.max(1, Number(e.target.value)))}
                        className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        End Page
                      </label>
                      <input
                        type="number"
                        min={startPage}
                        max={numPages || undefined}
                        value={endPage}
                        onChange={(e) => setEndPage(Math.max(startPage, Number(e.target.value)))}
                        className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-inner-sm">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Pages Counter</span>
                    <span className="text-3xl font-black text-slate-800 mt-1 block">
                      {selectedPages.length}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium leading-normal">
                      Click directly on the canvas page frames to toggle extract options.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleProcessPdf}
                disabled={isProcessing}
                className={`w-full mt-6 text-white font-semibold py-4 rounded-xl shadow-lg text-sm transition-all ${
                  isProcessing 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
                }`}
              >
                {mode === "range" ? "Split PDF" : "Extract Selected Pages"}
              </button>
            </div>

            {/* RIGHT PREVIEW WORKSPACE */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {mode === "range" ? "Range Canvas Preview" : "All Pages Interactive View"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium truncate max-w-md mt-0.5" title={pdfFile.name}>
                    {pdfFile.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null);
                    setSelectedPages([]);
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  Change PDF
                </button>
              </div>

              <div className="w-full flex justify-center bg-slate-50 rounded-xl p-4 min-h-[400px] max-h-[60vh] overflow-y-auto border border-slate-100">
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setStartPage(1);
                    setEndPage(numPages);
                  }}
                  onLoadError={(error) => {
                    console.error("PDF ERROR:", error);
                    alert("Failed to load layout rendering structures.");
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2 pr-1">
                    {previewPages.map((pageNumber) => {
                      const isSelected = selectedPages.includes(pageNumber);
                      return (
                        <div
                          key={pageNumber}
                          onClick={() => handlePageClick(pageNumber)}
                          className={`transition-all duration-150 rounded-xl p-2 bg-white flex flex-col items-center border-2 shadow-sm select-none ${
                            mode === "extract" 
                              ? "cursor-pointer hover:scale-[1.02] hover:border-slate-300" 
                              : "cursor-default"
                          } ${
                            mode === "extract" && isSelected
                              ? "border-red-500 bg-red-50/20"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="pointer-events-none max-w-full overflow-hidden rounded-lg border border-slate-100 shadow-sm">
                            <Page
                              pageNumber={pageNumber}
                              width={150}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </div>

                          <p className="text-center text-[11px] font-bold mt-2.5 px-3 py-0.5 rounded-full text-slate-500 bg-slate-100 border border-slate-200/40">
                            PAGE {pageNumber}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Document>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}