/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActiveTab } from "../types";
import { 
  Sparkles, FormInput, FileText, Image, Crop, Scissors, Layers, CheckCircle, 
  ArrowRight, ShieldCheck, Scale, AlertCircle, RefreshCw, Zap, Landmark
} from "lucide-react";
import { motion } from "motion/react";

interface HomeHeroProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export default function HomeHero({ onSelectTab }: HomeHeroProps) {
  const categories = [
    {
      title: "Popular Photo Utilities",
      description: "Match exact pixel ratios, millimeter dimensions, and KB limits.",
      items: [
        { id: "photo-compressor" as ActiveTab, name: "Photo Compressor", desc: "Squeeze PNG/JPG to exact target Kilobytes", icon: Scale, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
        { id: "photo-resizer" as ActiveTab, name: "Photo Resizer", desc: "Set physical widths in mm, cm or pixels", icon: FormInput, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
        { id: "signature-resizer" as ActiveTab, name: "Signature Resizer", desc: "Clean, square or stretch ink scans perfectly", icon: Scissors, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
        { id: "thumb-resizer" as ActiveTab, name: "Thumb Resizer", desc: "Black and white fingerprint thresholding", icon: Landmark, color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20" },
      ]
    },
    {
      title: "AI & Image Processing",
      description: "Advanced canvas shaders to clean templates and backgrounds.",
      items: [
        { id: "ai-enhancer" as ActiveTab, name: "AI Photo Enhancer", desc: "Denoise, sharpen and upscale scanned portraits", icon: Sparkles, color: "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/20" },
        { id: "crop-image" as ActiveTab, name: "Crop Image Tool", desc: "Precise custom Aspect Ratios with grid overlays", icon: Crop, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
        { id: "background-remover" as ActiveTab, name: "Background Remover", desc: "Isolate portraits or erase white scanned borders", icon: Layers, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" },
        { id: "format-converter" as ActiveTab, name: "Format Converter", desc: "Batch change JPG, PNG, WEBP local streams", icon: RefreshCw, color: "text-violet-500 bg-violet-50 dark:bg-violet-950/20" },
      ]
    },
    {
      title: "Secure PDF Suite",
      description: "Convert, merge, and compress heavy documents entirely off-cloud.",
      items: [
        { id: "pdf-compressor" as ActiveTab, name: "PDF Compressor", desc: "Squeeze heavy scanned marksheets below 500KB", icon: FileText, color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" },
        { id: "jpg-to-pdf" as ActiveTab, name: "JPG to PDF", desc: "Combine photo scans into valid PDF pages", icon: Image, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" },
        { id: "pdf-to-jpg" as ActiveTab, name: "PDF to JPG", desc: "Extract high-contrast photo sheets from PDF pages", icon: FileText, color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" },
        { id: "pdf-merge" as ActiveTab, name: "Merge PDFs", desc: "Combine multi-page transcripts sequentially", icon: Layers, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
      ]
    }
  ];

  return (
    <div id="home-hero">
      {/* Hero Header Area */}
      <div className="text-center py-12 md:py-16 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% In-Browser Privacy Secured</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none"
        >
          Prepare Portal Uploads <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-400 bg-clip-text text-transparent">
            In Seconds, Safely.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          No files ever touch our cloud storage. Crop, format, and squeeze passport photos, signatures, finger scans or sheets with absolute accuracy for SSC, UPSC, bank exams and more.
        </motion.p>

        {/* Action Feature Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400 font-semibold"
        >
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Exact KB Targeting
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Passport Presets
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> B&W Thumb Impress
          </span>
        </motion.div>
      </div>

      {/* Grid of Tools organized by Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{cat.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.items.map((it, itIdx) => {
                const Icon = it.icon;
                return (
                  <motion.button
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    key={itIdx}
                    onClick={() => onSelectTab(it.id)}
                    className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between h-44 cursor-pointer outline-none"
                  >
                    <div>
                      <span className={`p-2.5 rounded-xl inline-block ${it.color} mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4.5 h-4.5" />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {it.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-tight">
                        {it.desc}
                      </p>
                    </div>

                    <div className="text-[10px] text-indigo-500 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end w-full">
                      Launch Tool <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Security Trust Banner */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800/80 my-10 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-indigo-600 dark:text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">How FormReady Protects Candidates</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your marksheets, fingerprints, and signatures are handled 100% locally in web memory.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="p-1 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-mono">
              ★ OFFLINE SECURE
            </span>
            <span className="p-1 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-1 font-mono">
              ★ NO REGISTRATION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
