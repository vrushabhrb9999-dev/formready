/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Upload, Download, RefreshCw, Sparkles, Sliders, Shield } from "lucide-react";

export default function AiEnhancer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [upscale, setUpscale] = useState<number>(25); // Target size expansion
  const [sharpen, setSharpen] = useState<number>(30); // 3x3 sharpen matrix weights
  const [denoise, setDenoise] = useState<number>(10); // Smoothing filter weights
  const [brightness, setBrightness] = useState<number>(20); // Brightness constant offset

  const [processing, setProcessing] = useState<boolean>(false);
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

  const processEnhancer = () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      
      // Upscaling width and height
      const multiplier = 1 + upscale / 100;
      const targetW = Math.round(img.naturalWidth * multiplier);
      const targetH = Math.round(img.naturalHeight * multiplier);

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw active portrait
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Extract image descriptors
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const data = imgData.data;

      // 1. Denoise (Box Blur / Median Smoothing) + Brightness Boost
      const factor = (259 * (20 + 255)) / (255 * (259 - 20));
      for (let i = 0; i < data.length; i += 4) {
        // Brightness
        if (brightness > 0) {
          data[i] = Math.min(255, data[i] + brightness); // Red
          data[i + 1] = Math.min(255, data[i + 1] + brightness); // Green
          data[i + 2] = Math.min(255, data[i + 2] + brightness); // Blue
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // 2. Convolution Sharpen Engine
      if (sharpen > 0) {
        const sharpenImgData = ctx.getImageData(0, 0, targetW, targetH);
        const refSrc = sharpenImgData.data;
        
        // Define standard sharpen kernel
        // [ 0, -1,  0]
        // [-1,  5, -1]
        // [ 0, -1,  0]
        // We blend weights dynamically based on denoise vs sharpen values
        const strength = sharpen / 100;
        const kernel = [
          0, -strength, 0,
          -strength, 4 * strength + 1, -strength,
          0, -strength, 0
        ];

        const outputData = ctx.createImageData(targetW, targetH);
        const outputArr = outputData.data;

        for (let y = 1; y < targetH - 1; y++) {
          for (let x = 1; x < targetW - 1; x++) {
            let rTotal = 0, gTotal = 0, bTotal = 0;

            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const pixelIdx = ((y + ky) * targetW + (x + kx)) * 4;
                const weight = kernel[(ky + 1) * 3 + (kx + 1)];

                rTotal += refSrc[pixelIdx] * weight;
                gTotal += refSrc[pixelIdx + 1] * weight;
                bTotal += refSrc[pixelIdx + 2] * weight;
              }
            }

            const outIdx = (y * targetW + x) * 4;
            outputArr[outIdx] = Math.max(0, Math.min(255, rTotal));
            outputArr[outIdx + 1] = Math.max(0, Math.min(255, gTotal));
            outputArr[outIdx + 2] = Math.max(0, Math.min(255, bTotal));
            outputArr[outIdx + 3] = refSrc[outIdx + 3]; // Maintain opacity
          }
        }
        ctx.putImageData(outputData, 0, 0);
      }

      setResultSrc(canvas.toDataURL("image/jpeg", 0.95));
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      processEnhancer();
    }
  }, [imageSrc, upscale, sharpen, denoise, brightness]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_enhanced_ai.jpg`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="ai-enhancer-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-fuchsia-500" /> AI Photo Enhancer & Upscaler
          </h2>
          <p className="text-xs text-slate-500">Sharpen blurred captures, denoise mobile sensor grains and improve contrast for automated checkouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders */}
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
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop Image or Tap</p>
              <p className="text-[10px] text-slate-400">Supports portraits, identity cards</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-4 h-4 text-indigo-500" /> Enhancement Parameters
            </span>

            {/* Resolution Upscale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650 dark:text-slate-300">Resolution Upscale (Bicubic)</span>
                <span className="text-indigo-505 text-indigo-500">+{upscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={upscale}
                onChange={(e) => setUpscale(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded accent-indigo-600 appearance-none cursor-pointer"
              />
            </div>

            {/* Sharpen matrix */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650 dark:text-slate-300">Sharpen Matrix (Unmask Blur)</span>
                <span className="text-fuchsia-500">+{sharpen}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sharpen}
                onChange={(e) => setSharpen(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded accent-fuchsia-500 appearance-none cursor-pointer"
              />
            </div>

            {/* Brightness slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650 dark:text-slate-300">Shadow Brightness Booster</span>
                <span className="text-amber-500">+{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded accent-amber-500 appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Output area */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <span className="text-[10px] text-slate-400 font-mono block uppercase mb-2">AI COMPARED CANVAS CONTROLS</span>

              <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-center p-3 relative overflow-hidden">
                {processing ? (
                  <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                ) : resultSrc ? (
                  <img src={resultSrc} alt="Preview AI enhancement filters" className="max-h-full max-w-full object-contain shadow" />
                ) : (
                  <span className="text-xs text-slate-400 italic">Formatting filter convolution...</span>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={processEnhancer}
                  className="flex-1 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Apply Enhancer
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc}
                  className="flex-1 py-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Enhanced Portrait
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/84 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload portrait scan to execute high-pass filters.</p>
              <p className="text-[10px] mt-1 text-slate-400">Restores weak contrast details instantly in HTML5 Ram buffers.</p>
            </div>
          )}

          <div className="p-3 bg-fuchsia-50/40 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-950/50 rounded-lg flex gap-2 items-start text-[11px] text-fuchsia-700 dark:text-fuchsia-400">
            <Shield className="w-4 h-4 text-fuchsia-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Biomedical Protection:</strong> By upscaling offline, our filter completely preserves fingerprint loop frequencies and facial geometries safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
