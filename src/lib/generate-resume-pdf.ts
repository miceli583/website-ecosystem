/**
 * Generate PDF from resume page
 * This utility creates a properly formatted PDF of the resume
 * using jsPDF and html2canvas
 */

export async function generateResumePDF() {
  // Dynamically import libraries to avoid SSR issues
  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).default;

  // Get the resume container element
  const resumeElement = document.querySelector('.resume-container') as HTMLElement;

  if (!resumeElement) {
    console.error('Resume container not found');
    return;
  }

  // Create canvas from HTML
  const canvas = await html2canvas(resumeElement, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // Calculate PDF dimensions
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let heightLeft = imgHeight;
  let position = 0;

  // Add image to PDF
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add additional pages if content exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Save the PDF
  pdf.save('Matthew_Miceli_Resume.pdf');
}
