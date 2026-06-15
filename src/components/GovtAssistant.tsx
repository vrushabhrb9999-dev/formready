/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { EXAM_SPECS } from "../data/exams";
import { ExamSpec, ActiveTab } from "../types";
import { Award, CheckCircle2, Sliders, ArrowRight, UserCheck, Edit3, Image, FileOutput } from "lucide-react";

interface AssistantProps {
  onSelectSpec: (spec: ExamSpec, toolType: ActiveTab) => void;
  currentActiveSpec: ExamSpec | null;
}

export default function GovtAssistant({ onSelectSpec, currentActiveSpec }: AssistantProps) {
  const [selectedSpecId, setSelectedSpecId] = useState(EXAM_SPECS[0].id);
  const [customSpecName, setCustomSpecName] = useState("");
  const [customWidth, setCustomWidth] = useState("350");
  const [customHeight, setCustomHeight] = useState("450");
  const [customMinKb, setCustomMinKb] = useState("20");
  const [customMaxKb, setCustomMaxKb] = useState("50");

  const currentSpec = EXAM_SPECS.find(s => s.id === selectedSpecId) || EXAM_SPECS[0];

  const handleApplyPreset = (tool: ActiveTab) => {
    onSelectSpec(currentSpec, tool);
  };

  const handleApplyCustom = (tool: ActiveTab) => {
    const virtualSpec: ExamSpec = {
      id: "custom-virtual",
      name: customSpecName || "Custom Registered Target",
      category: "Others",
      photo: {
        widthPx: parseInt(customWidth) || 350,
        heightPx: parseInt(customHeight) || 450,
        minKb: parseInt(customMinKb) || 20,
        maxKb: parseInt(customMaxKb) || 50,
        formats: ["jpg", "jpeg"]
      },
      signature: {
        widthPx: parseInt(customWidth) || 140,
        heightPx: parseInt(customHeight) || 60,
        minKb: parseInt(customMinKb) || 10,
        maxKb: parseInt(customMaxKb) || 20,
        formats: ["jpg", "jpeg"]
      }
    };
    onSelectSpec(virtualSpec, tool);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8" id="govt-assistant">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Government Form Assistant</h2>
          <p className="text-xs text-slate-500">Pick an exam or input dimensions to preconnect all tool limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Presets List */}
        <div className="lg:col-span-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Select Exam Portal</label>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {EXAM_SPECS.map(spec => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecId(spec.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                  selectedSpecId === spec.id
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                <span>{spec.name}</span>
                {selectedSpecId === spec.id && <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Or Configure Custom Spec</h4>
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <input
                type="text"
                placeholder="Form / Exam Name (optional)"
                value={customSpecName}
                onChange={e => setCustomSpecName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">WidthPx</span>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={e => setCustomWidth(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">HeightPx</span>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={e => setCustomHeight(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Min KB</span>
                  <input
                    type="number"
                    value={customMinKb}
                    onChange={e => setCustomMinKb(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Max KB</span>
                  <input
                    type="number"
                    value={customMaxKb}
                    onChange={e => setCustomMaxKb(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                  />
                </div>
              </div>
              <button
                onClick={() => handleApplyCustom("photo-compressor")}
                className="w-full text-[10px] py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold rounded border border-indigo-100 dark:border-indigo-900 flex items-center justify-center gap-1 cursor-pointer"
              >
                Apply Custom Photo <Sliders className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected SPEC Specifications Display */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                {currentSpec.category} Official Guidelines
              </span>
              {currentActiveSpec?.id === currentSpec.id && (
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  Active Spec Activated
                </span>
              )}
            </div>
            <h3 className="text-base font-black text-slate-800 dark:text-slate-200 mb-4">{currentSpec.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Requirements */}
              <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  <span>Photograph Spec</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Dimensions:</strong> {currentSpec.photo.widthPx ? `${currentSpec.photo.widthPx} x ${currentSpec.photo.heightPx} px` : ""}
                  {currentSpec.photo.widthMm ? ` (${currentSpec.photo.widthMm} x ${currentSpec.photo.heightMm} mm)` : ""}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Size range:</strong> {currentSpec.photo.minKb}KB - {currentSpec.photo.maxKb}KB
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Formats:</strong> {currentSpec.photo.formats.join(", ").toUpperCase()}
                </p>
                {currentSpec.photo.description && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-tight italic pt-1 border-t border-dashed border-slate-100 dark:border-slate-800/60 mt-1">
                    *{currentSpec.photo.description}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => handleApplyPreset("photo-compressor")}
                    className="w-full text-[10px] py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-opacity-90 font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Configure Compressor <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Signature Requirements */}
              <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                  <Edit3 className="w-4 h-4 text-emerald-500" />
                  <span>Signature Spec</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Dimensions:</strong> {currentSpec.signature.widthPx ? `${currentSpec.signature.widthPx} x ${currentSpec.signature.heightPx} px` : ""}
                  {currentSpec.signature.widthMm ? ` (${currentSpec.signature.widthMm} x ${currentSpec.signature.heightMm} mm)` : ""}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Size range:</strong> {currentSpec.signature.minKb}KB - {currentSpec.signature.maxKb}KB
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-500">Formats:</strong> {currentSpec.signature.formats.join(", ").toUpperCase()}
                </p>
                {currentSpec.signature.description && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-tight italic pt-1 border-t border-dashed border-slate-100 dark:border-slate-800/60 mt-1">
                    *{currentSpec.signature.description}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => handleApplyPreset("signature-resizer")}
                    className="w-full text-[10px] py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    Configure Signature Resizer <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumb Impression Requirements if applicable */}
            {currentSpec.thumb && (
              <div className="mt-4 p-3.5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-950 rounded-xl flex items-center justify-between gap-3 text-xs text-teal-800 dark:text-teal-400">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-teal-600" />
                  <div>
                    <span className="font-bold block">Left Thumb Spec Included:</span>
                    <span>{currentSpec.thumb.widthPx}x{currentSpec.thumb.widthPx} px, Max {currentSpec.thumb.maxKb}KB</span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyPreset("thumb-resizer")}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-[10px] cursor-pointer"
                >
                  Configure Thumb Resizer
                </button>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-tight mt-4 text-center">
            🔒 Fully encrypted client performance. Selected parameters will guide tool constraints automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
