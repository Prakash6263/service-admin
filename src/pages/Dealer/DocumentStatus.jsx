import React, { useEffect, useState } from "react";
import { getAllDealersWithDocFalse } from "../../api";
import DocumentStatusTable from "../../components/Dealers/DocumentStatusTable";

export default function DocumentStatus() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const tableHeaders = [
    "#",
    "Name",
    "Email",
    "Phone",
    "Aadhar No",
    "Aadhar Image",
    "PAN No",
    "PAN Image",
  ];
  

    useEffect(() => {
        const fetchDealers = async () => {
          try {
            const resp = await getAllDealersWithDocFalse();
            if (resp) {
              const pending = resp.data.filter(d => !d.isDoc);
              setData(pending);
            }
          } catch (err) {
            console.error("Error fetching dealers for verification:", err);
          }
        };

        fetchDealers();
      }, [refresh]);

  const handleRefresh = () => setRefresh((prev) => !prev);
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Document Status</h5>
          </div>
        </div>

        <DocumentStatusTable
          datas={data}
          tableHeaders={tableHeaders}
          text="Pending Verifications"
          onDealerVerified={handleRefresh}
        />
      </div>
    </div>
  );
}
