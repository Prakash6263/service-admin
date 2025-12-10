// // import { useRef, useState, useEffect } from "react";
// // import ServiceTable from "../../components/payment/payment";
// // import { getAllPayment } from "../../api";

// // const PaymentList = () => {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const tableHeaders = [
// //     "#",
// //     "Payment ID",
// //     "Order ID",
// //     "User Name",
// //     "Amount",
// //     "Currency",
// //     "Type",
// //     "Status",
// //     "Created At",
// //   ];

// //   const triggerDownloadExcel = useRef(null);
// //   const triggerDownloadPDF = useRef(null);

// //   useEffect(() => {
// //     const fetchPayments = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const response = await getAllPayment();
// //         if (response.status === 200) {
// //           setData(response.data);
// //         } else {
// //           setError("Failed to load payments.");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching payments:", error);
// //         setError("An error occurred while fetching payment data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPayments();
// //   }, []);

// //   return (
// //     <div className="page-wrapper">
// //       <div className="content container-fluid">
// //         <div className="page-header">
// //           <div className="content-page-header">
// //             <h5>Payments</h5>
// //             <div className="list-btn">
// //               <ul className="filter-list">
// //                 <li>
// //                   <div className="dropdown dropdown-action">
// //                     <button className="btn btn-primary" data-bs-toggle="dropdown">
// //                       <span><i className="fe fe-download me-2" /></span>
// //                       Download
// //                     </button>
// //                     <div className="dropdown-menu dropdown-menu-end">
// //                       <ul className="d-block">
// //                         <li>
// //                           <button className="download-item"
// //                             onClick={(e) => { e.preventDefault(); if (triggerDownloadExcel.current) triggerDownloadExcel.current(); }}>
// //                             <i className="far fa-file-excel me-2" /> EXCEL
// //                           </button>
// //                         </li>
// //                         <li>
// //                           <button className="download-item"
// //                             onClick={(e) => { e.preventDefault(); if (triggerDownloadPDF.current) triggerDownloadPDF.current(); }}>
// //                             <i className="far fa-file-pdf me-2" /> PDF
// //                           </button>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                   </div>
// //                 </li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>

// //         <ServiceTable
// //           datas={data}
// //           triggerDownloadExcel={triggerDownloadExcel}
// //           triggerDownloadPDF={triggerDownloadPDF}
// //           tableHeaders={tableHeaders}
// //           text={"Payments"}
// //           loading={loading}
// //           error={error}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default PaymentList;

// import { useRef, useState, useEffect } from "react";
// import ServiceTable from "../../components/payment/payment";
// import { getAllPayment } from "../../api";

// const PaymentList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const tableHeaders = [
//     "#",
//     "Payment ID",
//     "Order ID",
//     "User Name",
//     "Amount",
//     "Currency",
//     "Type",
//     "Status",
//     "Created At",
//   ];

//   const triggerDownloadExcel = useRef(null);
//   const triggerDownloadPDF = useRef(null);

//   // Function to transform API data to table format
//   const transformPaymentData = (apiData) => {
//     return apiData.map((payment, index) => ({
//       serialNo: index + 1,
//       paymentId: payment.cf_order_id || payment._id,
//       orderId: payment.orderId,
//       userName: payment.user_id?.email || "N/A",
//       amount: payment.orderAmount,
//       currency: payment.order_currency,
//       type: payment.payment_type,
//       status: payment.order_status,
//       createdAt: new Date(payment.create_date).toLocaleDateString(),
//       // Include raw data for exports if needed
//       rawData: payment
//     }));
//   };

//   useEffect(() => {
//     const fetchPayments = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await getAllPayment();
//         if (response.success ) {
//           const transformedData = transformPaymentData(response.data);
//           setData(transformedData);
//         } else {
//           setError("Failed to load payments.");
//         }
//       } catch (error) {
//         console.error("Error fetching payments:", error);
//         setError("An error occurred while fetching payment data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, []);

