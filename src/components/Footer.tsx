/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActiveTab } from "../types";
import { FormInput, Heart, Shield, Landmark } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleLinkClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 px-4 transition-colors" id="main-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* Branding description */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
              <FormInput className="w-4 h-4" />
            </span>
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
              FormReady
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
            Secure client-side optimization sandbox. We assist candidates in matching rigid image dimensions, formats, and KB specifications for national examinations without storing files or sharing personal data.
          </p>
          <p className="text-[10px] text-slate-400">
            FormReady does not upload your sensitive identity files. Your data remains in your custody inside your browser sandboxes.
          </p>
        </div>

        {/* Categories of Tools */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">Processing Utilities</h4>
          <ul className="space-y-1.5 text-xs text-slate-500">
            <li>
              <button onClick={() => handleLinkClick("photo-compressor")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Photo Compressor (Target KB)
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("photo-resizer")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Photo Dimension Resizer (Px, Mm)
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("signature-resizer")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Signature Resizer (Exact KB)
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("thumb-resizer")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Thumb Impression B&W Filter
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("ai-enhancer")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                AI / Canvas Photo Enhancer
              </button>
            </li>
          </ul>
        </div>

        {/* PDF Suite */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">PDF Suite</h4>
          <ul className="space-y-1.5 text-xs text-slate-500">
            <li>
              <button onClick={() => handleLinkClick("pdf-compressor")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Reduce PDF Size
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("jpg-to-pdf")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Convert JPG to PDF
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("pdf-to-jpg")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Convert PDF to JPG
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("pdf-merge")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">
                Merge Scans PDF
              </button>
            </li>
          </ul>
        </div>

        {/* Help & Compliance */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">Compliance & Help</h4>
          <ul className="space-y-1.5 text-xs text-slate-500">
            <li>
              <button onClick={() => handleLinkClick("about")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline font-semibold text-slate-600 dark:text-slate-400">About FormReady</button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("contact")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">Contact Support</button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("privacy")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">Privacy Policy</button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("disclaimer")} className="hover:text-amber-500 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline flex items-center gap-1 font-semibold">
                Disclaimer <Shield className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("terms")} className="hover:text-indigo-600 bg-transparent text-left cursor-pointer border-0 p-0 text-slate-500 hover:underline">Terms & Conditions</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p className="font-mono">© 2026 FormReady Suite • Safe & Encrypted in Client Memory</p>
        <div className="flex items-center gap-1">
          <span>Made for government prep systems with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </div>
      </div>
    </footer>
  );
}
