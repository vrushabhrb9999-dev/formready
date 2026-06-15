/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActiveTab } from "../types";
import { Sparkles, Sun, Moon, FormInput, FileText, Landmark, BookOpen, Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ activeTab, setActiveTab, isDark, toggleTheme }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: "home", label: "Dashboard", icon: Landmark },
    { id: "photo-compressor", label: "Photo Compressor", icon: Sparkles },
    { id: "photo-resizer", label: "Photo Resizer", icon: FormInput },
    { id: "signature-resizer", label: "Signature Resizer", icon: FormInput },
    { id: "ai-enhancer", label: "AI Enhancer", icon: Sparkles },
    { id: "pdf-compressor", label: "PDF Suite", icon: FileText },
    { id: "blog", label: "Guides & Blog", icon: BookOpen },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2 text-slate-900 dark:text-white font-black hover:opacity-90 bg-transparent border-0 cursor-pointer font-sans"
            >
              <span className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-xl shadow-sm">
                <FormInput className="w-5 h-5" />
              </span>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                FormReady
              </span>
            </button>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono rounded">
              v1.0.0
            </span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === "photo-compressor" && ["photo-compressor", "crop-image", "background-remover", "format-converter"].includes(activeTab)) ||
                (item.id === "pdf-compressor" && ["pdf-compressor", "jpg-to-pdf", "pdf-to-jpg", "pdf-merge", "pdf-split"].includes(activeTab));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-transparent border-0 cursor-pointer ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/30"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Brand Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
              aria-label="Toggle visual contrast"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
