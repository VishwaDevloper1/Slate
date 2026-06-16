import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import { useState } from "react";
import Header from "../layouts/header";
import { Document, Page } from "react-pdf";

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

  // Toggle page selection inside Extract Pages mode
  const handlePageClick = (pageNumber: number) => {
    if (mode !== "extract") return;
    
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  // Shared function to trigger safe backend requests and download files
  const handleProcessPdf = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    let endpoint = "";

    try {
      if (mode === "range") {
        if (startPage < 1 || endPage > numPages || startPage > endPage) {
          throw new Error("Invalid page range specified.");
        }
        formData.append("start_page", startPage.toString());
        formData.append("end_page", endPage.toString());
        endpoint = "http://localhost:8000/pdf/split/range";
      } else {
        if (selectedPages.length === 0) {
          throw new Error("Please select at least one page to extract.");
        }
        formData.append("pages", selectedPages.join(","));
        endpoint = "http://localhost:8000/pdf/split/extract";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = mode === "range" ? "split_range.pdf" : "extracted_pages.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Processing failed:", error);
      alert(error?.message || "An unexpected error occurred while processing the PDF.");
    } finally {
      setIsProcessing(false);
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
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center">
            <svg 
              className="animate-spin h-12 w-12 text-red-600 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xl font-semibold text-slate-800">Processing PDF...</p>
            <p className="text-sm text-slate-500 mt-1">Please do not close this window</p>
          </div>
        </div>
      )}

      {!pdfFile ? (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Split PDF File
          </h1>

          <p className="text-xl text-slate-500 text-center max-w-2xl mb-8">
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
            className="bg-red-600 hover:bg-red-700 text-white text-2xl font-semibold px-12 py-5 rounded-2xl shadow-xl transition"
          >
            Select PDF File
          </button>

          <p className="mt-4 text-slate-400">
            or drop PDF here
          </p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mt-8 px-4 pb-12">

          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[320px] shrink-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm self-start">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Split PDF
            </h2>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setMode("range")}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                  mode === "range"
                    ? "bg-red-50 border border-red-500 text-red-600"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Split by Range
              </button>

              <button
                type="button"
                onClick={() => setMode("extract")}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                  mode === "extract"
                    ? "bg-red-50 border border-red-500 text-red-600"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Extract Pages
              </button>
            </div>

            {/* CONDITIONAL CONTROLS */}
            <div className="border-t border-slate-200 pt-6">
              {mode === "range" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={numPages || undefined}
                      value={startPage}
                      onChange={(e) => setStartPage(Math.max(1, Number(e.target.value)))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Page
                    </label>
                    <input
                      type="number"
                      min={startPage}
                      max={numPages || undefined}
                      value={endPage}
                      onChange={(e) => setEndPage(Math.max(startPage, Number(e.target.value)))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="block text-sm font-medium text-slate-500">Selected Pages Counter</span>
                  <span className="text-3xl font-bold text-slate-800 mt-1 block">
                    {selectedPages.length}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">
                    Click directly on the preview panels to toggle compilation choices.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleProcessPdf}
              disabled={isProcessing}
              className={`w-full mt-8 text-white py-4 rounded-xl font-semibold transition ${
                isProcessing 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/10"
              }`}
            >
              {mode === "range" ? "Split PDF" : "Extract Selected Pages"}
            </button>
          </div>

          {/* RIGHT PREVIEW AREA */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {mode === "range" ? "Range Preview" : "All Pages Preview"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {pdfFile.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setPdfFile(null);
                  setSelectedPages([]);
                }}
                className="text-red-500 hover:text-red-600 font-medium transition"
              >
                Change PDF
              </button>
            </div>

            <div className="w-full flex justify-center bg-slate-50 rounded-xl p-4 min-h-[400px] max-h-[75vh] overflow-y-auto">
              <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setStartPage(1);
                  setEndPage(numPages);
                }}
                onLoadError={(error) => {
                  console.error("PDF ERROR:", error);
                  alert("Failed to load PDF file preview.");
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {previewPages.map((pageNumber) => {
                    const isSelected = selectedPages.includes(pageNumber);
                    return (
                      <div
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`transition-all duration-150 rounded-xl p-2 bg-white flex flex-col items-center border-2 shadow-sm ${
                          mode === "extract" 
                            ? "cursor-pointer hover:scale-[1.02]" 
                            : "cursor-default"
                        } ${
                          mode === "extract" && isSelected
                            ? "border-red-500 bg-red-50/40"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="pointer-events-none max-w-full overflow-hidden rounded-lg">
                          <Page
                            pageNumber={pageNumber}
                            width={160}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </div>

                        {/* HIDE BOTTOM STRING LABELS IN EXTRACT MODE TO PREVENT DUPLICATION */}
                        {mode !== "extract" && (
                          <p className="text-center text-sm font-medium mt-2 px-3 py-0.5 rounded-full text-slate-600 bg-slate-100">
                            Page {pageNumber}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Document>
            </div>

          </div>
        </div>
      )}
    </>
  );
}