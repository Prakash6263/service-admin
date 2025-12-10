import React, { useRef, useState, useEffect } from "react";
import UserTable from "../../components/Booking/BookingTable";
import { getAllBookings } from '../../api';

const Bookings = () => {
  const [data, setData] = useState([]);

  const tableHeaders = [
    "#",
    "Booking ID",
    "User Name",
    "User Email",
    "User Phone",
    "User City",
    "User Address",
    "Dealer Name",
    "Dealer Phone",
    "Dealer Address",
    "Service Name",
    "Service Description",
    "Service Estimated Cost",
    "Pickup Date",
    "Pickup Status",
    "Booking Status",
    "Total Bill",
    "Bill Status",
    "Created At",
    "Updated At",
  ];

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching booking list:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Bookings</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <div className="dropdown dropdown-action">
                    <button className="btn btn-primary" data-bs-toggle="dropdown" aria-expanded="false">
                      <span>
                        <i className="fe fe-download me-2" />
                      </span>
                      Download
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      <ul className="d-block">
                        <li>
                          <button className="d-flex align-items-center download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadExcel.current) {
                                triggerDownloadExcel.current();
                              }
                            }}>
                            <i className="far fa-file-excel me-2" />
                            EXCEL
                          </button>
                        </li>
                        <li>
                          <button className="d-flex align-items-center download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadPDF.current) {
                                triggerDownloadPDF.current();
                              }
                            }}>
                            <i className="far fa-file-pdf me-2" />
                            PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <UserTable
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text={"Bookings"}
        />
      </div>
    </div>
  );
};

export default Bookings;
