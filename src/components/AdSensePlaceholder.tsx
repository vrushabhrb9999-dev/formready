/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Info, Sparkles } from "lucide-react";

interface AdsProps {
  type: "banner" | "sidebar" | "inline";
  slot?: string;
}

export default function AdSensePlaceholder({ type, slot = "00000000" }: AdsProps) {
  if (type === "banner") {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-2 my-6">
        <div className="flex items-center justify-between px-2 pb-1 text-[10px] text-slate-400 font-mono tracking-wider">
          <span>SPONSORED ADVERTISEMENT</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
            Ad options <Info className="w-3 h-3" />
          </span>
        </div>
        <div className="h-20 sm:h-24 bg-slate-100 dark:bg-slate-950 rounded flex flex-col items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
          <p className="text-xs text-slate-500 font-medium">Responsive AdSense Banner [slot: {slot}]</p>
          <p className="text-[10px] text-slate-400">Targeted exam prep, mock tests & form guide recommendations</p>
        </div>
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sticky top-6">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
          <span>SPONSORED</span>
          <span className="flex items-center gap-1">Ad <Info className="w-2.5 h-2.5" /></span>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                UPSC Master Mock Series
              </p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Score 99+ with India's best learning test engines. Instant feedback!
            </p>
            <div className="mt-2 text-[10px] text-indigo-500 font-medium text-right">Learn more →</div>
          </div>

          <div className="h-60 bg-slate-100 dark:bg-slate-950 rounded flex flex-col items-center justify-center border border-slate-200/50 dark:border-slate-800/50 p-2">
            <span className="text-[10px] text-slate-400 font-mono">300x250 Ad Position</span>
            <p className="text-xs text-slate-500 font-semibold text-center mt-1">Sponsor Exam Coaching App</p>
            <div className="mt-4 px-3 py-1 bg-white dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-300 font-medium rounded border border-slate-200 dark:border-slate-800">
              Advertise Here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 p-3 bg-slate-100/50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
      <div className="text-center sm:text-left">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Need Passport Photos Home-Delivered?</p>
        <p className="text-[11px] text-slate-500">Get 16 premium prints on glossy paper for just $4.99</p>
      </div>
      <button className="px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-[10px] font-semibold rounded-full transition-all">
        Order Prints (Affiliate)
      </button>
    </div>
  );
}
