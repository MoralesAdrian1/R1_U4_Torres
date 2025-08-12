import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * @param {HTMLElement} element 
 * @param {string} nombreModelo 
 */
export async function generarPDF(element, nombreModelo = "Reporte Modelo") {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height + 80]
  });

  pdf.setFontSize(24);
  pdf.text(nombreModelo, 40, 40);
  pdf.addImage(imgData, "PNG", 20, 60, canvas.width - 40, canvas.height - 40);

  pdf.save(`${nombreModelo}.pdf`);
}