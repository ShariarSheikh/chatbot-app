/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type StyleProperty =
  | "background"
  | "backgroundColor"
  | "color"
  | "borderColor"
  | "borderTopColor"
  | "borderRightColor"
  | "borderBottomColor"
  | "borderLeftColor";

const COLOR_REPLACEMENTS: Record<string, string> = {
  // Gradients
  "linear-gradient(to right, #6366F1, #8B5CF6)": "#7367F0",
  "linear-gradient(to right, var(--primary), var(--secondary))": "#7367F0",

  // Modern color functions
  "oklch(var(--primary))": "#6366F1",
  "oklch(var(--secondary))": "#8B5CF6",
  "oklch(var(--accent))": "#EC4899",

  // Semi-transparent
  "rgba(99, 102, 241, 0.8)": "#6366F1",
  "rgba(139, 92, 246, 0.8)": "#8B5CF6",
};

const replaceUnsupportedColors = (element: HTMLElement) => {
  // Type-safe style property access
  const style = element.style;
  const properties: StyleProperty[] = [
    "background",
    "backgroundColor",
    "color",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
  ];

  properties.forEach((prop) => {
    const value = style[prop as any]; // Temporary any cast
    if (typeof value === "string" && value) {
      let newValue = value;
      for (const [unsupported, replacement] of Object.entries(
        COLOR_REPLACEMENTS
      )) {
        if (newValue.includes(unsupported)) {
          newValue = newValue.replace(unsupported, replacement);
        }
      }
      style[prop as any] = newValue; // Apply the fixed value
    }
  });

  // Handle computed styles
  const computed = window.getComputedStyle(element);
  if (computed.background) {
    let background = computed.background;
    for (const [unsupported, replacement] of Object.entries(
      COLOR_REPLACEMENTS
    )) {
      if (background.includes(unsupported)) {
        background = background.replace(unsupported, replacement);
      }
    }
    element.style.background = background;
  }
};

export const generateAssessmentPDF = async (
  elementId: string,
  fileName: string
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element #${elementId} not found`);
      return;
    }

    // Create and prepare clone
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = "794px";
    clone.style.zIndex = "99999";
    document.body.appendChild(clone);

    // Process colors
    replaceUnsupportedColors(clone);
    clone.querySelectorAll("*").forEach((el) => {
      if (el instanceof HTMLElement) {
        replaceUnsupportedColors(el);
      }
    });

    // Remove interactive elements
    clone.querySelectorAll("button, a, [onclick]").forEach((el) => el.remove());

    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: true,
      backgroundColor: "#F5F7FF",
      useCORS: true,
      ignoreElements: (el) => el.hasAttribute("data-ignore-pdf"),
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(canvas, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("PDF generation failed. Please try again or contact support.");
  } finally {
    document.querySelectorAll('[style*="left: -9999px"]').forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
};
