/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ActiveTab, ExamSpec } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeHero from "./components/HomeHero";
import FaqSection from "./components/FaqSection";
import BlogSection from "./components/BlogSection";
import GovtAssistant from "./components/GovtAssistant";
import AdSensePlaceholder from "./components/AdSensePlaceholder";
import { EXAM_SPECS } from "./data/exams";

// Import legal and informational static views
import { AboutPage, ContactPage, PrivacyPolicyPage, DisclaimerPage, TermsPage } from "./components/StaticPages";

// Import modular interactive tools
import PhotoCompressor from "./components/tools/PhotoCompressor";
import PhotoResizer from "./components/tools/PhotoResizer";
import SignatureResizer from "./components/tools/SignatureResizer";
import ThumbResizer from "./components/tools/ThumbResizer";
import AiEnhancer from "./components/tools/AiEnhancer";
import PdfSuite from "./components/tools/PdfSuite";
import CropImage from "./components/tools/CropImage";
import BackgroundRemover from "./components/tools/BackgroundRemover";
import FormatConverter from "./components/tools/FormatConverter";

import { Info, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeSpec, setActiveSpec] = useState<ExamSpec | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Load and apply visual mode system default preference
  useEffect(() => {
    const isSavedDark = localStorage.getItem("theme") === "dark";
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (isSavedDark || (!localStorage.getItem("theme") && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  };

  // Pre-configure specific tool based on selected government exam specs
  const handleSelectSpec = (spec: ExamSpec, targetTool: ActiveTab) => {
    setActiveSpec(spec);
    setActiveTab(targetTool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderActiveTool = () => {
    switch (activeTab) {
      // 1. Photo Compressor
      case "photo-compressor":
        return <PhotoCompressor activeSpec={activeSpec} />;
      // 2. Photo Resizer
      case "photo-resizer":
        return <PhotoResizer activeSpec={activeSpec} />;
      // 3. Signature Resizer
      case "signature-resizer":
        return <SignatureResizer activeSpec={activeSpec} />;
      // 4. Thumb Impression Resizer
      case "thumb-resizer":
        return <ThumbResizer activeSpec={activeSpec} />;
      // 5. AI Photo Enhancer
      case "ai-enhancer":
        return <AiEnhancer />;
      // 6-10. PDF compressing, JPEG converter, Merge & Split PDF Suite
      case "pdf-compressor":
      case "jpg-to-pdf":
      case "pdf-to-jpg":
      case "pdf-merge":
      case "pdf-split":
        return <PdfSuite />;
      // 11. Crop Image Tool
      case "crop-image":
        return <CropImage />;
      // 12. Background Remover
      case "background-remover":
        return <BackgroundRemover />;
      // 13. Photo Format Converter
      case "format-converter":
        return <FormatConverter />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={toggleTheme} />
      
      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar on Desktop */}
        <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex-col gap-6 shrink-0 overflow-y-auto justify-between shadow-xs">
          <div className="space-y-6">
            {/* Category Navigation section */}
            <section>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Categories
              </h3>
              <ul className="space-y-1">
                <li 
                  onClick={() => setActiveTab("home")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                    activeTab === "home"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "home" ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`} />
                  All Tools Dashboard
                </li>
                
                {/* Image processing nested items */}
                <li className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block px-3 mb-1 uppercase">Image Processing</span>
                  <ul className="pl-2 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-3.5">
                    {[
                      { id: "photo-compressor", label: "Compress Photo" },
                      { id: "photo-resizer", label: "Resize Photo" },
                      { id: "signature-resizer", label: "Resize Signature" },
                      { id: "thumb-resizer", label: "Thumb Impression" },
                      { id: "crop-image", label: "Crop Overlay" },
                      { id: "background-remover", label: "Background Eraser" },
                      { id: "format-converter", label: "Format Converter" }
                    ].map((tool) => (
                      <li key={tool.id} onClick={() => setActiveTab(tool.id as any)}>
                        <button className={`w-full text-left px-2 py-1 text-[11px] font-semibold rounded ease-out transition-all border-0 bg-transparent cursor-pointer ${
                          activeTab === tool.id
                            ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/40 dark:bg-indigo-950/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}>
                          {tool.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* PDF processing nested items */}
                <li className="mt-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block px-3 mb-1 uppercase">PDF Suite</span>
                  <ul className="pl-2 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-3.5">
                    {[
                      { id: "pdf-compressor", label: "Compress / Edit" },
                    ].map((tool) => (
                      <li key={tool.id} onClick={() => setActiveTab(tool.id as any)}>
                        <button className={`w-full text-left px-2 py-1 text-[11px] font-semibold rounded ease-out transition-all border-0 bg-transparent cursor-pointer ${
                          activeTab === tool.id
                            ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/40 dark:bg-indigo-950/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}>
                          {tool.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* AI Enhancing */}
                <li className="mt-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block px-3 mb-1 uppercase">Advanced AI</span>
                  <ul className="pl-2 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-3.5">
                    {[
                      { id: "ai-enhancer", label: "AI Photo Enhancer" },
                    ].map((tool) => (
                      <li key={tool.id} onClick={() => setActiveTab(tool.id as any)}>
                        <button className={`w-full text-left px-2 py-1 text-[11px] font-semibold rounded ease-out transition-all border-0 bg-transparent cursor-pointer ${
                          activeTab === tool.id
                            ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/40 dark:bg-indigo-950/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}>
                          {tool.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </section>

            {/* Recent Exams helper specifications section */}
            <section>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Recent Exams
              </h3>
              <div className="space-y-2">
                {EXAM_SPECS.slice(0, 3).map((spec) => (
                  <div 
                    key={spec.id}
                    onClick={() => handleSelectSpec(spec, "photo-resizer")}
                    className={`p-2.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-850 cursor-pointer text-left transition-all ${
                      activeSpec?.id === spec.id ? "bg-indigo-50/25 border-indigo-200 dark:bg-indigo-950/10 dark:border-indigo-900" : ""
                    }`}
                  >
                    <p className="text-[11px] font-extrabold text-slate-808 dark:text-slate-200 tracking-tight leading-tight line-clamp-1">{spec.name}</p>
                    <span className="text-[9px] font-semibold text-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/40 px-1 border-indigo-100 dark:border-indigo-900/40 rounded mt-1 inline-block">
                      {spec.category} Preset
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Call to Action upgrade plan Card */}
          <div className="p-4 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl text-white relative overflow-hidden transition-all shadow-md">
            <p className="text-[10px] font-extrabold tracking-wide text-indigo-450 uppercase">v1.0.0 FormReady Pro</p>
            <p className="text-xs font-black mt-1 mb-1 text-slate-50">Pro Plan Available</p>
            <p className="text-[10px] text-slate-300 mb-3.5 leading-snug">Unlimited PDF merges and AI enhancements local sandbox.</p>
            <button 
              onClick={() => alert("FormReady Premium is active locally! All tools are free and offline-unlocked on your sandbox workspace. Enjoy high speed processing!")}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black rounded-lg text-white transition-all cursor-pointer shadow-sm border-0"
            >
              FREE UNLOCKED
            </button>
          </div>
        </aside>

        {/* Right Scrollable Content Column */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Elegant Header welcome area mimicking mockup */}
            {activeTab === "home" && (
              <header className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                    Welcome back to FormReady
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-405 font-medium font-sans">
                    Ready to prepare your documents? <strong className="text-indigo-600 dark:text-indigo-400">13 secure workspace tools</strong> are active and running 100% in-browser.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-[10px] font-bold tracking-wide rounded-full font-mono uppercase">
                    ★ SEO Optimized
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-450 border border-indigo-100 dark:border-indigo-900 text-[10px] font-bold tracking-wide rounded-full font-mono uppercase">
                    ★ PWA Ready
                  </span>
                </div>
              </header>
            )}

            {/* AdSense Top Header Banner slot */}
            <AdSensePlaceholder type="banner" slot="98027419" />

            {/* Active Spec auto-configuration notification box */}
            {activeSpec && activeTab !== "home" && (
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-200">
                      Auto-Configured for: <strong className="text-indigo-600 dark:text-indigo-400">{activeSpec.name}</strong>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Applying official specifications to targets, limits and aspect crop guides automatically.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectSpec(activeSpec, "photo-compressor")}
                    className={`px-3 py-1 text-[10px] font-bold rounded border ${activeTab === 'photo-compressor' ? 'bg-slate-900 text-white dark:bg-indigo-600' : 'bg-white text-slate-705 dark:bg-slate-900 dark:text-slate-100 border-slate-200/50'}`}
                  >
                    Compressor
                  </button>
                  <button
                    onClick={() => handleSelectSpec(activeSpec, "photo-resizer")}
                    className={`px-3 py-1 text-[10px] font-bold rounded border ${activeTab === 'photo-resizer' ? 'bg-slate-900 text-white dark:bg-indigo-600' : 'bg-white text-slate-705 dark:bg-slate-900 dark:text-slate-100 border-slate-200/50'}`}
                  >
                    Dimension Resizer
                  </button>
                  <button
                    onClick={() => setActiveSpec(null)}
                    className="px-2.5 py-1 text-[10px] hover:underline text-red-500 bg-transparent border-0 cursor-pointer font-semibold"
                  >
                    Reset Spec Preset
                  </button>
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <div className="space-y-4">
                {/* Government Exam Upload Helper Panel */}
                <GovtAssistant onSelectSpec={handleSelectSpec} currentActiveSpec={activeSpec} />

                {/* Home Hero Content & Bento grid */}
                <HomeHero onSelectTab={setActiveTab} />

                {/* Inline affiliate sponsor banners */}
                <AdSensePlaceholder type="inline" />

                {/* General searchable FAQs Accordion section */}
                <FaqSection />
              </div>
            )}

            {/* Render Active Tool Panel if active tab is a tool */}
            {!["home", "blog", "about", "contact", "privacy", "disclaimer", "terms"].includes(activeTab) && (
              <div className="space-y-6">
                {renderActiveTool()}
                
                <div className="flex justify-between items-center py-4 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    onClick={handleBackToHome}
                    className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-opacity-90 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer border-0"
                  >
                    &larr; Back to Portal Assistant
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">FormReady Secure Core Execution Sandbox</span>
                </div>
              </div>
            )}

            {/* Render blog feed */}
            {activeTab === "blog" && <BlogSection />}

            {/* Render compliance static layouts */}
            {activeTab === "about" && <AboutPage onBack={handleBackToHome} />}
            {activeTab === "contact" && <ContactPage onBack={handleBackToHome} />}
            {activeTab === "privacy" && <PrivacyPolicyPage onBack={handleBackToHome} />}
            {activeTab === "disclaimer" && <DisclaimerPage onBack={handleBackToHome} />}
            {activeTab === "terms" && <TermsPage onBack={handleBackToHome} />}

            {/* Footer nested at the end of scrollable view */}
            <Footer setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
