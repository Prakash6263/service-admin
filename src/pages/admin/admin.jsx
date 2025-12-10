import React, { useRef } from "react";
import Alladmins from "../../components/Admin/AdminList/AdminList";
import { Link } from "react-router-dom";

const Admin = () => {
  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Admins</h5>
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
                      <ul className="d-block w-25">
                        <li style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <button className="d-flex align-items-center download-item" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadExcel.current) {
                                triggerDownloadExcel.current();
                              }
                            }} style={{textDecoration:"none"}}>
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
                            }} style={{textDecoration:"none"}}>
                            <i className="far fa-file-pdf me-2" />
                            PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <Link className="btn btn-primary" to="/addadmin">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                    Add New
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Alladmins triggerDownloadExcel={triggerDownloadExcel} triggerDownloadPDF={triggerDownloadPDF} />
      </div>
    </div>
  );
};

export default Admin;
