import * as XLSX from 'xlsx';

export const generateExcelReport = (userEmail, activities) => {
  const data = activities.map(item => ({
    'Activity Type': item.activityType,
    'Value': item.value,
    'Unit': item.unit || 'units',
    'CO₂ Emitted (kg)': item.emission,
    'Date': new Date(item.timestamp).toLocaleString(),
  }));

  // Add total row
  const totalEmission = activities.reduce((acc, act) => acc + act.emission, 0);
  data.push({
    'Activity Type': 'Total',
    'Value': '',
    'Unit': '',
    'CO₂ Emitted (kg)': totalEmission.toFixed(2),
    'Date': '',
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');

  XLSX.writeFile(workbook, `carbon_report_${userEmail}.xlsx`);
};
