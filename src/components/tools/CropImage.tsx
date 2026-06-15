/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, Crop, RefreshCw, Type } from "lucide-react";

export default function CropImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [aspect, setAspect] = useState<string>("1:1");
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 200, h: 200 });
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setCroppedSrc(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAspectChange = (ratio: string) => {
    setAspect(ratio);
    if (!imageSrc) return;

    let w = 200;
    let h = 200;
    if (ratio === "3:4") {
      w = 180; h = 240;
    } else if (ratio === "4:3") {
      w = 240; h = 180;
    } else if (ratio === "16:9") {
      w = 280; h = 157;
    } else if (ratio === "ssc") {
      w = 175; h = 225; // 3.5cm x 4.5cm representation scaling
    }

    setCropBox({ x: 20, y: 20, w, h });
  };

  const executeCrop = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropBox.w;
      canvas.height = cropBox.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Calculate translation scaling based on parent container offsets
      const scaleX = img.naturalWidth / 400; // assuming visual scaled display is 400px wide
      const scaleY = img.naturalHeight / 400;

      const sourceX = cropBox.x * scaleX;
      const sourceY = cropBox.y * scaleY;
      const sourceW = cropBox.w * scaleX;
      const sourceH = cropBox.h * scaleY;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, cropBox.w, cropBox.h);
      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, cropBox.w, cropBox.h);

      setCroppedSrc(canvas.toDataURL("image/jpeg"));
    };
  };

  // Adjust crop selector points
  const handleCropShift = (axis: "x" | "y" | "w" | "h", change: number) => {
    setCropBox((prev) => {
      const val = prev[axis] + change;
      return {
        ...prev,
        [axis]: Math.max(5, val)
      };
    });
  };

  const handleDownload = () => {
    if (!croppedSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_cropped.jpg`;
    link.href = croppedSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="cropping-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Crop Image Tool</h2>
          <p className="text-xs text-slate-500">Fine tune picture borders and focus area sizes with dynamic alignment grids.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 transition-all relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-400 w-8 h-8" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Image File</p>
              <p className="text-[10px] text-slate-400">Load photo for profile cropping</p>
            </div>
          </div>

          {/* Aspect Ratios list */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Aspect Presets</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "1:1 Square", val: "1:1" },
                { label: "3:4 Passport", val: "3:4" },
                { label: "3.5:4.5 SSC", val: "ssc" },
                { label: "4:3 Landscape", val: "4:3" },
                { label: "16:9 Banner", val: "16:9" },
              ].map((it) => (
                <button
                  key={it.val}
                  onClick={() => handleAspectChange(it.val)}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                    aspect === it.val
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-650"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800"
                  }`}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>

          {/* Precision shift controls */}
          {imageSrc && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Micro-Crop Precision Shift</span>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleCropShift("x", -10)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-750">Shift Left</button>
                <button onClick={() => handleCropShift("x", 10)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-750">Shift Right</button>
                <button onClick={() => handleCropShift("y", -10)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-755">Shift Up</button>
                <button onClick={() => handleCropShift("y", 10)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-755">Shift Down</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => handleCropShift("w", 15)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-750">Enlarge Scope</button>
                <button onClick={() => handleCropShift("w", -15)} className="p-1 text-[10px] font-bold rounded bg-white dark:bg-slate-900 border text-slate-750 font-sans">Shrink Scope</button>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Cropper Box overlay */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono block">ALIGN ALIGNMENT MASK</span>
                  <div className="w-[300px] h-[300px] bg-slate-250 bg-slate-100 dark:bg-slate-900 rounded border relative overflow-hidden mx-auto">
                    <img src={imageSrc} className="w-full h-full object-cover opacity-60 absolute" alt="Cropper target" />
                    
                    {/* Floating Crop Box overlay representing crop zone */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${(cropBox.x / 400) * 300}px`,
                        top: `${(cropBox.y / 400) * 300}px`,
                        width: `${(cropBox.w / 400) * 300}px`,
                        height: `${(cropBox.h / 400) * 300}px`,
                        border: "2px solid #5551FF",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)"
                      }}
                      className="cursor-move z-10 flex flex-col justify-between"
                    >
                      {/* Grid lines inside Cropper */}
                      <div className="flex-1 border-b border-indigo-400 border-dashed border-opacity-50 flex">
                        <div className="flex-1 border-r border-indigo-400 border-dashed border-opacity-50"></div>
                        <div className="flex-1 border-r border-indigo-400 border-dashed border-opacity-50"></div>
                      </div>
                      <div className="flex-1 border-b border-indigo-400 border-dashed border-opacity-50 flex animate-pulse">
                        <div className="flex-1 border-r border-indigo-400 border-dashed border-opacity-50"></div>
                        <div className="flex-1 border-r border-indigo-400 border-dashed border-opacity-50"></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={executeCrop}
                    className="w-full mt-2.5 py-2 bg-indigo-600 hover:bg-indigo-505 bg-indigo-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Crop Selected Area
                  </button>
                </div>

                {/* Rendered Cropped output */}
                <div className="space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">CROPPED PREVIEW</span>
                    <div className="aspect-square bg-slate-20 bg-slate-100 dark:bg-slate-900 border rounded flex items-center justify-center p-3">
                      {croppedSrc ? (
                        <img src={croppedSrc} alt="Preview cropped output result" className="max-h-full max-w-full" />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Click Crop to view result</span>
                      )}
                    </div>
                  </div>

                  {croppedSrc && (
                    <button
                      onClick={handleDownload}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-505 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Download Crop File
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/85 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload profile photograph to display cropping overlays.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
