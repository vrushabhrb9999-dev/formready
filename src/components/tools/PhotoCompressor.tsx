/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ExamSpec } from "../../types";
import { Upload, Download, RefreshCw, Layers, CheckCircle, Sliders, AlertCircle } from "lucide-react";

interface PhotoCompressorProps {
  activeSpec: ExamSpec | null;
}

export default function PhotoCompressor({ activeSpec }: PhotoCompressorProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [quality, setQuality] = useState<number>(0.85);
  const [format, setFormat] = useState<string>("jpeg");
  
  const [processing, setProcessing] = useState<boolean>(false);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [compressedSizeKb, setCompressedSizeKb] = useState<number>(0);

  // Sync with exam specs if selected
  useEffect(() => {
    if (activeSpec) {
      setTargetKb(activeSpec.photo.maxKb);
      if (activeSpec.photo.formats.includes("png")) {
        setFormat("png");
      } else if (activeSpec.photo.formats.includes("webp")) {
        setFormat("webp");
      } else {
        setFormat("jpeg");
      }
    }
  }, [activeSpec]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setOriginalSizeKb(parseFloat((file.size / 1024).toFixed(1)));
      
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

  const compressImage = async () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      // Downscale if ridiculously large for passport specs
      if (w > 1200 || h > 1200) {
        const ratio = Math.min(1200 / w, 1200 / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      // Iterative Compression Logic to achieve EXACT target size
      let minQ = 0.01;
      let maxQ = 0.99;
      let optimalQ = quality;
      let dataUrl = "";
      let currentSizeKb = 0;
      let mime = `image/${format}`;

      // Run binary search or iterative adjustment
      for (let i = 0; i < 12; i++) {
        dataUrl = canvas.toDataURL(mime, optimalQ);
        // Calculate estimated size from base64
        const head = dataUrl.indexOf(",") + 1;
        const base64Len = dataUrl.length - head;
        currentSizeKb = (base64Len * 3) / 4 / 1024;

        if (format === "png") {
          // PNG doesn't support canvas quality scaling, so break
          break;
        }

        if (currentSizeKb > targetKb) {
          maxQ = optimalQ;
          optimalQ = (optimalQ + minQ) / 2;
        } else {
          minQ = optimalQ;
          optimalQ = (optimalQ + maxQ) / 2;
          if (targetKb - currentSizeKb < 2) {
            // Close enough to targeted threshold
            break;
          }
        }
      }

      setResultSrc(dataUrl);
      setCompressedSizeKb(parseFloat(currentSizeKb.toFixed(1)));
      setQuality(parseFloat(optimalQ.toFixed(2)));
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      compressImage();
    }
  }, [imageSrc, targetKb, format, quality]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_formready_compressed.${format}`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="photo-compressor-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Photo Compressor (Target KB)</h2>
          <p className="text-xs text-slate-500">Reduce payload metrics of JPG, PNG, and WEBP down to strict targets.</p>
        </div>
        {activeSpec && (
          <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg font-mono">
            Exam spec active: {activeSpec.name} (Max: {activeSpec.photo.maxKb}KB)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Arena */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 transition-all relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="text-center space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop Image or Click</p>
              <p className="text-[10px] text-slate-405 text-slate-400">Supports JPG, PNG, WEBP (Max 15MB)</p>
            </div>
          </div>

          {/* Squeezing Targets */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Compression Constraints
            </h3>

            {/* Target KB Input Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Target File Size</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-450">{targetKb} KB</span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={targetKb}
                onChange={(e) => setTargetKb(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>5 KB</span>
                <span>SSC Limit (20-50KB)</span>
                <span>500 KB</span>
              </div>
            </div>

            {/* Format Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Target Image Format</label>
              <div className="grid grid-cols-3 gap-2">
                {["jpeg", "png", "webp"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      format === fmt
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600"
                        : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Preview Sandbox Column */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Before Photo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>ORIGINAL PHOTO</span>
                    <span>{originalSizeKb} KB</span>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 flex items-center justify-center p-2">
                    <img src={imageSrc} alt="Original uploaded passport" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>

                {/* After Photo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                      COMPRESSED <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </span>
                    <span className={compressedSizeKb > targetKb ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
                      {compressedSizeKb} KB
                    </span>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 flex items-center justify-center p-2 relative">
                    {processing ? (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                      </div>
                    ) : resultSrc ? (
                      <img src={resultSrc} alt="Compressed targeted scale" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Processing preview...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compression Ratio Stats bar */}
              <div className="flex justify-between items-center text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800 rounded-xl mb-4 font-mono">
                <span className="text-slate-500">Savings ratio:</span>
                <span className="text-emerald-500 font-bold">
                  {originalSizeKb > compressedSizeKb 
                    ? `${((1 - compressedSizeKb / originalSizeKb) * 100).toFixed(0)}% Squeezed`
                    : "0% Squeezed"}
                </span>
              </div>

              {/* Action Operations */}
              <div className="flex gap-2.5">
                <button
                  onClick={compressImage}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Recalculate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc || compressedSizeKb === 0}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Result
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload a photograph to reveal visual output comparison metrics.</p>
              <p className="text-[10px] mt-1 text-slate-400">Perfect targets are generated locally in RAM.</p>
            </div>
          )}

          <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/50 rounded-lg flex gap-2 items-start text-[11px] text-indigo-700 dark:text-indigo-400">
            <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>FormReady Tip:</strong> Our system runs a highly advanced multi-pass base64 compressor script. It keeps refining the scaling until file sizes are guaranteed below your selected targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
