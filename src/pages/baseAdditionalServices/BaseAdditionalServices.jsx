'use client';

import React, { useRef, useState, useEffect } from "react";
import AllBaseServices from "./AllBaseServices";
import { Link } from "react-router-dom";
import axios from "axios";

const BaseAdditionalServices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const tableHeaders = [
    "#",
    "Service ID",
    "Service Name",
    "Description",
    "Created At",
    "Updated At",
    "Action",
  ];

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  const fetchBaseServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.mrbikedoctor.cloud/bikedoctor/additional-service/all-base-additional-services`
      );
      if (response.data.status === 200) {
        console.log("Base Services Response:", response.data);
        setData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching base services:", error);
      setError("Failed to load base services");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBaseServices();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Base Additional Services</h5>
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
                    to="/create-base-additional-service"
                  >
                    <i className="fa fa-plus-circle me-2" /> Add New Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <AllBaseServices
          datas={data}
          loading={loading}
          error={error}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text={"Base Services"}
          onServiceDeleted={fetchBaseServices}
        />
      </div>
    </div>
  );
};

export default BaseAdditionalServices;
