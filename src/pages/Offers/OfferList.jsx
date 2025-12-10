import React, { useRef, useState, useEffect } from "react";
import ServiceTable from "../../components/offers/offerList";
import { getOffers } from "../../api";
import { Link } from "react-router-dom";
const OfferList = () => {
  const [data, setData] = useState([]);
  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const tableHeaders = [
    "#",
    "Offer ID",
    "Promo Code",
    "Service Name",
    "Service Image",
    "Discount (%)",
    "Min Order Amount",
    "Start Date",
    "End Date",
    "Actions",
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const response = await getOffers();
        if (response.status === 200) {
          setData(response.data); // Offers come from response.data
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Offers</h5>
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
                  <Link to="/add-offer" className="btn btn-primary">
                    <i className="fa fa-plus me-1" />
                    Add Offer
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
          text={"Offers"}
          onOfferDeleted={handleRefresh}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default OfferList;
