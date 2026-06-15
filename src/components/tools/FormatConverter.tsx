/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Upload, Download, RefreshCw, RefreshCwIcon, ClipboardCheck } from "lucide-react";

export default function FormatConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [targetFormat, setTargetFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState<number>(0.95);
  const [converting, setConverting] = useState<boolean>(false);
  const [resultSrc, setResultSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setResultSrc(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFormat = () => {
    if (!imageSrc) return;
    setConverting(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw and export
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      setResultSrc(dataUrl);
      setConverting(false);
    };
  };

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_converted.${targetFormat === "jpeg" ? "jpg" : targetFormat}`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="format-converter-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Photo Format Converter</h2>
          <p className="text-xs text-slate-500">Fast batch or manual conversion across standard JPG, PNG, and high speed WEBP descriptors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 transition-all relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-400 w-8 h-8" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Image to Convert</p>
              <p className="text-[10px] text-slate-400 font-mono">Select any photography file</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Conversion Target formats</span>

            {/* Target Select buttons */}
            <div className="grid grid-cols-3 gap-2">
              {(["jpeg", "png", "webp"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    targetFormat === fmt
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-650"
                      : "bg-white border-slate-200 text-slate-705 dark:bg-slate-909 dark:border-slate-800 dark:text-slate-300"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quality control for Jpeg or Webp */}
            {targetFormat !== "png" && (
              <div className="space-y-1.5 pt-3 border-t border-dashed border-slate-250 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Target Scale Quality Factor</span>
                  <span className="font-mono font-bold text-indigo-500">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded accent-indigo-600 appearance-none cursor-pointer"
                />
              </div>
            )}

            <button
              onClick={convertFormat}
              disabled={!imageSrc}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Convert Format
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <span className="text-[10px] text-slate-400 font-mono block uppercase mb-2">OUTPUT CONVERSION CANOPY</span>

              <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 border rounded flex items-center justify-center p-3 relative overflow-hidden">
                {converting ? (
                  <RefreshCw className="w-5 h-5 text-indigo-505 animate-spin" />
                ) : resultSrc ? (
                  <img src={resultSrc} alt="Preview formatted output" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400 italic font-medium">Click Convert to view converted pixel streams</span>
                )}
              </div>

              {resultSrc && (
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Converted File ({targetFormat.toUpperCase()})
                </button>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/84 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload photography file to engage format mapping transformations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
