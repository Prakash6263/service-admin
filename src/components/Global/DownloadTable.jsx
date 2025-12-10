import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadTable = ({ tableId, className }) => {
  // Function to download Excel file
  const exportToExcel = () => {
    const table = document.getElementById(tableId);
    if (!table) return alert("Table not found!");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, `${tableId}.xlsx`);
  };

  // Function to download PDF file
  const exportToPDF = () => {
    const table = document.getElementById(tableId);
    if (!table) return alert("Table not found!");
    const doc = new jsPDF();
    doc.text("Table Data", 14, 10);
    doc.autoTable({ html: `#${tableId}` });
    doc.save(`${tableId}.pdf`);
  };

  return (
    <div className={`download-buttons ${className}`}>
      <button id="downloadExcel" onClick={exportToExcel} className="d-none">
        EXCEL
      </button>
      <button id="downloadPDF" onClick={exportToPDF} className="d-none">
        PDF
      </button>
    </div>
  );
};

export default DownloadTable;
