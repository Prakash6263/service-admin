import  { useRef, useState, useEffect } from "react";
import UserTable from "../../components/Customers/customers";
import { getCustomerList } from '../../api'
const Dealer = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true)

  const tableHeaders = [
    "#",
    "Customer ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "State",
    "Pincode",
    "Is Verified?",
    "Blocked?",
    "Wallet (₹)",
    "Commission (%)",
    "OTP",
    "Created At",
    "Updated At",
    "Image",
    "Action"
  ];



  const triggerDownloadExcel = useRef(null);
  const triggerDownloadPDF = useRef(null);


  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true)
      try {
        const response = await getCustomerList(); 
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dealer list:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchDealers();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => !prev); // Toggle refresh state to trigger re-fetch
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Customers</h5>
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

                {/* <li>
                  <Link className="btn btn-primary" to="/add-dealer">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                    Add New
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        <UserTable
          loading={loading}
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text={"Customers"}
          onDealerDeleted={handleRefresh}
        />

      </div>
    </div>
  );
};

export default Dealer;
