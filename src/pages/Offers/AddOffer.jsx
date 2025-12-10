// pages/Offers/CreateOffer.jsx
import { useNavigate } from 'react-router-dom'
import OfferForm from '../../components/offers/OfferForm'

const Offer = () => {
    const navigate = useNavigate();
    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5>Create Offer</h5>
                        <div className="list-btn">
                            <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
                                <i className="fas fa-arrow-left me-2"></i> Back
                            </button>
                        </div>
                    </div>
                </div>
                <OfferForm />
            </div>
        </div>
    )
}

export default Offer;
