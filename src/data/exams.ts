/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamSpec } from "../types";

export const EXAM_SPECS: ExamSpec[] = [
  {
    id: "upsc-cse",
    name: "UPSC Civil Services Exam (CSE)",
    category: "UPSC",
    photo: {
      widthPx: 350,
      heightPx: 350,
      minKb: 20,
      maxKb: 300,
      formats: ["jpg", "jpeg"],
      description: "Must be a white background, clicked within 10 days of application start."
    },
    signature: {
      widthPx: 350,
      heightPx: 350,
      minKb: 20,
      maxKb: 300,
      formats: ["jpg", "jpeg"],
      description: "Must be in dark ink on a plain white paper."
    }
  },
  {
    id: "ssc-cgl",
    name: "Staff Selection Commission (SSC CGL)",
    category: "SSC",
    photo: {
      widthMm: 35,
      heightMm: 45,
      widthPx: 350,
      heightPx: 450,
      minKb: 20,
      maxKb: 50,
      formats: ["jpg", "jpeg"],
      description: "Spectacles not allowed. Cap and mask not allowed. Frontal view."
    },
    signature: {
      widthMm: 40,
      heightMm: 20,
      widthPx: 140,
      heightPx: 60,
      minKb: 10,
      maxKb: 20,
      formats: ["jpg", "jpeg"],
      description: "Sign with black pen. Signature must not be in capital letters."
    }
  },
  {
    id: "ibps-po",
    name: "IBPS PO / Clerk (Banking Exams)",
    category: "Banking",
    photo: {
      widthPx: 200,
      heightPx: 230,
      minKb: 20,
      maxKb: 50,
      formats: ["jpg", "jpeg"],
      description: "Relaxed look, preferably light or white background."
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      minKb: 10,
      maxKb: 20,
      formats: ["jpg", "jpeg"],
      description: "Sign with black ink pen on white paper."
    },
    thumb: {
      widthPx: 240,
      heightPx: 240,
      minKb: 20,
      maxKb: 50,
      formats: ["jpg", "jpeg"],
      description: "Left thumb impression with blue or black ink on white paper."
    }
  },
  {
    id: "rrb-ntpc",
    name: "Railway Recruitment Board (RRB NTPC)",
    category: "Railways",
    photo: {
      widthMm: 35,
      heightMm: 45,
      widthPx: 320,
      heightPx: 400,
      minKb: 20,
      maxKb: 50,
      formats: ["jpg", "jpeg"],
      description: "Clean color passport photo taken after official notice."
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      minKb: 10,
      maxKb: 40,
      formats: ["jpg", "jpeg"],
      description: "Plain signature on blank white sheets"
    }
  },
  {
    id: "state-cet",
    name: "State Common Entrance Test (CET)",
    category: "CET",
    photo: {
      widthPx: 150,
      heightPx: 200,
      minKb: 20,
      maxKb: 50,
      formats: ["jpg", "png", "jpeg"],
      description: "Clear sharp facial image."
    },
    signature: {
      widthPx: 150,
      heightPx: 50,
      minKb: 10,
      maxKb: 20,
      formats: ["jpg", "png", "jpeg"],
      description: "Clear signature without background noise."
    }
  }
];
