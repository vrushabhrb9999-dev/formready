/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ExamSpec } from "../../types";
import { Upload, Download, RefreshCw, Eye, Sparkles, Sliders } from "lucide-react";

interface SignatureResizerProps {
  activeSpec: ExamSpec | null;
}

export default function SignatureResizer({ activeSpec }: SignatureResizerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [width, setWidth] = useState<number>(140);
  const [height, setHeight] = useState<number>(60);
  const [targetKb, setTargetKb] = useState<number>(15);
  const [contrastBoost, setContrastBoost] = useState<number>(30); // High contrast to clean grayscale scan background

  const [processing, setProcessing] = useState<boolean>(false);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);

  useEffect(() => {
    if (activeSpec) {
      setWidth(activeSpec.signature.widthPx || 140);
      setHeight(activeSpec.signature.heightPx || 60);
      setTargetKb(activeSpec.signature.maxKb || 20);
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

  const processSignature = () => {
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

      // Contrast amplification for clear signature scan
      // This wipes paper wrinkles / shadows to pure white (#FFF)
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const factor = (259 * (contrastBoost + 255)) / (255 * (259 - contrastBoost));

      for (let i = 0; i < data.length; i += 4) {
        // Red, Green, Blue
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;

        // If pixel is close to white, make it pure white to clear scanning noise
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg > 200) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Iterative Compression target for signature (JPG/JPEG format limits)
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
      processSignature();
    }
  }, [imageSrc, width, height, targetKb, contrastBoost]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_sign.jpg`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="signature-resizer-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Signature Resizer & Cleaner</h2>
          <p className="text-xs text-slate-500">Auto-clean scanned pen signature background to pure white while targeting exact KB metrics.</p>
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
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop Signature Scan</p>
              <p className="text-[10px] text-slate-400">Supports JPEG, PNG uploads</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-505 text-indigo-500" /> Signature Filters
            </h3>

            {/* Dimension Target Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Width (px)</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 140)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Height (px)</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 60)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Target size in KB */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Target Size</span>
                <span className="font-mono font-bold text-indigo-500">{targetKb} KB</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={targetKb}
                onChange={(e) => setTargetKb(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Contrast Boost Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Ink Contrast & Paper Clearer</span>
                <span className="font-mono font-bold text-emerald-500">+{contrastBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={contrastBoost}
                onChange={(e) => setContrastBoost(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[9px] text-slate-400 block leading-tight">Increases ink darkness and clears paper gray/shadow colors.</span>
            </div>
          </div>
        </div>

        {/* Output Viewport */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <span className="text-[10px] text-slate-400 font-mono flex items-center justify-between uppercase mb-2">
                <span>SCANNED CONTRAST PREVIEW</span>
                <span className="text-emerald-500 font-bold">{resultSizeKb} KB ({width}x{height} px)</span>
              </span>

              {/* Box showing cropped landscape signature */}
              <div className="w-full min-h-36 py-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-center relative overflow-hidden">
                {processing ? (
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                ) : resultSrc ? (
                  <img src={resultSrc} alt="Preview processed signature scan" className="border border-slate-200 shadow-sm max-h-24 max-w-full" />
                ) : (
                  <span className="text-xs text-slate-405">Preparing signature pixels...</span>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={processSignature}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded cursor-pointer"
                >
                  Recalculate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-505 hover:bg-emerald-550 text-white text-[11px] font-bold rounded flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Signature
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/83 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload signature scan to clean paper noise and target exact KB limits.</p>
              <p className="text-[10px] mt-1 text-slate-400">Works 100% locally on HTML5 canvas buffers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
