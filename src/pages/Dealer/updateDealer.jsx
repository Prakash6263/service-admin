import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DealerForm from '../../components/Dealers/updateDealer';
import { getDealerById } from "../../api"
import Swal from 'sweetalert2';
import axios from 'axios';

const DealerUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dealerData, setDealerData] = useState(null);

useEffect(() => {
  const fetchDealer = async () => {
    try {
      const res = await getDealerById(id)
      if (res.status) {
        setDealerData(res.data)
      } else {
        Swal.fire("Error", "Failed to fetch dealer data", "error")
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while fetching dealer data", "error")
    }
  }

  fetchDealer()
}, [id])

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5>Edit Dealer</h5>
                        <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left me-2"></i> Back
                        </button>
                    </div>
                </div>
                {dealerData ? (
                    <DealerForm dealerData={dealerData} dealerId={dealerData._id} isEdit={true} />
                ) : (
                    <p>Loading dealer data...</p>
                )}
            </div>
        </div>
    );
};

export default DealerUpdate;