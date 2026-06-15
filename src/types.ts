/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExamSpec {
  id: string;
  name: string;
  category: "SSC" | "UPSC" | "Banking" | "Railways" | "CET" | "Others";
  photo: {
    widthPx?: number;
    heightPx?: number;
    widthMm?: number;
    heightMm?: number;
    minKb: number;
    maxKb: number;
    formats: string[];
    description?: string;
  };
  signature: {
    widthPx?: number;
    heightPx?: number;
    widthMm?: number;
    heightMm?: number;
    minKb: number;
    maxKb: number;
    formats: string[];
    description?: string;
  };
  thumb?: {
    widthPx?: number;
    heightPx?: number;
    minKb: number;
    maxKb: number;
    formats: string[];
    description?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Government Exams" | "Photo Upload Guides" | "PDF Guides" | "Online Form Tutorials";
  publishedAt: string;
  readTime: string;
  author: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export type ActiveTab = 
  | "home"
  | "photo-compressor"
  | "photo-resizer"
  | "signature-resizer"
  | "thumb-resizer"
  | "ai-enhancer"
  | "pdf-compressor"
  | "jpg-to-pdf"
  | "pdf-to-jpg"
  | "pdf-merge"
  | "pdf-split"
  | "crop-image"
  | "background-remover"
  | "format-converter"
  | "govt-configurator"
  | "blog"
  | "about"
  | "contact"
  | "privacy"
  | "disclaimer"
  | "terms";
