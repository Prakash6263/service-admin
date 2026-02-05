'use client';

import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AllServices from "./AllServices";
import { getAdditionalServices } from "../../api/additionalServiceApi";

const AServices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tableHeaders = [
    "#",
    "Service ID",
    "Service Name",
    "Image",
    "Description",
    "Dealer Name",
    "Bike Details (CC & Price)",
    "Actions",
  ];

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdditionalServices();
      setData(response?.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Additional Services</h5>
            <div className="list-btn">
              <ul className="filter-list">
                <li>
                  <div className="dropdown dropdown-action">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="dropdown"
                    >
                      <span>
                        <i className="fe fe-download me-2" />
                      </span>
                      Download
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      <ul className="d-block">
                        <li>
                          <button
                            className="download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadExcel.current)
                                triggerDownloadExcel.current();
                            }}
                          >
                            <i className="far fa-file-excel me-2" /> EXCEL
                          </button>
                        </li>
                        <li>
                          <button
                            className="download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadPDF.current)
                                triggerDownloadPDF.current();
                            }}
                          >
                            <i className="far fa-file-pdf me-2" /> PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    className="btn btn-primary"
                    to="/create-additional-service"
                  >
                    <i className="fa fa-plus-circle me-2" /> Add New Services
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <AllServices
          datas={data}
          loading={loading}
          error={error}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text={"Additional Services"}
          onServiceDeleted={fetchServices}
        />
      </div>
    </div>
  );
};

export default AServices;
