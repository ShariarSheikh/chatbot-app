import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generateAssessmentPDF = async (
  elementId: string,
  fileName: string
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF generation");
    return;
  }

  // Create clone for safe manipulation
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = "794px"; // A4 width in pixels (210mm)
  clone.style.padding = "20px";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: true,
      backgroundColor: "#FFFFFF",
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    document.body.removeChild(clone);
  }
};
