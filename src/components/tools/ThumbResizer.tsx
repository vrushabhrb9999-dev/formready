/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ExamSpec } from "../../types";
import { Upload, Download, RefreshCw, LayoutGrid, CheckSquare } from "lucide-react";

interface ThumbResizerProps {
  activeSpec: ExamSpec | null;
}

export default function ThumbResizer({ activeSpec }: ThumbResizerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [width, setWidth] = useState<number>(240);
  const [height, setHeight] = useState<number>(240);
  const [targetKb, setTargetKb] = useState<number>(40);
  const [monochrome, setMonochrome] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(128); // Threshold setting for Monochrome filter

  const [processing, setProcessing] = useState<boolean>(false);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);

  useEffect(() => {
    if (activeSpec && activeSpec.thumb) {
      setWidth(activeSpec.thumb.widthPx);
      setHeight(activeSpec.thumb.heightPx);
      setTargetKb(activeSpec.thumb.maxKb);
    }
  }, [activeSpec]);

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

  const processFingerprint = () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw original onto signature canvas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Perform Monochrome Black and White binary thresholding
      if (monochrome) {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Gray value
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Threshold clamping
          const binary = gray > threshold ? 255 : 0;
          
          data[i] = binary;
          data[i + 1] = binary;
          data[i + 2] = binary;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Squeeze compression loops
      let minQ = 0.05;
      let maxQ = 0.99;
      let optimalQ = 0.85;
      let dataUrl = "";
      let currentSizeKb = 0;

      for (let i = 0; i < 10; i++) {
        dataUrl = canvas.toDataURL("image/jpeg", optimalQ);
        const head = dataUrl.indexOf(",") + 1;
        currentSizeKb = ((dataUrl.length - head) * 3) / 4 / 1024;

        if (currentSizeKb > targetKb) {
          maxQ = optimalQ;
          optimalQ = (optimalQ + minQ) / 2;
        } else {
          minQ = optimalQ;
          optimalQ = (optimalQ + maxQ) / 2;
          if (targetKb - currentSizeKb < 1) {
            break;
          }
        }
      }

      setResultSrc(dataUrl);
      setResultSizeKb(parseFloat(currentSizeKb.toFixed(1)));
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      processFingerprint();
    }
  }, [imageSrc, width, height, targetKb, monochrome, threshold]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_thumb_checked.jpg`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="thumb-resizer-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Thumb Impression Resizer & monochrome Binary</h2>
          <p className="text-xs text-slate-500">Prepare clean fingerprints with a 1-bit high-contrast black and white filter.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 transition-all relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="text-center space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop Thumb impression Scan</p>
              <p className="text-[10px] text-slate-400">Works with standard biometric sheets</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Impression Constraints</h3>

            {/* Scale Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Width</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 240)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Height</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 240)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Target KB size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Target Size</span>
                <span className="font-mono font-bold text-indigo-505 text-indigo-500">{targetKb} KB</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={targetKb}
                onChange={(e) => setTargetKb(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* B&W Mode toggle checkbox */}
            <div className="flex items-center justify-between border-t border-dashed border-slate-250 dark:border-slate-800 pt-3 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" /> Pure Black & White (Binary)
              </span>
              <input
                type="checkbox"
                checked={monochrome}
                onChange={(e) => setMonochrome(e.target.checked)}
                className="w-4 h-4 text-indigo-600 cursor-pointer"
              />
            </div>

            {/* Threshold Slider if B&W is on */}
            {monochrome && (
              <div className="space-y-1.5 border-t border-dashed border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Biometric Ridge Threshold</span>
                  <span className="font-mono font-bold text-emerald-505 text-emerald-500">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="220"
                  step="2"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[9px] text-slate-400 block leading-tight">Increase value to darken weak ink ridges, decrease value to remove shadows.</span>
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <span className="text-[10px] text-slate-400 font-mono flex items-center justify-between uppercase mb-2">
                <span>1-BIT BIOMETRIC PREVIEW</span>
                <span className="text-emerald-500 font-bold">{resultSizeKb} KB ({width}x{height} px)</span>
              </span>

              <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
                {processing ? (
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                ) : resultSrc ? (
                  <img src={resultSrc} alt="Preview monochrome fingerprint" className="max-h-full max-w-full object-contain border border-slate-200/50" />
                ) : (
                  <span className="text-xs text-slate-400 italic">Processing fingerprint...</span>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={processFingerprint}
                  className="flex-1 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Recalculate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Biometric
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/84 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload thumb scan to remove background shading and threshold fingerprint paths.</p>
              <p className="text-[10px] mt-1 text-slate-400">Ensures high biometric matching ratios.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
