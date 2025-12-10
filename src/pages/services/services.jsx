import React, { useRef, useState, useEffect } from "react";
import ServiceTable from "../../components/Service/ServiceTable";
import { Link } from "react-router-dom";
import { getServiceList } from "../../api";

const Services = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const tableHeaders = [
    "#",
    "Service ID",
    "Service Name",
    "Image",
    "Description",
    "Dealer Name",
    "Bike Details (CC & Price)",
    "Created At",
    "Updated At",
    "Action",
  ];
  

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServiceList();
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Services</h5>
            <div className="list-btn">
              <ul className="filter-list">
                <li>
                  <div className="dropdown dropdown-action">
                    <button className="btn btn-primary" data-bs-toggle="dropdown">
                      <span><i className="fe fe-download me-2" /></span>
                      Download
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      <ul className="d-block">
                        <li>
                          <button className="download-item"
                            onClick={(e) => { e.preventDefault(); if (triggerDownloadExcel.current) triggerDownloadExcel.current(); }}>
                            <i className="far fa-file-excel me-2" /> EXCEL
                          </button>
                        </li>
                        <li>
                          <button className="download-item"
                            onClick={(e) => { e.preventDefault(); if (triggerDownloadPDF.current) triggerDownloadPDF.current(); }}>
                            <i className="far fa-file-pdf me-2" /> PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <Link className="btn btn-primary" to="/addServices">
                    <i className="fa fa-plus-circle me-2" /> Add New Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ServiceTable
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text={"Services"}
          onServiceDeleted={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Services;
