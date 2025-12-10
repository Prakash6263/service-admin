import React, { useRef, useState, useEffect } from "react";
import UserTable from "../../components/Dealers/DealerTable";
import { Link } from "react-router-dom";
import { getDealerList } from "../../api";
const Dealer = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const tableHeaders = [
    "#",
    "Dealer ID",
    "Commission Charging (%)",
    "Tax Charging(%)",
    "Owner Name",
    // "Owner Permanent Address",
    // "Owner Present Address",
    "Aadhar Card No.",
    "Pan Card No.",
    "Shop Name",
    "Shop Email",
    "Shop Phone",
    "Shop Address",
    "Shop State",
    "Shop PinCode",
    "Is Verified",
    "Blocked?",
    "Created At",
    "Updated At",
    "City",
    "Beneficiary Name",
    "Beneficiary Account No",
    "Beneficiary IFSC",
    "Is Profile Completed?",
    "Is Document Added?",
    "Status",
    "Action",
  ];

  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await getDealerList();
        if (response.status === 200) {
          console.log("Response:- ", response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dealer list:", error);
      }
    };

    fetchDealers();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Dealers</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <div className="dropdown dropdown-action">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
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
                            className="d-flex align-items-center download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadExcel.current) {
                                triggerDownloadExcel.current();
                              }
                            }}
                          >
                            <i className="far fa-file-excel me-2" />
                            EXCEL
                          </button>
                        </li>
                        <li>
                          <button
                            className="d-flex align-items-center download-item"
                            onClick={(e) => {
                              e.preventDefault();
                              if (triggerDownloadPDF.current) {
                                triggerDownloadPDF.current();
                              }
                            }}
                          >
                            <i className="far fa-file-pdf me-2" />
                            PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                <li>
                  <Link className="btn btn-primary" to="/add-dealer">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                    Add New
                  </Link>
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
          text={"Dealers"}
          onDealerDeleted={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Dealer;
