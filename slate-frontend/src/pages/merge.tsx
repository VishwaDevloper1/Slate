import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StagedFile } from '../types';
import Header from '../layouts/header';
import api from '../services/api';
import { Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// --- Drag and Drop Sortable Wrapper Card Component ---
function SortableCard({ staged, children }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: staged.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-40 scale-95 shadow-2xl' : ''}`}
    >
      {children(attributes, listeners)}
    </div>
  );
}

// --- Main Workspace Application Entrypoint ---
export default function Merge() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [merging, setMerging] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleMerge = async () => {
    if (stagedFiles.length < 2) {
      alert("Please select at least 2 PDF documents to proceed with merging.");
      return;
    }

    let createdUrl: string | null = null;

    try {
      setMerging(true);
      const formData = new FormData();

      stagedFiles.forEach((staged) => {
        formData.append("files", staged.file);
      });

      const response = await api.post("/merge", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      createdUrl = window.URL.createObjectURL(blob);

      // --- CRITICAL FIX: Trigger download FIRST before unmounting component ---
      const link = document.createElement("a");
      link.href = createdUrl;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      // --- Navigate to success view AFTER the download request triggers safely ---
      navigate("/merge-success", {
        state: { downloadUrl: createdUrl },
      });

    } catch (error) {
      console.error("Execution stack failure:", error);
      alert("Failed to merge target PDF files. Ensure documents are not password-protected.");
    } finally {
      setMerging(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setStagedFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const newFiles = Array.from(target.files).map((file) => ({
          id: crypto.randomUUID(),
          file: file,
          name: file.name,
          size: file.size,
          status: 'idle' as const,
          progress: 0,
        }));
        setStagedFiles((prev) => [...prev, ...newFiles]);
      }
    };
    input.click();
  };

  return (
    <>
      <Header />

      {/* FIXED PROCESSING AND PACKAGING OVERLAY LAYER */}
      {merging && (
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
            <p className="text-xl font-bold text-slate-800">Merging PDFs...</p>
            <p className="text-sm text-slate-400 mt-1">Assembling and packaging files</p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative">
        
        {stagedFiles.length === 0 ? (
          <div className="flex flex-col items-center max-w-2xl w-full text-center transition-all">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Merge PDF files
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 font-normal mb-8 max-w-xl leading-relaxed">
              Combine PDFs in the order you want with the easiest PDF merger available.
            </p>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerFilePicker}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] select-none tracking-wide"
              >
                Select PDF files
              </button>

              <p className="text-xs text-slate-400 mt-4 tracking-wide font-medium">
                or drop PDFs here
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Selected Files
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Drag files via handle markers to update compiling structure sequences.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerFilePicker}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
                >
                  <Plus size={16} />
                  Add PDF
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

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={stagedFiles.map((file) => file.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                  {stagedFiles.map((staged) => (
                    <SortableCard key={staged.id} staged={staged}>
                      {(attributes: any, listeners: any) => (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between min-h-[100px] shadow-sm relative group hover:border-slate-300 transition-colors">
                          
                          {/* Left Drag Handle Trigger Panel */}
                          <div
                            {...attributes}
                            {...listeners}
                            className="absolute top-3 left-3 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition"
                            title="Drag to reposition"
                          >
                            <GripVertical size={16} />
                          </div>

                          {/* Top Right Extraction Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setStagedFiles((prev) =>
                                prev.filter((file) => file.id !== staged.id)
                              )
                            }
                            className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
                          >
                            <X size={16} />
                          </button>

                          <div className="pt-6 pb-2">
                            <p className="text-sm font-semibold text-slate-800 truncate pl-1 pr-4" title={staged.name}>
                              {staged.name}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-auto border-t border-slate-200/60 pt-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-md">
                              FILE {stagedFiles.findIndex(f => f.id === staged.id) + 1}
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-medium">
                              {(staged.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>

                        </div>
                      )}
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              type="button"
              onClick={handleMerge}
              disabled={stagedFiles.length < 2 || merging}
              className={`w-full mt-6 text-white font-semibold py-4 rounded-xl shadow-lg text-base transition-all ${
                stagedFiles.length < 2 || merging
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/10 active:scale-[0.99]"
              }`}
            >
              {stagedFiles.length < 2 
                ? "Select at least 2 files to merge" 
                : "Merge PDFs"
              }
            </button>

          </div>
        )}
      </div>
    </>
  );
}