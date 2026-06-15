/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Photos",
    q: "Why does my passport photo keep getting rejected on government portal logs?",
    a: "Most rejections happen due to three reasons: incorrect file sizes (must be between 20KB-50KB for SSC, or 20KB-300KB for UPSC), incorrect dimensions, or scanning with heavy filters/spectacles on. Ensure you upload standard JPG files, crop closely to your face with ears visible, and use white/light backgrounds."
  },
  {
    category: "Signatures",
    q: "Can I sign in blue ink or does it have to be black?",
    a: "Most portals like SSC and Banking recommend signing in black ink pen because it offers much higher contrast. Scanners and automated validators can process black ink signatures easily, avoiding pixel failures."
  },
  {
    category: "Thumbs",
    q: "How do I make my thumb impression pure black and white?",
    a: "Our Thumb Impression tool offers a special 'Monochrome (B&W)' filters option. This automatically discards surrounding yellow paper tint, leaving a sharp, high-contrast blue/black fingerprint pattern, keeping files clean and well within 20KB targets."
  },
  {
    category: "PDFs",
    q: "Is it safe to merge my confidential transcripts on this website?",
    a: "Absolutely. Unlike traditional online PDF tools that upload documents on distant server targets, FormReady performs PDF merges, splits, and converters entirely inside your local browser memory sandbox. Your confidential certificates never pass through our nodes."
  },
  {
    category: "AdSense",
    q: "Why do some government exam helpers require exact dimensions?",
    a: "Automated examination software uses computer vision checks to verify and prevent candidates from scaling portraits improperly. If a photo ratio is stretched, facial recognition checks can fail, causing immediate application rejection."
  }
];

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto" id="faq-section">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Everything you need to know about specifications, ratios, and privacy standard checks.
        </p>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-3 top-2.5 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search FAQs (e.g., photo, signature, ink, merging...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-indigo-500 text-slate-800 dark:text-slate-100"
        />
      </div>

      {filteredFaqs.length === 0 ? (
        <p className="text-center text-xs text-slate-400 py-6">No matching questions found. Try typing another keyword.</p>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono tracking-wide rounded">
                      {faq.category}
                    </span>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