//   return (
//     <div className="page-wrapper">
//       <div className="content container-fluid">
//         <div className="page-header">
//           <div className="content-page-header">
//             <h5>Payments</h5>
//             {/* <div className="list-btn">
//               <ul className="filter-list">
//                 <li>
//                   <div className="dropdown dropdown-action">
//                     <button className="btn btn-primary" data-bs-toggle="dropdown">
//                       <span><i className="fe fe-download me-2" /></span>
//                       Download
//                     </button>
//                     <div className="dropdown-menu dropdown-menu-end">
//                       <ul className="d-block">
//                         <li>
//                           <button className="download-item"
//                             onClick={(e) => { 
//                               e.preventDefault(); 
//                               if (triggerDownloadExcel.current) triggerDownloadExcel.current(); 
//                             }}>
//                             <i className="far fa-file-excel me-2" /> EXCEL
//                           </button>
//                         </li>
//                         <li>
//                           <button className="download-item"
//                             onClick={(e) => { 
//                               e.preventDefault(); 
//                               if (triggerDownloadPDF.current) triggerDownloadPDF.current(); 
//                             }}>
//                             <i className="far fa-file-pdf me-2" /> PDF
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </li>
//               </ul>
//             </div> */}
//           </div>
//         </div>



//         <ServiceTable
//           datas={data}
//           triggerDownloadExcel={triggerDownloadExcel}
//           triggerDownloadPDF={triggerDownloadPDF}
//           tableHeaders={tableHeaders}
//           text={"Payments"}
//           loading={loading}
//           error={error}
//         />
//       </div>
//     </div>
//   );
// };

// export default PaymentList;

import { useRef, useState, useEffect } from "react";
import ServiceTable from "../../components/payment/payment";
import { getAllPayment } from "../../api";

const PaymentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  const tableHeaders = [
    "#",
    "Payment ID",
    "CF Order ID",
    "Order ID",
    "User ID",
    "User Name",
    "User Email",
    "User Phone",
    "Dealer ID",
    "Booking ID",
    "Booking Status",
    "Amount (₹)",
    "Currency",
    "Type",
    "Payment Method",
    "Transaction ID",
    "Status",
    "Created At",
    "Updated At",
  ];

  const transformPaymentData = (apiData) => {
    return apiData.map((payment, index) => ({
      serialNo: index + 1,
      paymentId: payment._id,
      cfOrderId: payment.cf_order_id || "N/A",
      orderId: payment.orderId || "N/A",

      // User details
      userId: payment.user_id?._id || "N/A",
      userName:
        `${payment.user_id?.first_name || ""} ${payment.user_id?.last_name || ""}`.trim() ||
        "N/A",
      userEmail: payment.user_id?.email || "N/A",
      userPhone: payment.user_id?.phone || "N/A",

      // Dealer / Booking info
      dealerId: payment.dealer_id || "N/A",
      bookingId: payment.booking_id?._id || "N/A",
      bookingStatus: payment.booking_id?.status || "N/A",

      // Payment info
      amount: payment.orderAmount || 0,
      currency: payment.order_currency || "INR",
      type: payment.payment_type || "N/A",
      method: payment.payment_method || "N/A",
      transactionId: payment.transaction_id || "N/A",
      status: payment.order_status || "N/A",

      // Dates
      createdAt: payment.createdAt
        ? new Date(payment.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
      updatedAt: payment.updatedAt
        ? new Date(payment.updatedAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",

      rawData: payment,
    }));
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPayment();
        if (response.success && Array.isArray(response.data?.payments)) {
          const transformed = transformPaymentData(response.data.payments);
          setData(transformed);
        } else {
          setError("No payments found or invalid response format.");
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("An error occurred while fetching payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Payments</h5>
          </div>
        </div>

        <ServiceTable
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text="Payments"
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default PaymentList;
