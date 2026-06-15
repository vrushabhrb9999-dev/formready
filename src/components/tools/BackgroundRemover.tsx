/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Upload, Download, Sparkles, Layers, Sliders } from "lucide-react";

export default function BackgroundRemover() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [tolerance, setTolerance] = useState<number>(30);
  const [targetBg, setTargetBg] = useState<"white" | "blue" | "custom">("white");
  const [solidFill, setSolidFill] = useState<string>("#FFFFFF"); // Fill background color (transparent by default if no fill, or white for passport)

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

  const removeBackground = () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Color criteria mapping
      // If white: match pixels where RGB is close to white (high luminosity)
      // If blue: match pixels close to sky blue studio color rgb(140, 180, 240)
      let targetR = 255, targetG = 255, targetB = 255;
      if (targetBg === "blue") {
        targetR = 140; targetG = 180; targetB = 240;
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const distance = Math.sqrt(
          Math.pow(r - targetR, 2) +
          Math.pow(g - targetG, 2) +
          Math.pow(b - targetB, 2)
        );

        // Normalized distance percentage
        const colorDiff = (distance / 441.67) * 100;

        if (colorDiff < tolerance) {
          // background match! Replace color parameters or make transparent
          if (solidFill === "transparent") {
            data[i + 3] = 0; // alpha zero
          } else {
            // Fill with custom solid color, e.g. white or light-blue
            const fillR = parseInt(solidFill.substring(1, 3), 16);
            const fillG = parseInt(solidFill.substring(3, 5), 16);
            const fillB = parseInt(solidFill.substring(5, 7), 16);

            data[i] = fillR;
            data[i + 1] = fillG;
            data[i + 2] = fillB;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setResultSrc(canvas.toDataURL("image/png")); // Export in png to support transparency
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      removeBackground();
    }
  }, [imageSrc, tolerance, targetBg, solidFill]);

  const handleDownload = () => {
    if (!resultSrc || !imageFile) return;
    const link = document.createElement("a");
    const nameOnly = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    link.download = `${nameOnly}_bg_removed.png`;
    link.href = resultSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="bg-remover-tool">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-indigo-505 text-indigo-505 text-indigo-505 text-indigo-500" /> Background Eraser & Border Cleaner
          </h2>
          <p className="text-xs text-slate-500">Isolate portraits from scanner noise or switch backgrounds to official white in one click.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 transition-all relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-403 text-slate-400 w-8 h-8" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Portrait Image</p>
              <p className="text-[10px] text-slate-404 text-slate-400 font-mono">JPG, PNG background isolation</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Erase Configurations</span>

            {/* Target Background Color */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Target Background to Replace</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTargetBg("white")}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    targetBg === "white"
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-650"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800"
                  }`}
                >
                  White Paper/Margins
                </button>
                <button
                  onClick={() => setTargetBg("blue")}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    targetBg === "blue"
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-650"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800"
                  }`}
                >
                  Blue Studio Backdrops
                </button>
              </div>
            </div>

            {/* Fill Replacement Solid */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Fill Replacement Backdrop</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Transparent", val: "transparent" },
                  { label: "Pure White", val: "#FFFFFF" },
                  { label: "Official Blue", val: "#B0C4DE" },
                ].map((fill) => (
                  <button
                    key={fill.val}
                    onClick={() => setSolidFill(fill.val)}
                    className={`py-1.5 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                      solidFill === fill.val
                        ? "bg-slate-900 border-slate-150 text-white dark:bg-indigo-600"
                        : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800"
                    }`}
                  >
                    {fill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color tolerance slider */}
            <div className="space-y-1.5 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Replacement Tolerance scope</span>
                <span className="text-indigo-500 font-mono font-bold">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded accent-indigo-600 appearance-none cursor-pointer"
              />
              <span className="text-[9px] text-slate-400 block leading-tight">Increase tolerance if background borders are unevenly lit.</span>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 space-y-4">
          {imageSrc ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85">
              <span className="text-[10px] text-slate-400 font-mono block uppercase mb-2">BACKGROUND PROCESSING ENVIRONMENT</span>

              <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 border rounded flex items-center justify-center p-3 relative overflow-hidden" style={{ backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
                {processing ? (
                  <Sparkles className="w-6 h-6 text-indigo-505 animate-pulse" />
                ) : resultSrc ? (
                  <img src={resultSrc} alt="Preview transparent isolated portrait" className="max-h-full max-w-full object-contain shadow-sm" />
                ) : (
                  <span className="text-xs text-slate-400 italic">Processing chroma extraction...</span>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={removeBackground}
                  className="flex-1 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Recalculate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resultSrc}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PNG file
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/84 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-slate-400 text-xs p-4">
              <p className="font-semibold text-slate-500">Upload portrait photograph to run background chroma-key subtraction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
