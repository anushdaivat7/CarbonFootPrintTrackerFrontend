import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (userEmail, activities) => {
  const doc = new jsPDF();

  const generatedOn = new Date().toLocaleString();
  const totalEmission = activities.reduce((acc, act) => acc + act.emission, 0);

  // ✅ Clean Title (no emojis, no unicode)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Carbon Footprint Report', 14, 20);

  // ✅ User Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`User: ${userEmail}`, 14, 30);
  doc.text(`Generated on: ${generatedOn}`, 14, 36);
  doc.text(`Total CO2 Emitted: ${totalEmission.toFixed(2)} kg`, 14, 42); // Use CO2 (not CO₂)

  // ✅ Format table data
  const tableData = activities.map((item, index) => [
    index + 1,
    item.activityType,
    item.value,
    item.unit || 'units',
    `${item.emission.toFixed(2)} kg CO2`, // Use CO2 (not CO₂)
    new Date(item.timestamp).toLocaleString(),
  ]);

  // ✅ Generate table
  doc.autoTable({
    startY: 50,
    head: [['#', 'Activity Type', 'Value', 'Unit', 'CO2 Emitted', 'Date']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      font: 'helvetica', // ✅ Force readable font
      textColor: 20,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 35 },
      5: { halign: 'right', cellWidth: 55 },
    },
  });

  // ✅ Clean final line
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Total Carbon Emission: ${totalEmission.toFixed(2)} kg CO2`,
    14,
    finalY
  );

  // ✅ Save the PDF
  doc.save(`carbon_report_${userEmail}.pdf`);
};
