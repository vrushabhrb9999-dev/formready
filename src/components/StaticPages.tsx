/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Check, AlertTriangle, ShieldCheck, MapPin, ExternalLink, HelpCircle } from "lucide-react";

interface PageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="about-page">
      <button onClick={onBack} className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">About FormReady</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed">
        FormReady is an all-in-one, privacy-focused image and document processing suite engineered to assist applicants
        in meeting the strict file upload requirements of competitive and government entrance portals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950 rounded-xl">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">🔒 Privacy-First Architecture</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            FormReady executes all cropping, compressing, formatting, and PDF merges completely within your client-side web browser.
            Your passports, transcripts, and signatures never leave your terminal or touch external databases.
          </p>
        </div>
        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-xl">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">⚡ Proportional Precision</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Government systems discard registrations for minute variations. Our helper clamps ratios across UPSC, SSC, RRB,
            and banking portals to guarantee compatibility.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Filling digital applications is already stressful. Finding a tool to reduce a photo to exactly 19KB shouldn't be high risk.
        We provide safe and elegant utilities for anyone seeking high-quality processing controls.
      </p>
    </div>
  );
}

export function ContactPage({ onBack }: PageProps) {
  return (
    <div className="max-w-xl mx-auto py-8 px-4" id="contact-page">
      <button onClick={onBack} className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Contact System Support</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm">
        Do you have comments, reports, or inquiries regarding specific exam specs? Contact us directly.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for reaching out! We will contact you soon."); }} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Your Full Name</label>
          <input required type="text" className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-sm focus:outline-indigo-500 text-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Email Address</label>
          <input required type="email" className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-sm focus:outline-indigo-500 text-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Inquiry Purpose</label>
          <select className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-sm focus:outline-indigo-500 text-slate-800 dark:text-white">
            <option>Suggest a New Exam Preset</option>
            <option>Report an Incorrect Spec</option>
            <option>Technical bug or error</option>
            <option>Business Advertisement</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Message Description</label>
          <textarea required rows={4} className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-sm focus:outline-indigo-500 text-slate-800 dark:text-white" placeholder="Describe the specs or requirements here..."></textarea>
        </div>
        <button type="submit" className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors">
          Send Secure Report
        </button>
      </form>

      <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span>vrushabhrb99.99@gmail.com</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>Silicon Oasis Center, Dev Hub</span>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage({ onBack }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="privacy-page">
      <button onClick={onBack} className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      </div>
      <p className="text-[11px] text-slate-400 font-mono mb-6">Last Revised: June 15, 2026</p>

      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
        <p>
          At FormReady, we consider privacy to be a structural pillars of security. This statement defines how we handle documents and details.
        </p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">1. No Server-Side File Storage</h3>
        <p>
          Unlike competitive tools, FormReady functions <strong>entirely in your local browser sandbox</strong>.
          When you upload an image, marksheet, or thumb scan:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>It is placed directly in standard local memory (HTML5 RAM canvas elements).</li>
          <li>It is processed locally using pure javascript code compilation blocks.</li>
          <li>We host absolute zero database storage logs for user photographs or identifiers.</li>
        </ul>

        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">2. Cookies & Advertising</h3>
        <p>
          We use Google AdSense advertising networks are configured to display relevant coaching aids, mock assessments, or testing templates. Cookies are utilized exclusively to align and render these components smoothly.
        </p>
      </div>
    </div>
  );
}

export function DisclaimerPage({ onBack }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="disclaimer-page">
      <button onClick={onBack} className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Disclaimer</h1>
      </div>
      <p className="text-[11px] text-slate-400 font-mono mb-6">Effective Date: June 15, 2026</p>

      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
        <p>
          Please review this statement carefully to understand the limits of liabilities:
        </p>
        <p className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950 rounded-lg text-amber-800 dark:text-amber-400">
          <strong>Non-Affiliation:</strong> FormReady is an independent helper toolset. We are NOT associated, endorsed, affiliated,
          or officially linked with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), IBPS, or any
          state or national government testing boards.
        </p>
        <p>
          Exam guidelines modify frequently. While we perform periodic checkups on minimum/maximum KB ceilings and physical dimensions, candidates
          are ultimately instructed to double check the live requirements described in official notifications before hitting final upload registers.
        </p>
      </div>
    </div>
  );
}

export function TermsPage({ onBack }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="terms-page">
      <button onClick={onBack} className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Terms and Conditions</h1>
      <p className="text-[11px] text-slate-400 font-mono mb-6">Effective Date: June 15, 2026</p>

      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4 font-normal">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">1. Permitted Use</h3>
        <p>
          You are permitted to upload applicant files for optimization solely for individual competitive exam applications, recruitment registers,
          and public service requests. Under no circumstance may this utility be loaded via scripts for automated form spam or server harvesting.
        </p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">2. Safe Handling</h3>
        <p>
          Files processed here execute 100% on standard clients. The user accepts absolute responsibility for storing downloaded results correctly,
          naming files appropriately, and uploading valid payloads to original government sites.
        </p>
      </div>
    </div>
  );
}
