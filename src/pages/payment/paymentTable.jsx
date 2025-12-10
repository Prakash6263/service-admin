
// import React, { useRef, useEffect } from 'react';

// const paymentTable = ({
//     datas,
//     triggerDownloadExcel,
//     triggerDownloadPDF,
//     tableHeaders,
//     text,
//     loading,
//     error
// }) => {
//     const tableRef = useRef();

//     // Set up download triggers
//     useEffect(() => {
//         if (triggerDownloadExcel) {
//             triggerDownloadExcel.current = downloadExcel;
//         }
//         if (triggerDownloadPDF) {
//             triggerDownloadPDF.current = downloadPDF;
//         }
//     }, [datas]);

//     const downloadExcel = () => {
//         // Implement Excel download logic here
//         console.log('Download Excel', datas);
//     };

//     const downloadPDF = () => {
//         // Implement PDF download logic here
//         console.log('Download PDF', datas);
//     };

//     if (loading) {
//         return <div className="text-center py-4">Loading payments...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="card">
//             <div className="card-body">
//                 <div className="table-responsive">
//                     <table className="table table-hover table-center mb-0" ref={tableRef}>
//                         <thead>
//                             <tr>
//                                 {tableHeaders.map((header, index) => (
//                                     <th key={index}>{header}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {datas.length > 0 ? (
//                                 datas.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{item.serialNo}</td>
//                                         <td>#{item.paymentId}</td>
//                                         <td>{item.orderId}</td>
//                                         <td>{item.userName}</td>
//                                         <td>₹{item.amount}</td>
//                                         <td>{item.currency}</td>
//                                         <td>
//                                             <span className={`badge bg-${item.type === 'ONLINE' ? 'success' : 'warning'}-light`}>
//                                                 {item.type}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             <span className={`badge bg-${item.status === 'SUCCESS' ? 'success' : 'secondary'}-light`}>
//                                                 {item.status}
//                                             </span>
//                                         </td>
//                                         <td>{item.createdAt}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={tableHeaders.length} className="text-center">
//                                         No payments found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default paymentTable
