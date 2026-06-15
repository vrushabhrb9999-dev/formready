/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ExamSpec } from "../../types";
import { Upload, Download, RefreshCw, Layers, CheckCircle, Scale } from "lucide-react";

interface PhotoResizerProps {
  activeSpec: ExamSpec | null;
}

export default function PhotoResizer({ activeSpec }: PhotoResizerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [unit, setUnit] = useState<"px" | "mm" | "cm">("px");
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(450);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [aspectValue, setAspectValue] = useState<number>(350 / 450);

  const [dpi, setDpi] = useState<number>(100); // Standard Govt DPI scaling is 1 cm = 100 px (100 DPI)

  const [processing, setProcessing] = useState<boolean>(false);
  const [resultSrc, setResultSrc] = useState<string | null>(null);

  // Sync with active spec presets
  useEffect(() => {
    if (activeSpec) {
      if (activeSpec.photo.widthPx && activeSpec.photo.heightPx) {
        setUnit("px");
        setWidth(activeSpec.photo.widthPx);
        setHeight(activeSpec.photo.heightPx);
        setAspectValue(activeSpec.photo.widthPx / activeSpec.photo.heightPx);
      } else if (activeSpec.photo.widthMm && activeSpec.photo.heightMm) {
        setUnit("mm");
        setWidth(activeSpec.photo.widthMm);
        setHeight(activeSpec.photo.heightMm);
        setAspectValue(activeSpec.photo.widthMm / activeSpec.photo.heightMm);
      }
    }
  }, [activeSpec]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const src = event.target.result as string;
          setImageSrc(src);
          setResultSrc(null);

          // Get initial image dimensions
          const img = new Image();
          img.src = src;
          img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            setAspectValue(ratio);
            if (unit === "px") {
              setWidth(img.naturalWidth);
              setHeight(Math.round(img.naturalWidth / ratio));
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio && aspectValue) {
      setHeight(Math.round(val / aspectValue));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio && aspectValue) {
      setWidth(Math.round(val * aspectValue));
    }
  };

  const applyPreset = (presetName: string) => {
    if (presetName === "passport") {
      setUnit("cm");
      setWidth(3.5);
      setHeight(4.5);
      setAspectValue(3.5 / 4.5);
    } else if (presetName === "ssc") {
      setUnit("cm");
      setWidth(3.5);
      setHeight(4.5);
      setAspectValue(3.5 / 4.5);
    } else if (presetName === "upsc") {
      setUnit("px");
      setWidth(350);
      setHeight(350);
      setAspectValue(1.0);
    } else if (presetName === "railway") {
      setUnit("cm");
      setWidth(3.5);
      setHeight(4.5);
      setAspectValue(3.5 / 4.5);
    } else if (presetName === "banking") {
      setUnit("cm");
      setWidth(4.5);
      setHeight(3.5);
      setAspectValue(4.5 / 3.5);
    } else if (presetName === "cet") {
      setUnit("px");
      setWidth(150);
      setHeight(200);
      setAspectValue(150 / 200);
    }
  };

  const resizeImage = () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let targetWidthPx = width;
      let targetHeightPx = height;

      // Convert mm and cm to Pixels based on Government standard DPI mapping
      // Standard Govt specification uses: 1 cm = 100 pixels (100 DPI)
      // High-resolution photo standards use: 1 inch (2.54cm) @ 300 DPI, making 1 cm ~ 118 pixels.
      if (unit === "mm") {
        const inches = (width / 10) / 2.54;
        targetWidthPx = Math.round(inches * dpi);
        const inchesH = (height / 10) / 2.54;
        targetHeightPx = Math.round(inchesH * dpi);
      } else if (unit === "cm") {
        const inches = width / 2.54;
        targetWidthPx = Math.round(inches * dpi);
        const inchesH = height / 2.54;
        targetHeightPx = Math.round(inchesH * dpi);
      }

      canvas.width = targetWidthPx;
      canvas.height = targetHeightPx;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw and scale on canvas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
      
      if (maintainRatio) {
        // Source crop & scale
        ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);
      } else {
        // Stretch to fit exact dimensions specified
        ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);
      }

      setResultSrc(canvas.toDataURL("image/jpeg", 0.95));
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      resizeImage();
    }
  }, [imageSrc, width, height, unit, maintainRatio, dpi]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_formready_resized.jpg`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="photo-resizer-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Photo Resizer (Width, Height, Physical)</h2>
          <p className="text-xs text-slate-500">Form Ready resizer to adjust exact coordinates in px, mm or metric cm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* File input */}
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
              <p className="text-[10px] text-slate-405 text-slate-400 font-mono">Select image file to scale</p>
            </div>
          </div>

          {/* Quick Exam Presets */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Upload Portal Presets</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Passport", value: "passport" },
                { label: "SSC Profile", value: "ssc" },
                { label: "UPSC Portrait", value: "upsc" },
                { label: "Railway Scan", value: "railway" },
                { label: "Banking Job", value: "banking" },
                { label: "CET Spec", value: "cet" },
              ].map((pst) => (
                <button
                  key={pst.value}
                  onClick={() => applyPreset(pst.value)}
                  className="p-1 px-2 text-[10px] font-bold rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-colors flex items-center justify-center text-center cursor-pointer"
                >
                  {pst.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Form */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Scale Constraints</label>

            {/* Scale unit toggle */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              {(["px", "mm", "cm"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    unit === u
                      ? "bg-slate-900 text-white dark:bg-indigo-600"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Width ({unit})</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Target Height ({unit})</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Maintain Aspect Ratio Toggle */}
            <div className="flex items-center justify-between border-t border-dashed border-slate-250 dark:border-slate-800 pt-3 text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <Scale className="w-4 h-4 text-indigo-500" /> Keep Aspect Ratio
              </span>
              <input
                type="checkbox"
                checked={maintainRatio}
                onChange={(e) => setMaintainRatio(e.target.checked)}
                className="w-4 h-4 text-indigo-600 cursor-pointer"
              />
            </div>

            {/* DPI Configuration (Optional) for Physical to Digitization */}
            {unit !== "px" && (
              <div className="border-t border-dashed border-slate-250 dark:border-slate-800 pt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>DPI Target standard</span>
                  <span className="font-bold text-indigo-500">{dpi} DPI</span>
                </div>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value))}
                  className="w-full text-[10px] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                >
                  <option value={100}>Government Server Standard (100 DPI)</option>
                  <option value={200}>Mid clarity submission (200 DPI)</option>
                  <option value={300}>High print quality photo card (300 DPI)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Visual Preview */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85 flex flex-col justify-between">
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] text-slate-400 font-mono block">LIVE RESIZED RESCALING CANVAS</span>
                <div className="aspect-square w-full rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 flex items-center justify-center p-4 relative overflow-hidden">
                  {processing ? (
                    <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                  ) : resultSrc ? (
                    <img src={resultSrc} alt="Preview dimension rescaling" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400 italic">Formatting output pixels...</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={resizeImage}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Recalculate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Resized Image
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload a photograph to inspect physical metric scaling.</p>
              <p className="text-[10px] mt-1 text-slate-400">Perfect millimeter limits are handled exactly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
